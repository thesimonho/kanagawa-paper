import importlib.util
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("assemble", ROOT / "scripts/assemble.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class Packages(unittest.TestCase):
    def test_installable_neovim(self):
        with tempfile.TemporaryDirectory() as temporary:
            tree = module.assemble("neovim", Path(temporary))
            self.assertFalse((tree / "lua/kanagawa-paper/extras").exists())
            script = Path(temporary) / "check.lua"
            script.write_text(
                "vim.opt.runtimepath:prepend(" + json.dumps(str(tree)) + ")\n"
                'require("kanagawa-paper").setup({cache=false})\n'
                'for _, name in ipairs({"ink", "canvas"}) do\n'
                ' vim.cmd.colorscheme("kanagawa-paper-" .. name)\n'
                ' assert(vim.api.nvim_get_hl(0, {name="Normal"}).fg)\nend\n'
                "vim.cmd.helptags(" + json.dumps(str(tree / "doc")) + ")\n"
                'vim.cmd("help kanagawa-paper.nvim")\n'
                'assert(vim.api.nvim_buf_get_name(0):match("kanagawa%-paper.nvim.txt$"))\n'
            )
            subprocess.run(
                ["nvim", "--headless", "--clean", "-l", str(script)],
                check=True,
                cwd=temporary,
            )
            self.assertEqual(
                (tree / "README.md").read_bytes(), (ROOT / "README.md").read_bytes()
            )

    def test_vscode_tracks_current_neovim_semantics(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            neovim = module.assemble("neovim", root)
            vscode = module.assemble("vscode", root)
            script = root / "roles.lua"
            script.write_text(
                "vim.opt.runtimepath:prepend(" + json.dumps(str(neovim)) + ")\n"
                "local roles = {}\n"
                'for _, variant in ipairs({"ink", "canvas"}) do\n'
                ' roles[variant] = require("kanagawa-paper.colors").setup({_theme=variant}).theme\n'
                "end\n"
                "vim.fn.writefile({vim.json.encode(roles)}, "
                + json.dumps(str(root / "roles.json"))
                + ")\n"
            )
            subprocess.run(
                ["nvim", "--headless", "--clean", "-l", str(script)],
                cwd=root,
                check=True,
            )
            roles = json.loads((root / "roles.json").read_text())
            for variant, theme in roles.items():
                rendered = json.loads(
                    (
                        vscode / "themes" / f"kanagawa-paper-{variant}-color-theme.json"
                    ).read_text()
                )
                colors = rendered["colors"]
                for key, role in {
                    "editor.foreground": theme["ui"]["fg"],
                    "editor.background": theme["ui"]["bg"],
                    "editorError.foreground": theme["diag"]["error"],
                    "editorWarning.foreground": theme["diag"]["warning"],
                    "ports.iconRunningProcessForeground": theme["diag"]["ok"],
                    "editorGutter.addedBackground": theme["vcs"]["added"],
                    "editorGutter.deletedBackground": theme["vcs"]["removed"],
                    "editorGutter.modifiedBackground": theme["vcs"]["changed"],
                    "editor.selectionHighlightBackground": theme["ui"]["bg_visual"]
                    + "80",
                }.items():
                    self.assertEqual(colors[key].lower(), role.lower(), (variant, key))
                for index in range(1, 7):
                    self.assertEqual(
                        colors[f"editorBracketHighlight.foreground{index}"],
                        theme["rainbow"][f"rainbow{index}"],
                    )
                for color in (
                    "black",
                    "red",
                    "green",
                    "yellow",
                    "blue",
                    "magenta",
                    "cyan",
                    "white",
                ):
                    self.assertEqual(
                        colors["terminal.ansi" + color.title()], theme["term"][color]
                    )
                    self.assertEqual(
                        colors["terminal.ansiBright" + color.title()],
                        theme["term"][color + "_bright"],
                    )
                token_colors = {
                    token["name"]: token["settings"]
                    for token in rendered["tokenColors"]
                }
                for name, group, role in (
                    ("Constants", "syn", "constant"),
                    ("Numbers", "syn", "number"),
                    ("Characters", "syn", "string"),
                    ("Strings: Escape Sequences", "syn", "regex"),
                    ("Markup: Link", "syn", "special3"),
                    ("Markup Quote", "syn", "punct"),
                    ("Markup: Heading", "rainbow", "rainbow1"),
                ):
                    self.assertEqual(
                        token_colors[name]["foreground"], theme[group][role]
                    )
                for index in range(1, 7):
                    self.assertEqual(
                        token_colors[f"Markup: Heading {index}"]["foreground"],
                        theme["rainbow"][f"rainbow{index}"],
                    )
                self.assertNotIn("foreground", token_colors["Markup: Bold"])
                self.assertNotIn("foreground", token_colors["Markup: Italic"])
                self.assertEqual(
                    colors["editor.findMatchForeground"], theme["ui"]["fg_dark"]
                )
                for token, role in {
                    "function": "fun",
                    "type": "type",
                    "parameter": "parameter",
                    "operator": "operator",
                    "namespace": "keyword",
                    "variable.defaultLibrary": "keyword",
                    "method.defaultLibrary": "keyword",
                    "function.defaultLibrary": "fun",
                    "stringLiteral": "string",
                }.items():
                    self.assertEqual(
                        rendered["semanticTokenColors"][token], theme["syn"][role]
                    )

    def test_vscode_contract(self):
        with tempfile.TemporaryDirectory() as temporary:
            tree = module.assemble("vscode", Path(temporary))
            metadata = json.loads((tree / "package.json").read_text())
            self.assertEqual(
                (metadata["publisher"], metadata["name"]), ("SimonHo", "kanagawa-paper")
            )
            for entry in metadata["contributes"]["themes"]:
                theme = json.loads((tree / entry["path"]).read_text())
                self.assertTrue(theme["colors"])
                self.assertTrue(theme["tokenColors"])
                self.assertNotIn("@palette.", json.dumps(theme))
                self.assertNotIn("@theme.", json.dumps(theme))
            first = {
                str(p.relative_to(tree)): p.read_bytes()
                for p in tree.rglob("*")
                if p.is_file()
            }
            module.assemble("vscode", Path(temporary))
            second = {
                str(p.relative_to(tree)): p.read_bytes()
                for p in tree.rglob("*")
                if p.is_file()
            }
            self.assertEqual(first, second)
            self.assertEqual(
                (tree / "LICENSE").read_bytes(), (ROOT / "LICENSE").read_bytes()
            )
