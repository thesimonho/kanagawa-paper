import importlib.util
import io
import json
import os
import re
import shutil
import subprocess
import tarfile
import tempfile
import types
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "coordinator", ROOT / "scripts/ci/release/coordinator.py"
)
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
SEMANTIC = os.environ.get("SEMANTIC_RELEASE", shutil.which("semantic-release"))


@unittest.skipUnless(
    SEMANTIC, "Install scripts/ci/release/requirements.txt for release selection tests"
)
class Selection(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name) / "source"
        self.root.mkdir()
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Test")
        self.git("config", "user.email", "test@example.com")
        self.git("config", "commit.gpgsign", "false")
        self.git("config", "core.hooksPath", "/dev/null")
        remote = Path(self.temporary.name) / "remote.git"
        subprocess.run(
            ["git", "init", "--bare", str(remote)], check=True, capture_output=True
        )
        self.git("remote", "add", "origin", str(remote))
        for target in release.release_targets():
            for name in (
                f"scripts/ci/release/{target}.toml",
                *release.prepared_paths(target),
            ):
                path = self.root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / name, path)
        # Keep fixtures stable when a release PR stamps real package versions.
        baselines = {"neovim": "4.1.0", "vscode": "2.2.1", "zed": "0.1.0"}
        for target, definition in release.release_targets().items():
            # A prepared release may already contain the fixture's next version.
            # Reset changelogs together with versions so PSR sees fresh history.
            (self.root / definition.changelog).write_text(
                "# Changelog\n\n<!-- version list -->\n"
            )
            path = self.root / definition.version_file
            if path.suffix == ".json":
                package = json.loads(path.read_text())
                package[definition.version_key] = baselines[target]
                path.write_text(json.dumps(package))
            else:
                path.write_text(
                    re.sub(
                        rf'^{re.escape(definition.version_key)} = "[^"\n]+"$',
                        f'{definition.version_key} = "{baselines[target]}"',
                        path.read_text(),
                        flags=re.MULTILINE,
                    )
                )
        (self.root / "node_modules").symlink_to(
            ROOT / "node_modules", target_is_directory=True
        )
        (self.root / ".git/info/exclude").write_text("node_modules\n")
        self.register_builds(*release.release_targets())
        (self.root / "shared").mkdir()
        (self.root / "shared/palette.ts").write_text("baseline\n")
        (self.root / "README.md").write_text("baseline\n")
        (self.root / "package.json").write_text(
            json.dumps({"name": "release-fixture", "private": True})
        )
        (self.root / "package-lock.json").write_text(
            json.dumps(
                {
                    "name": "release-fixture",
                    "lockfileVersion": 3,
                    "packages": {"": {"name": "release-fixture"}},
                }
            )
        )
        self.commit("chore: baseline")
        for target, definition in release.release_targets().items():
            self.git("tag", f"{target}-source-{definition.version(self.root)}")
        self.root_patch = patch.object(release, "ROOT", self.root)
        self.root_patch.start()
        # Default function parameters retain the module's import-time root.
        self.run_patch = patch.object(release, "run", side_effect=self.run_command)
        self.run_patch.start()
        self.env_patch = patch.dict(os.environ, {"SEMANTIC_RELEASE": SEMANTIC})
        self.env_patch.start()

    def register_builds(self, *targets):
        script = self.root / "scripts/build/build.ts"
        script.parent.mkdir(parents=True, exist_ok=True)
        script.write_text(
            f"process.stdout.write(JSON.stringify({json.dumps(targets)}));\n"
        )

    def add_archive_target(self):
        target = "fixture"
        package = self.root / "packages" / target
        package.mkdir()
        (package / "version.txt").write_text('VERSION = "1.0.0"\n')
        (package / "CHANGELOG.md").write_text("# Changelog\n\n<!-- version list -->\n")
        config = (self.root / "scripts/ci/release/neovim.toml").read_text()
        (self.root / "scripts/ci/release/fixture.toml").write_text(
            config.replace("neovim", target)
        )
        self.register_builds(*release.release_targets())
        self.commit("chore: add fixture application")
        self.git("tag", "fixture-source-1.0.0")
        return target

    def tearDown(self):
        self.env_patch.stop()
        self.run_patch.stop()
        self.root_patch.stop()
        self.temporary.cleanup()

    def run_command(self, *args, cwd=None, env=None, input=None):
        return subprocess.run(
            args,
            cwd=cwd or self.root,
            env=env,
            input=input,
            text=True,
            check=True,
            capture_output=True,
        ).stdout.strip()

    def git(self, *args):
        return subprocess.run(
            ["git", *args],
            cwd=self.root,
            check=True,
            text=True,
            capture_output=True,
        ).stdout.strip()

    def commit(self, message):
        self.git("add", ".")
        self.git("commit", "-m", message)

    def change(self, path, message):
        file = self.root / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(
            file.read_text() + "changed\n" if file.exists() else "changed\n"
        )
        self.commit(message)

    def test_added_archive_target_is_discovered_prepared_and_packaged(self):
        target = self.add_archive_target()
        self.change("packages/fixture/runtime", "fix: fixture runtime")
        plan = release.prepare()
        self.assertEqual(set(plan["targets"]), {target})
        self.assertEqual(plan["targets"][target]["version"], "1.0.1")
        with tempfile.TemporaryDirectory() as temporary:
            artifact = Path(temporary) / "fixture.tar"
            tree = self.root / "packages/fixture"
            release.package_artifact(target, tree, artifact)
            release.validate_artifact(target, artifact, tree)
        # Package checks discover the same target and cannot invoke remote tooling.
        for name in release.release_targets():
            tree = self.root / "dist" / name
            tree.mkdir(parents=True)
            (tree / "README.md").write_text("fixture package")
        original = release.package_artifact
        seen = []

        def package(name, tree, artifact):
            seen.append(name)
            if name == "vscode":
                with zipfile.ZipFile(artifact, "w") as archive:
                    archive.writestr("extension/readme.md", "fixture package")
            else:
                original(name, tree, artifact)

        with (
            patch.object(release, "package_artifact", side_effect=package),
            patch.object(
                release,
                "gh",
                side_effect=AssertionError("package checks must not publish"),
            ),
            patch.object(
                release,
                "git",
                side_effect=AssertionError("package checks must not mutate Git"),
            ),
        ):
            release.check_packages()
        self.assertEqual(seen, sorted(release.release_targets()))

    def test_invalid_definitions_fail_before_preparation(self):
        path = self.root / "scripts/ci/release/vscode.toml"
        original = path.read_text()
        cases = (
            original.replace('profile = "vscode-marketplace"', 'profile = "unknown"'),
            original.replace('profile = "vscode-marketplace"', ""),
            original.replace(
                "package.json:version", "package.json:version:unsupported"
            ),
            original.replace(
                "packages/vscode/package.json:version", "../escape:version"
            ),
        )
        for content in cases:
            with self.subTest(content=content):
                path.write_text(content)
                self.commit("chore: invalid release definition fixture")
                with patch.object(release, "psr") as psr, self.assertRaises(ValueError):
                    release.prepare()
                psr.assert_not_called()
        path.write_text(original)
        self.register_builds("neovim")
        self.commit("chore: missing builder fixture")
        with (
            patch.object(release, "psr") as psr,
            self.assertRaisesRegex(ValueError, "no registered builder"),
        ):
            release.prepare()
        psr.assert_not_called()

    def test_package_checks_require_built_distributions(self):
        with self.assertRaisesRegex(ValueError, "Build neovim"):
            release.check_packages()

    def test_target_local(self):
        self.change("packages/vscode/mapping.json", "fix: application mapping")
        plan = release.prepare()
        self.assertEqual(set(plan["targets"]), {"vscode"})
        self.assertEqual(plan["targets"]["vscode"]["version"], "2.2.2")
        self.assertEqual(
            json.loads((self.root / "packages/vscode/package.json").read_text())[
                "version"
            ],
            "2.2.2",
        )

    def test_zed_only_fix_stamps_manifest(self):
        self.change("packages/zed/adapter.ts", "fix: Zed syntax")
        plan = release.prepare()
        self.assertEqual(set(plan["targets"]), {"zed"})
        self.assertEqual(plan["targets"]["zed"]["version"], "0.1.1")
        self.assertIn(
            'version = "0.1.1"', (self.root / "packages/zed/extension.toml").read_text()
        )

    def test_zed_only_feature_advances_minor(self):
        self.change("packages/zed/adapter.ts", "feat: Zed state coverage")
        plan = release.prepare()
        self.assertEqual(set(plan["targets"]), {"zed"})
        self.assertEqual(plan["targets"]["zed"]["version"], "0.2.0")

    def test_zed_breaking_change_stays_below_one(self):
        self.change("packages/zed/adapter.ts", "feat!: Zed mapping contract")
        plan = release.prepare()
        self.assertEqual(set(plan["targets"]), {"zed"})
        self.assertEqual(plan["targets"]["zed"]["version"], "0.2.0")

    def test_zed_missing_baseline_rejected(self):
        self.git("tag", "-d", "zed-source-0.1.0")
        with self.assertRaisesRegex(
            ValueError, "Missing migration baseline zed-source-0.1.0"
        ):
            release.prepare()

    def test_shared_build_selects_all_release_targets(self):
        self.change("scripts/build/output.ts", "fix: common output lifecycle")
        self.assertEqual(set(release.prepare()["targets"]), {"neovim", "vscode", "zed"})

    def test_root_dependency_selects_all_release_targets(self):
        # PSR reads this path only; keep the fixture lockfile valid for workflow tests.
        self.change("tsconfig.json", "fix: compiler contract")
        self.assertEqual(set(release.prepare()["targets"]), {"neovim", "vscode", "zed"})

    def test_shared_feature(self):
        self.change("shared/palette.ts", "feat: shared palette")
        plan = release.prepare()
        self.assertEqual(
            {t: v["version"] for t, v in plan["targets"].items()},
            {"neovim": "4.2.0", "vscode": "2.3.0", "zed": "0.2.0"},
        )
        for target in release.release_targets():
            self.assertIn("shared palette", plan["targets"][target]["notes"].lower())
            self.assertIn(
                "<!-- version list -->",
                (self.root / f"packages/{target}/CHANGELOG.md").read_text(),
            )

    def test_shared_readme_fix(self):
        self.change("README.md", "fix: correct installation")
        plan = release.prepare()
        self.assertEqual(
            {t: v["version"] for t, v in plan["targets"].items()},
            {"neovim": "4.1.1", "vscode": "2.2.2", "zed": "0.1.1"},
        )

    def test_docs_and_extras_do_not_release(self):
        self.change("README.md", "docs: explain installation")
        self.change("extras/example", "fix: extra configuration")
        self.assertIsNone(release.prepare())

    def test_missing_baseline_rejected(self):
        self.git("tag", "-d", "vscode-source-2.2.1")
        with self.assertRaisesRegex(ValueError, "Missing migration baseline"):
            release.prepare()

    def test_stale_merge_rejected(self):
        self.change("shared/palette.ts", "fix: shared palette")
        plan = release.prepare()
        self.commit("chore(release): prepare application releases")
        release.validate_plan(plan, self.git("rev-parse", "HEAD"))
        self.change("unrelated", "chore: unrelated")
        with self.assertRaisesRegex(ValueError, "Stale release merge"):
            release.validate_plan(plan, self.git("rev-parse", "HEAD"))

    def test_release_pr_refresh_is_fast_forward_and_fresh(self):
        self.change("shared/palette.ts", "fix: shared palette")
        plan = release.prepare()
        with patch.object(release, "gh", return_value="[]"):
            release.open_pr(plan)
        previous = release.remote_branch(release.BRANCH)
        self.git("checkout", "main")
        self.change("shared/palette.ts", "feat: shared roles")
        refreshed = release.prepare()
        with patch.object(release, "gh", return_value='[{"number":1}]'):
            release.open_pr(refreshed)
        current = release.remote_branch(release.BRANCH)
        self.git("merge-base", "--is-ancestor", previous, current)
        self.assertEqual(self.git("rev-parse", "HEAD^1"), refreshed["prepared_from"])
        self.assertEqual(release.package_version("neovim"), "4.2.0")
        self.assertEqual(
            refreshed["targets"]["neovim"]["notes"].lower().count("shared palette"), 1
        )
        self.git("checkout", "main")
        identical = release.prepare()
        with patch.object(release, "gh", return_value='[{"number":1}]'):
            release.open_pr(identical)
        self.assertEqual(release.remote_branch(release.BRANCH), current)

    def test_workflow_defers_source_that_advanced_after_generation(self):
        generated = self.git("rev-parse", "HEAD")
        (self.root / "README.md").write_text("new source requiring regenerated help\n")
        self.commit("fix: update source")
        self.git("push", "origin", "main")
        with (
            patch.dict(os.environ, {"KANAGAWA_GENERATED_SOURCE": generated}),
            patch.object(release, "prepare") as prepare,
            patch.object(release, "pending_source") as pending,
        ):
            release.workflow()
            prepare.assert_not_called()
            pending.assert_not_called()

    def test_workflow_reconciles_exact_source_before_next_preparation(self):
        # Exercise real fetch/worktree/child-process plumbing with a local publisher.
        record = Path(self.temporary.name) / "published-source"
        child = self.root / "scripts/ci/release/coordinator.py"
        child.write_text(
            "import json, subprocess, os\nfrom pathlib import Path\n"
            "assert os.environ['ACTIONS_ID_TOKEN_REQUEST_URL'] == 'https://example.invalid/oidc'\n"
            "assert os.environ['ACTIONS_ID_TOKEN_REQUEST_TOKEN'] == 'fixture-token'\n"
            "assert os.environ['KANAGAWA_VSCE']\n"
            f"Path({str(record)!r}).write_text(subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip())\n"
            "plan=json.loads(Path('.release-plan.json').read_text())\n"
            "for target,item in plan['targets'].items():\n"
            " subprocess.run(['git','tag',target+'-source-'+item['version']],check=True)\n"
        )
        self.change("shared/palette.ts", "fix: shared palette")
        release.prepare()
        self.commit("chore(release): prepare application releases")
        source = self.git("rev-parse", "HEAD")
        self.change("packages/neovim/runtime.lua", "fix: subsequent runtime")
        latest = self.git("rev-parse", "HEAD")
        self.git("push", "origin", "main", "--tags")
        with (
            patch.object(release, "open_pr") as open_pr,
            patch.dict(
                os.environ,
                {
                    "ACTIONS_ID_TOKEN_REQUEST_URL": "https://example.invalid/oidc",
                    "ACTIONS_ID_TOKEN_REQUEST_TOKEN": "fixture-token",
                },
            ),
        ):
            release.workflow()
        self.assertEqual(record.read_text(), source)
        next_plan = open_pr.call_args.args[0]
        self.assertEqual(next_plan["prepared_from"], latest)
        self.assertEqual(set(next_plan["targets"]), {"neovim"})
        self.assertEqual(next_plan["targets"]["neovim"]["version"], "4.1.2")
        self.assertEqual(
            len(self.git("worktree", "list", "--porcelain").split("worktree ")) - 1, 1
        )

    def test_staggered_source_markers(self):
        self.change("shared/palette.ts", "fix: shared palette")
        plan = release.prepare()
        self.commit("chore(release): prepare application releases")
        for target, item in plan["targets"].items():
            self.git("tag", f"{target}-source-{item['version']}")
        self.change("packages/neovim/runtime.lua", "fix: neovim follow-up")
        second = release.prepare()
        self.assertEqual(set(second["targets"]), {"neovim"})
        self.assertEqual(second["targets"]["neovim"]["version"], "4.1.2")
        self.assertNotIn("shared palette", second["targets"]["neovim"]["notes"].lower())

    def test_publication_retry_keeps_frozen_artifact(self):
        self.add_archive_target()
        self.change("shared/palette.ts", "fix: shared palette")
        plan = release.prepare()
        self.commit("chore(release): prepare application releases")
        source = self.git("rev-parse", "HEAD")
        releases = {}
        uploaded = {}
        published = []
        package_count = []
        timeout = [True]
        partial_upload = [True]
        original_run = self.run_command

        def assemble(target, output):
            tree = output / target
            tree.mkdir()
            (tree / "README.md").write_text("Shared readme")
            if target == "zed":
                shutil.copy2(
                    self.root / "packages/zed/extension.toml", tree / "extension.toml"
                )
                (tree / "themes").mkdir()
                (tree / "themes/kanagawa-paper.json").write_text('{"themes": []}\n')
                (tree / "LICENSE").write_text("fixture license")
                shutil.copy2(
                    self.root / "packages/zed/CHANGELOG.md", tree / "CHANGELOG.md"
                )
            else:
                (tree / "package.json").write_text(
                    json.dumps({"version": plan["targets"][target]["version"]})
                )
            return tree

        def fake_gh(*args, **kwargs):
            if args[:2] == ("release", "create"):
                releases[args[2]] = {"draft": True, "assets": []}
            elif args[:2] == ("release", "upload"):
                path = Path(args[3])
                key = args[2] + "/" + path.name
                if (
                    args[2].startswith("vscode-")
                    and path.name == "candidate.json"
                    and partial_upload[0]
                ):
                    partial_upload[0] = False
                    raise OSError("interrupted before candidate sealing")
                if key in uploaded:
                    raise AssertionError("Attempt to replace an uploaded asset")
                uploaded[key] = path.read_bytes()
                releases[args[2]]["assets"].append({"name": path.name, "url": key})
            elif args[:2] == ("release", "edit"):
                releases[args[2]]["draft"] = False
            else:
                raise AssertionError(args)
            return ""

        def fake_run(*args, cwd=None, **kwargs):
            if args[0] == str(release.VSCE):
                if args[1] == "package":
                    package_count.append(1)
                    with zipfile.ZipFile(args[-1], "w") as archive:
                        for path in cwd.rglob("*"):
                            if path.is_file():
                                archive.writestr(
                                    "extension/" + str(path.relative_to(cwd)).lower(),
                                    path.read_bytes(),
                                )
                else:
                    self.assertEqual(args[1:4], ("publish", "--oidc", "--packagePath"))
                    published.append(Path(args[-1]).read_bytes())
                return ""
            return original_run(*args, cwd=cwd, **kwargs)

        def marketplace(target, version, path):
            self.assertEqual(target, "vscode")
            if not published:
                return False
            if timeout[0]:
                timeout[0] = False
                raise OSError("timeout after successful publication")
            self.assertEqual(path.read_bytes(), published[0])
            return True

        def download(asset, destination):
            destination.write_bytes(uploaded[asset["url"]])

        with (
            patch.dict(
                "sys.modules", {"assemble": types.SimpleNamespace(assemble=assemble)}
            ),
            patch.object(release, "gh", side_effect=fake_gh),
            patch.object(release, "run", side_effect=fake_run),
            patch.object(release, "release", side_effect=lambda tag: releases.get(tag)),
            patch.object(release, "download_asset", side_effect=download),
            patch.object(release, "repo_name", return_value="example/theme"),
            patch.object(release, "deployment"),
            patch.object(release, "marketplace_matches", side_effect=marketplace),
        ):
            with self.assertRaisesRegex(OSError, "before candidate sealing"):
                release.publish(plan, source)
            self.assertIsNone(release.ref_sha("refs/tags/neovim-source-4.1.1"))
            self.assertEqual(published, [])
            with self.assertRaisesRegex(OSError, "timeout"):
                release.publish(plan, source)
            self.assertFalse(releases["neovim-4.1.1"]["draft"])
            self.assertTrue(releases["vscode-2.2.2"]["draft"])
            first_assets = dict(uploaded)
            release.publish(plan, source)
            self.assertFalse(releases["vscode-2.2.2"]["draft"])
            self.assertFalse(releases["fixture-1.0.1"]["draft"])
            self.assertFalse(releases["zed-0.1.1"]["draft"])
            self.assertEqual(
                release.remote_branch("zed"), release.ref_sha("refs/tags/zed-0.1.1")
            )
            self.assertEqual(release.ref_sha("refs/tags/zed-source-0.1.1"), source)
            with tarfile.open(
                fileobj=io.BytesIO(uploaded["zed-0.1.1/zed-0.1.1.tar"])
            ) as archive:
                self.assertEqual(
                    set(archive.getnames()),
                    {
                        "README.md",
                        "LICENSE",
                        "CHANGELOG.md",
                        "extension.toml",
                        "themes/kanagawa-paper.json",
                        "source.json",
                    },
                )
                self.assertEqual(
                    archive.extractfile("extension.toml").read(),
                    (self.root / "packages/zed/extension.toml").read_bytes(),
                )
            self.assertEqual(
                release.remote_branch("fixture"),
                release.ref_sha("refs/tags/fixture-1.0.1"),
            )
            self.assertEqual(first_assets, uploaded)
            self.assertEqual(len(package_count), 1)
            self.assertEqual(len(published), 1)
            self.assertEqual(release.ref_sha("refs/tags/neovim-source-4.1.1"), source)
            self.assertEqual(release.ref_sha("refs/tags/vscode-source-2.2.2"), source)
            self.assertNotEqual(release.ref_sha("refs/tags/neovim-4.1.1"), source)
            self.assertEqual(
                release.remote_branch("neovim"),
                release.ref_sha("refs/tags/neovim-4.1.1"),
            )
            with self.assertRaisesRegex(ValueError, "Immutable tag collision"):
                release.immutable_tag("neovim-4.1.1", source)
            uploaded["vscode-2.2.2/vscode-2.2.2.vsix"] = b"corrupt"
            with self.assertRaisesRegex(ValueError, "hash mismatch"):
                release.publish(plan, source)
            self.assertEqual(len(published), 1)


