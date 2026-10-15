import importlib.util
import json
import os
import shutil
import subprocess
import tempfile
import types
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "coordinator", ROOT / "scripts/release/coordinator.py"
)
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
SEMANTIC = os.environ.get("SEMANTIC_RELEASE", shutil.which("semantic-release"))


@unittest.skipUnless(
    SEMANTIC, "Install scripts/release/requirements.txt for release selection tests"
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
        for target in release.TARGETS:
            for name in (
                f"scripts/release/{target}.toml",
                f"packages/{target}/CHANGELOG.md",
                f"packages/{target}/"
                + ("version.txt" if target == "neovim" else "package.json"),
            ):
                path = self.root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / name, path)
        (self.root / "shared").mkdir()
        (self.root / "shared/palette.ts").write_text("baseline\n")
        (self.root / "README.md").write_text("baseline\n")
        (self.root / "package.json").write_text(json.dumps({"name": "release-fixture", "private": True}))
        (self.root / "package-lock.json").write_text(json.dumps({"name": "release-fixture", "lockfileVersion": 3, "packages": {"": {"name": "release-fixture"}}}))
        self.commit("chore: baseline")
        for target, version in (("neovim", "4.1.0"), ("vscode", "2.2.1")):
            self.git("tag", f"{target}-source-{version}")
        self.root_patch = patch.object(release, "ROOT", self.root)
        self.root_patch.start()
        # Default function parameters retain the module's import-time root.
        self.run_patch = patch.object(release, "run", side_effect=self.run_command)
        self.run_patch.start()
        self.env_patch = patch.dict(os.environ, {"SEMANTIC_RELEASE": SEMANTIC})
        self.env_patch.start()

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

    def test_shared_build_selects_both(self):
        self.change("scripts/output.ts", "fix: common output lifecycle")
        self.assertEqual(set(release.prepare()["targets"]), {"neovim", "vscode"})

    def test_root_dependency_selects_both(self):
        # PSR reads this path only; keep the fixture lockfile valid for workflow tests.
        self.change("tsconfig.json", "fix: compiler contract")
        self.assertEqual(set(release.prepare()["targets"]), {"neovim", "vscode"})

    def test_shared_feature(self):
        self.change("shared/palette.ts", "feat: shared palette")
        plan = release.prepare()
        self.assertEqual(
            {t: v["version"] for t, v in plan["targets"].items()},
            {"neovim": "4.2.0", "vscode": "2.3.0"},
        )
        for target in release.TARGETS:
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
            {"neovim": "4.1.1", "vscode": "2.2.2"},
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
        child = self.root / "scripts/release/coordinator.py"
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
        with patch.object(release, "open_pr") as open_pr, patch.dict(os.environ, {
            "ACTIONS_ID_TOKEN_REQUEST_URL": "https://example.invalid/oidc",
            "ACTIONS_ID_TOKEN_REQUEST_TOKEN": "fixture-token",
        }):
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

        def marketplace(version, path):
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
            with patch.object(
                release,
                "gh",
                side_effect=subprocess.CalledProcessError(
                    1, ["gh", "api"], stderr="denied"
                ),
            ), self.assertRaises(subprocess.CalledProcessError):
                release.release("neovim-1.0.0")
            with patch.object(
                release,
                "gh",
                return_value=json.dumps(
                    {"data": {"repository": None}, "errors": [{"message": "denied"}]}
                ),
            ), self.assertRaises(ValueError):
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
