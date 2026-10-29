"""Prepare one release PR and publish immutable application candidates."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tarfile
import tempfile
import urllib.error
import urllib.request
import zipfile
from functools import cache
from pathlib import Path

TOOL_ROOT = Path(__file__).resolve().parents[3]
ROOT = TOOL_ROOT
sys.path.insert(0, str(Path(__file__).resolve().parent))
from definitions import discover
from rejections import load as load_rejections

PLAN = ".release-plan.json"
BRANCH = "automation/release"
VERSION = re.compile(r"\d+\.\d+\.\d+\Z")
VSCE = TOOL_ROOT / "scripts/ci/release/node_modules/.bin/vsce"


def run(
    *args: str,
    cwd: Path | None = None,
    env: dict | None = None,
    input: str | None = None,
) -> str:
    return subprocess.run(
        args,
        cwd=cwd or ROOT,
        env=env,
        input=input,
        text=True,
        check=True,
        stdout=subprocess.PIPE,
    ).stdout.strip()


def git(*args: str, **kwargs) -> str:
    return run("git", *args, **kwargs)


def gh(*args: str, **kwargs) -> str:
    return run("gh", *args, **kwargs)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n")


@cache
def repo_name() -> str:
    return gh("repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner")


def ref_sha(ref: str) -> str | None:
    result = subprocess.run(
        ["git", "rev-parse", "--verify", ref + "^{commit}"],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def remote_branch(target: str) -> str | None:
    rows = git("ls-remote", "--heads", "origin", "refs/heads/" + target)
    return rows.split()[0] if rows else None


def release_targets(*, validate_builds: bool = False) -> dict:
    definitions = discover(ROOT)
    if validate_builds:
        registered = json.loads(
            run("node", "--import", "tsx", "scripts/build/build.ts", "--list-targets")
        )
        unknown = set(definitions) - set(registered)
        if unknown:
            raise ValueError(
                f"Release targets have no registered builder: {sorted(unknown)}"
            )
    return definitions


def package_version(target: str) -> str:
    return release_targets()[target].version(ROOT)


def psr(target: str, *args: str) -> str:
    executable = os.environ.get("SEMANTIC_RELEASE", "semantic-release")
    return run(executable, "-c", release_targets()[target].config, "version", *args)


def prepared_paths(target: str) -> tuple[str, str]:
    definition = release_targets()[target]
    return definition.changelog, definition.version_file


def validate_plan(plan: dict, source: str | None = None) -> None:
    if plan.get("schema") != 1 or not re.fullmatch(
        r"[a-f0-9]{40}", plan.get("prepared_from", "")
    ):
        raise ValueError("Invalid release plan schema or source")
    if not plan.get("targets") or set(plan["targets"]) - set(
        release_targets(validate_builds=True)
    ):
        raise ValueError("Invalid release targets")
    for target, item in plan["targets"].items():
        for key in ("version", "previous_version"):
            if not VERSION.fullmatch(item[key]):
                raise ValueError(f"Invalid {target} {key}")
        if tuple(map(int, item["version"].split("."))) <= tuple(
            map(int, item["previous_version"].split("."))
        ):
            raise ValueError("Release version must advance")
        if item["previous_source_tag"] != f"{target}-source-{item['previous_version']}":
            raise ValueError("Invalid source baseline tag")
        if item["previous_distribution"] is not None and not re.fullmatch(
            r"[a-f0-9]{40}", item["previous_distribution"]
        ):
            raise ValueError("Invalid distribution parent")
    if source:
        if git("rev-parse", source + "^1") != plan["prepared_from"]:
            raise ValueError(
                "Stale release merge: first parent differs from prepared_from"
            )
        allowed = {PLAN}
        for target, item in plan["targets"].items():
            if package_version(target) != item["version"]:
                raise ValueError("Release plan and package version disagree")
            git(
                "merge-base",
                "--is-ancestor",
                item["previous_source_tag"],
                plan["prepared_from"],
            )
            allowed.update(prepared_paths(target))
        if (
            set(git("diff", "--name-only", plan["prepared_from"], source).splitlines())
            - allowed
        ):
            raise ValueError(
                "Release merge contains changes outside prepared version files"
            )


def prepare() -> dict | None:
    if git("branch", "--show-current") != "main":
        raise ValueError("Release preparation requires main")
    if git("status", "--porcelain", "--untracked-files=no"):
        raise ValueError("Release preparation requires a clean tracked tree")
    source = git("rev-parse", "HEAD")
    selected = {}
    allowed = {PLAN}
    for target, definition in release_targets(validate_builds=True).items():
        current = package_version(target)
        baseline = f"{target}-source-{current}"
        if not ref_sha("refs/tags/" + baseline):
            raise ValueError(
                f"Missing migration baseline {baseline}; seed the approved source tag first"
            )
        git("merge-base", "--is-ancestor", baseline, source)
        previous = psr(target, "--print-last-released").splitlines()[-1]
        next_version = psr(target, "--print").splitlines()[-1]
        if previous != current:
            raise ValueError(
                f"{target} package version differs from latest source release"
            )
        if next_version == current:
            continue
        if not VERSION.fullmatch(next_version):
            raise ValueError(f"Unexpected PSR version: {next_version}")
        changelog = ROOT / definition.changelog
        before = changelog.read_text()
        psr(
            target,
            "--no-commit",
            "--no-tag",
            "--no-push",
            "--no-vcs-release",
            "--skip-build",
        )
        if package_version(target) != next_version:
            raise ValueError(f"PSR failed to stamp {target}")
        marker = "<!-- version list -->"
        old_tail = before.split(marker, 1)[1].lstrip()
        new_tail = changelog.read_text().split(marker, 1)[1].lstrip()
        if old_tail and not new_tail.endswith(old_tail):
            raise ValueError("PSR changed historical changelog content")
        notes = new_tail[: -len(old_tail)].strip() if old_tail else new_tail.strip()
        selected[target] = {
            "version": next_version,
            "previous_version": current,
            "previous_source_tag": baseline,
            "previous_distribution": remote_branch(target),
            "notes": notes,
        }
        allowed.update(prepared_paths(target))
    if not selected:
        print("No applications due for release")
        return None
    changed = set(git("diff", "HEAD", "--name-only").splitlines())
    if changed - allowed:
        raise ValueError(f"Unexpected preparation edits: {changed - allowed}")
    plan = {"schema": 1, "prepared_from": source, "targets": selected}
    validate_plan(plan)
    write_json(ROOT / PLAN, plan)
    return plan


def open_pr(plan: dict) -> None:
    paths = [PLAN]
    for target in plan["targets"]:
        paths.extend(prepared_paths(target))
    git("add", "--", *paths)
    tree = git("write-tree")
    old = remote_branch(BRANCH)
    unchanged = False
    parents = ["-p", plan["prepared_from"]]
    if old:
        git("fetch", "origin", "refs/heads/" + BRANCH)
        unchanged = (
            git("rev-parse", old + "^{tree}") == tree
            and git("rev-parse", old + "^1") == plan["prepared_from"]
        )
        if old != plan["prepared_from"]:
            parents.extend(["-p", old])
    # Preserve automation history while preparing the tree from current main.
    if not unchanged:
        commit = git(
            "-c",
            "user.name=github-actions[bot]",
            "-c",
            "user.email=41898282+github-actions[bot]@users.noreply.github.com",
            "commit-tree",
            tree,
            *parents,
            "-m",
            "chore(release): prepare application releases",
        )
        git("checkout", "-B", BRANCH, commit)
        git("push", "origin", f"HEAD:refs/heads/{BRANCH}")
    title = "chore(release): " + ", ".join(
        f"{target} {item['version']}" for target, item in plan["targets"].items()
    )
    body = "Release candidates prepared from `" + plan["prepared_from"] + "`.\n\n"
    body += "\n\n".join(
        f"## {target} {item['version']}\n\n{item['notes']}"
        for target, item in plan["targets"].items()
    )
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md") as file:
        file.write(body)
        file.flush()
        prs = json.loads(
            gh(
                "pr",
                "list",
                "--head",
                BRANCH,
                "--base",
                "main",
                "--state",
                "open",
                "--json",
                "number",
            )
        )
        if prs and not unchanged:
            gh(
                "pr",
                "edit",
                str(prs[0]["number"]),
                "--title",
                title,
                "--body-file",
                file.name,
            )
        elif not prs:
            print(
                gh(
                    "pr",
                    "create",
                    "--head",
                    BRANCH,
                    "--base",
                    "main",
                    "--title",
                    title,
                    "--body-file",
                    file.name,
                )
            )


def release(tag: str) -> dict | None:
    # The REST tag endpoint omits drafts. Resolve either state through GraphQL,
    # then fetch its assets by release ID, as GitHub CLI's draft lookup does.
    owner, name = repo_name().split("/", 1)
    result = json.loads(
        gh(
            "api",
            "graphql",
            "-f",
            "query=query($owner:String!,$name:String!,$tag:String!) { repository(owner:$owner,name:$name) { release(tagName:$tag) { databaseId } } }",
            "-f",
            f"owner={owner}",
            "-f",
            f"name={name}",
            "-f",
            f"tag={tag}",
        )
    )
    if result.get("errors") or result["data"]["repository"] is None:
        raise ValueError("Could not look up GitHub release")
    found = result["data"]["repository"]["release"]
    if found is None:
        return None
    return json.loads(gh("api", f"repos/{repo_name()}/releases/{found['databaseId']}"))


def download_asset(asset: dict, destination: Path) -> None:
    with destination.open("wb") as file:
        subprocess.run(
            ["gh", "api", "-H", "Accept: application/octet-stream", asset["url"]],
            cwd=ROOT,
            stdout=file,
            check=True,
        )


def create_distribution(target: str, item: dict, source: str, tree: Path) -> str:
    provenance = {"source": source, "target": target, "version": item["version"]}
    write_json(tree / "source.json", provenance)
    git_dir = git("rev-parse", "--absolute-git-dir")
    with tempfile.TemporaryDirectory() as temporary:
        env = dict(os.environ, GIT_INDEX_FILE=str(Path(temporary) / "index"))
        prefix = ("--git-dir=" + git_dir, "--work-tree=" + str(tree))
        git(*prefix, "read-tree", "--empty", env=env)
        git(*prefix, "add", "--all", "--force", ".", cwd=tree, env=env)
        tree_sha = git(*prefix, "write-tree", env=env)
    timestamp = git("show", "-s", "--format=%cI", source)
    env = dict(
        os.environ,
        GIT_AUTHOR_NAME="github-actions[bot]",
        GIT_COMMITTER_NAME="github-actions[bot]",
        GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com",
        GIT_COMMITTER_EMAIL="41898282+github-actions[bot]@users.noreply.github.com",
        GIT_AUTHOR_DATE=timestamp,
        GIT_COMMITTER_DATE=timestamp,
    )
    parent = item["previous_distribution"]
    args = [
        "commit-tree",
        tree_sha,
        *(["-p", parent] if parent else []),
        "-m",
        f"{target} {item['version']}\n\nSource: {source}",
    ]
    return git(*args, env=env)


def immutable_tag(tag: str, sha: str) -> None:
    existing = ref_sha("refs/tags/" + tag)
    if existing and existing != sha:
        raise ValueError(f"Immutable tag collision: {tag}")
    if not existing:
        git("tag", tag, sha)
    git("push", "origin", "refs/tags/" + tag)


def archive_tree(tree: Path, output: Path) -> None:
    # Uncompressed tar avoids gzip timestamp variation and is adequate for this small plugin.
    with tarfile.open(output, "w") as archive:
        for path in sorted(tree.rglob("*")):
            if path.is_file():
                data = path.read_bytes()
                info = tarfile.TarInfo(str(path.relative_to(tree)))
                info.size = len(data)
                info.mode = 0o644
                info.mtime = 0
                archive.addfile(info, io.BytesIO(data))


def candidate(
    target: str, item: dict, source: str, output: Path, *, require_sealed: bool = False
) -> dict:
    tag = f"{target}-{item['version']}"
    current = release(tag)
    assets = {asset["name"]: asset for asset in current["assets"]} if current else {}
    metadata_path = output / "candidate.json"
    if require_sealed and (
        not current or not current["draft"] or "candidate.json" not in assets
    ):
        raise ValueError("Rejection requires a sealed draft candidate")
    if "candidate.json" in assets:
        download_asset(assets["candidate.json"], metadata_path)
        sealed = json.loads(metadata_path.read_text())
        expected = {"source": source, "target": target, "version": item["version"]}
        if any(sealed.get(k) != v for k, v in expected.items()):
            raise ValueError(f"Candidate identity collision: {tag}")
        if ref_sha("refs/tags/" + tag) != sealed["distribution"]:
            raise ValueError(f"Candidate tag collision: {tag}")
        for name, checksum in sealed["artifacts"].items():
            if Path(name).name != name or name not in assets:
                raise ValueError("Invalid candidate artifact")
            destination = output / name
            download_asset(assets[name], destination)
            if digest(destination) != checksum:
                raise ValueError(f"Candidate hash mismatch: {name}")
        return sealed
    if current and not current["draft"]:
        raise ValueError(f"Published release has no sealed candidate: {tag}")
    # Before sealing there is no registry side effect. An existing artifact wins on retry.
    sys.path.insert(0, str(ROOT / "scripts/build"))
    from assemble import assemble

    tree = assemble(target, output)
    distribution = create_distribution(target, item, source, tree)
    immutable_tag(tag, distribution)
    if not current:
        notes = output / "notes.md"
        notes.write_text(item["notes"])
        gh(
            "release",
            "create",
            tag,
            "--verify-tag",
            "--draft",
            "--title",
            f"{target} {item['version']}",
            "--notes-file",
            str(notes),
        )
    filename = f"{tag}.{release_targets()[target].extension}"
    artifact = output / filename
    if filename in assets:
        download_asset(assets[filename], artifact)
    else:
        package_artifact(target, tree, artifact)
    validate_artifact(target, artifact, tree)
    if filename not in assets:
        gh("release", "upload", tag, str(artifact))
    sealed = {
        "schema": 1,
        "source": source,
        "target": target,
        "version": item["version"],
        "distribution": distribution,
        "artifacts": {filename: digest(artifact)},
        "tools": {"python-semantic-release": "10.7.0", "vsce": "4.1.0"},
    }
    write_json(metadata_path, sealed)
    gh("release", "upload", tag, str(metadata_path))
    # Re-read the durable candidate; a successful upload alone is not the integrity check.
    return candidate(target, item, source, output)


def package_artifact(target: str, tree: Path, artifact: Path) -> None:
    if release_targets()[target].profile == "vscode-marketplace":
        run(str(VSCE), "package", "--out", str(artifact), cwd=tree)
    else:
        archive_tree(tree, artifact)


def check_packages() -> None:
    # Build first with the common build command. Package checks never publish.
    definitions = release_targets(validate_builds=True)
    with tempfile.TemporaryDirectory(prefix="kanagawa-packages-") as temporary:
        for target, definition in definitions.items():
            tree = ROOT / "dist" / target
            if not tree.is_dir():
                raise ValueError(f"Build {target} before checking its package")
            artifact = Path(temporary) / f"{target}.{definition.extension}"
            package_artifact(target, tree, artifact)
            validate_artifact(target, artifact, tree)
            print(f"Validated {target} package")


def validate_artifact(target: str, artifact: Path, tree: Path) -> None:
    if release_targets()[target].profile == "vscode-marketplace":
        with zipfile.ZipFile(artifact) as archive:
            entries = {
                name.lower(): archive.read(name)
                for name in archive.namelist()
                if not name.endswith("/")
            }
        entries["extension/license"] = entries.pop("extension/license.txt", None)
        for path in tree.rglob("*"):
            if (
                path.is_file()
                and entries.get("extension/" + str(path.relative_to(tree)).lower())
                != path.read_bytes()
            ):
                raise ValueError(f"VSIX does not match distribution: {path.name}")
    else:
        with tarfile.open(artifact) as archive:
            entries = {
                member.name: archive.extractfile(member).read()
                for member in archive
                if member.isfile()
            }
        expected = {
            str(path.relative_to(tree)): path.read_bytes()
            for path in tree.rglob("*")
            if path.is_file()
        }
        if entries != expected:
            raise ValueError("Archive does not match distribution")


def marketplace_url(target: str) -> str:
    publisher, extension = release_targets()[target].marketplace
    return (
        f"https://marketplace.visualstudio.com/items?itemName={publisher}.{extension}"
    )


def marketplace_matches(target: str, version: str, artifact: Path) -> bool:
    publisher, extension = release_targets()[target].marketplace
    url = f"https://marketplace.visualstudio.com/_apis/public/gallery/publishers/{publisher}/vsextensions/{extension}/{version}/vspackage"
    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            remote = response.read()
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return False
        raise
    with (
        zipfile.ZipFile(io.BytesIO(remote)) as archive,
        zipfile.ZipFile(artifact) as local,
    ):
        # The registry can add a signature; every payload entry must still match.
        for name in local.namelist():
            if name.endswith("/"):
                continue
            if name not in archive.namelist() or archive.read(name) != local.read(name):
                raise ValueError(f"Marketplace version collision: {version}, {name}")
    return True


def deployment(target: str, source: str, url: str) -> None:
    repository = repo_name()
    previous = json.loads(
        gh("api", f"repos/{repository}/deployments?sha={source}&environment={target}")
    )
    for item in previous:
        statuses = json.loads(
            gh("api", f"repos/{repository}/deployments/{item['id']}/statuses")
        )
        if any(
            status["state"] == "success" and status.get("environment_url") == url
            for status in statuses
        ):
            return
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json") as file:
        json.dump(
            {
                "ref": source,
                "environment": target,
                "auto_merge": False,
                "required_contexts": [],
                "description": f"Published {target}",
                "production_environment": True,
            },
            file,
        )
        file.flush()
        created = json.loads(
            gh("api", f"repos/{repository}/deployments", "--input", file.name)
        )
    gh(
        "api",
        f"repos/{repository}/deployments/{created['id']}/statuses",
        "-f",
        "state=success",
        "-f",
        "environment_url=" + url,
        "-F",
        "auto_inactive=true",
    )


def publish(plan: dict, source: str) -> None:
    validate_plan(plan, source)
    if git("rev-parse", "HEAD") != source:
        raise ValueError("Publication must run from the exact merged release source")
    rejected = {}
    for (declared_source, target, version), record in load_rejections(
        TOOL_ROOT / "scripts/ci/release/rejections.json"
    ).items():
        if declared_source != source:
            continue
        if (
            target not in plan["targets"]
            or plan["targets"][target]["version"] != version
            or release_targets()[target].profile != "vscode-marketplace"
        ):
            raise ValueError("Rejection does not match a Marketplace release target")
        rejected[target] = record
    sealed = {}
    with tempfile.TemporaryDirectory(prefix="kanagawa-release-") as temporary:
        output = Path(temporary)
        # Verify rejected identities before any ordinary candidate mutations.
        for target in sorted(plan["targets"], key=lambda t: t not in rejected):
            item = plan["targets"][target]
            directory = output / target
            directory.mkdir()
            sealed[target] = candidate(
                target, item, source, directory, require_sealed=target in rejected
            )
            if target in rejected:
                if (
                    digest(directory / "candidate.json")
                    != rejected[target]["candidate_sha256"]
                ):
                    raise ValueError("Rejected candidate metadata hash mismatch")
                artifact = directory / next(iter(sealed[target]["artifacts"]))
                if marketplace_matches(target, item["version"], artifact):
                    raise ValueError("Cannot reject a published Marketplace package")
        refs = []
        for target, item in plan["targets"].items():
            tag = f"{target}-source-{item['version']}"
            existing = ref_sha("refs/tags/" + tag)
            if existing and existing != source:
                raise ValueError(f"Source tag collision: {tag}")
            if not existing:
                git("tag", tag, source)
            refs.append("refs/tags/" + tag)
        git("push", "--atomic", "origin", *refs)
        for target, item in plan["targets"].items():
            if target in rejected:
                print(
                    f"Rejected {target} {item['version']}: {rejected[target]['reason']}",
                    file=sys.stderr,
                )
                continue
            tag = f"{target}-{item['version']}"
            current = release(tag)
            url = f"https://github.com/{repo_name()}/releases/tag/{tag}"
            if current["draft"]:
                if release_targets()[target].profile == "vscode-marketplace":
                    artifact = output / target / next(iter(sealed[target]["artifacts"]))
                    if not marketplace_matches(target, item["version"], artifact):
                        run(
                            str(VSCE),
                            "publish",
                            "--oidc",
                            "--packagePath",
                            str(artifact),
                        )
                        if not marketplace_matches(target, item["version"], artifact):
                            raise ValueError(
                                "Marketplace has not confirmed the frozen package; retry later"
                            )
                    url = marketplace_url(target)
                current_branch = remote_branch(target)
                expected = item["previous_distribution"]
                if current_branch not in (expected, sealed[target]["distribution"]):
                    raise ValueError(
                        f"Distribution channel changed unexpectedly: {target}"
                    )
                git(
                    "push",
                    "origin",
                    f"{sealed[target]['distribution']}:refs/heads/{target}",
                )
                gh("release", "edit", tag, "--draft=false", "--latest")
            if release_targets()[target].profile == "vscode-marketplace":
                url = marketplace_url(target)
            deployment(target, source, url)


def pending_source() -> str | None:
    return git("log", "-1", "--first-parent", "--format=%H", "--", PLAN) or None


def workflow() -> None:
    git("fetch", "origin", "main", "--tags")
    generated_source = os.environ.get("KANAGAWA_GENERATED_SOURCE")
    if generated_source and git("rev-parse", "origin/main") != generated_source:
        # A newer push has its own generation run queued. Do not prepare a PR
        # from source whose generated documentation has not been refreshed yet.
        print("Main advanced after generation; defer to its queued workflow")
        return
    git("checkout", "-B", "main", "origin/main")
    source = pending_source()
    if source:
        plan = json.loads(git("show", source + ":" + PLAN))
        # Reconcile completion and deployment status before opening another PR.
        with tempfile.TemporaryDirectory(prefix="kanagawa-source-") as temporary:
            checkout = Path(temporary) / "source"
            git("worktree", "add", "--detach", str(checkout), source)
            try:
                # Install the build dependency from this exact source's lockfile.
                run("npm", "ci", "--ignore-scripts", cwd=checkout)
                # Publication tooling can be reused; build inputs cannot.
                env = dict(os.environ, KANAGAWA_VSCE=str(VSCE))
                run(
                    sys.executable,
                    str(TOOL_ROOT / "scripts/ci/release/coordinator.py"),
                    "publish",
                    "--source-root",
                    str(checkout),
                    "--source-sha",
                    source,
                    cwd=checkout,
                    env=env,
                )
            finally:
                git("worktree", "remove", "--force", str(checkout))
    plan = prepare()
    if plan:
        open_pr(plan)


def configure_source(path: str, source: str) -> None:
    global ROOT
    checkout = Path(path).resolve()
    if not re.fullmatch(r"[a-f0-9]{40}", source):
        raise ValueError("Invalid publication source SHA")
    if (
        checkout != Path.cwd().resolve()
        or Path(git("rev-parse", "--show-toplevel", cwd=checkout)).resolve() != checkout
    ):
        raise ValueError("Publication source must be the current worktree root")
    common = ("rev-parse", "--path-format=absolute", "--git-common-dir")
    if git(*common, cwd=checkout) != git(*common, cwd=TOOL_ROOT):
        raise ValueError("Publication source belongs to another repository")
    if git("rev-parse", "HEAD", cwd=checkout) != source:
        raise ValueError("Publication source HEAD differs from requested SHA")
    ROOT = checkout


def main() -> None:
    global VSCE
    VSCE = Path(os.environ.get("KANAGAWA_VSCE", str(VSCE)))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "command", choices=("prepare", "publish", "run", "check-plan", "check-packages")
    )
    parser.add_argument("--source-root")
    parser.add_argument("--source-sha")
    args = parser.parse_args()
    if args.source_root or args.source_sha:
        if args.command != "publish" or not (args.source_root and args.source_sha):
            parser.error(
                "--source-root and --source-sha require publish and each other"
            )
        configure_source(args.source_root, args.source_sha)
    if args.command == "check-packages":
        check_packages()
    elif args.command == "prepare":
        prepare()
    elif args.command == "run":
        workflow()
    elif args.command == "publish":
        publish(json.loads((ROOT / PLAN).read_text()), git("rev-parse", "HEAD"))
    elif (ROOT / PLAN).exists():
        plan = json.loads((ROOT / PLAN).read_text())
        validate_plan(plan)
        base = os.environ.get("RELEASE_BASE_SHA")
        if base and plan["prepared_from"] != base:
            raise ValueError("Release PR is stale; refresh it from current main")


if __name__ == "__main__":
    main()