class ArtifactValidation(unittest.TestCase):
    def test_release_lookup_finds_drafts_and_published_by_id(self):
        for draft in (True, False):
            with (
                self.subTest(draft=draft),
                patch.object(release, "repo_name", return_value="example/theme"),
            ):

                def fake_gh(*args, draft=draft):
                    if args[:2] == ("api", "graphql"):
                        return json.dumps(
                            {"data": {"repository": {"release": {"databaseId": 42}}}}
                        )
                    if args == ("api", "repos/example/theme/releases/42"):
                        return json.dumps(
                            {
                                "draft": draft,
                                "assets": [
                                    {"name": "candidate.json", "url": "asset-url"}
                                ],
                            }
                        )
                    # REST /releases/tags would not find a draft.
                    raise AssertionError(f"Unexpected release lookup: {args}")

                with patch.object(release, "gh", side_effect=fake_gh):
                    found = release.release("neovim-1.0.0")
                    self.assertEqual(found["draft"], draft)
                    self.assertEqual(found["assets"][0]["name"], "candidate.json")

    def test_release_lookup_distinguishes_missing_and_denied(self):
        with patch.object(release, "repo_name", return_value="example/theme"):
            missing = json.dumps({"data": {"repository": {"release": None}}})
            with patch.object(release, "gh", return_value=missing):
                self.assertIsNone(release.release("neovim-1.0.0"))
            with (
                patch.object(
                    release,
                    "gh",
                    side_effect=subprocess.CalledProcessError(
                        1, ["gh", "api"], stderr="denied"
                    ),
                ),
                self.assertRaises(subprocess.CalledProcessError),
            ):
                release.release("neovim-1.0.0")
            with (
                patch.object(
                    release,
                    "gh",
                    return_value=json.dumps(
                        {
                            "data": {"repository": None},
                            "errors": [{"message": "denied"}],
                        }
                    ),
                ),
                self.assertRaises(ValueError),
            ):
                release.release("neovim-1.0.0")

    def test_deterministic_archive_and_reject_mismatch(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            tree = root / "tree"
            tree.mkdir()
            (tree / "file").write_text("content")
            release.archive_tree(tree, root / "one.tar")
            release.archive_tree(tree, root / "two.tar")
            self.assertEqual(
                release.digest(root / "one.tar"), release.digest(root / "two.tar")
            )
            release.validate_artifact("neovim", root / "one.tar", tree)
            (tree / "file").write_text("changed")
            with self.assertRaisesRegex(ValueError, "does not match"):
                release.validate_artifact("neovim", root / "one.tar", tree)
