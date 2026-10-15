import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { build, root } from "../../scripts/build/build.ts";
import { artifactParity } from "../support/files.ts";

test("VS Code preserves baseline output and extension packaging contracts", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa vscode "));
  try {
    const tree = await build("vscode", output);
    await artifactParity("vscode", tree);
    const metadata = JSON.parse(
      await readFile(join(tree, "package.json"), "utf8"),
    );
    assert.deepEqual(
      [metadata.publisher, metadata.name],
      ["SimonHo", "kanagawa-paper"],
    );
    for (const entry of metadata.contributes.themes) {
      const text = await readFile(join(tree, entry.path), "utf8"),
        theme = JSON.parse(text);
      assert.ok(Object.keys(theme.colors).length);
      assert.ok(theme.tokenColors.length);
      assert.ok(!text.includes("@palette."));
      assert.ok(!text.includes("@theme."));
    }
    assert.equal(
      await readFile(join(tree, "LICENSE"), "utf8"),
      await readFile(join(root, "LICENSE"), "utf8"),
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("VS Code tracks current installed Neovim semantics", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa cross-target "));
  try {
    const neovim = await build("neovim", output),
      vscode = await build("vscode", output);
    const snapshot = join(output, "roles.json");
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/neovim/neovim_roles.lua"),
        neovim,
        snapshot,
      ],
      {
        cwd: output,
        encoding: "utf8",
        env: { ...process.env, NVIM_LOG_FILE: join(output, "nvim.log") },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const roles: Record<
      string,
      Record<string, Record<string, string>>
    > = JSON.parse(await readFile(snapshot, "utf8"));
    for (const [variant, theme] of Object.entries(roles)) {
      const rendered = JSON.parse(
        await readFile(
          join(vscode, `themes/kanagawa-paper-${variant}-color-theme.json`),
          "utf8",
        ),
      );
      const colors = rendered.colors;
      for (const [key, role] of Object.entries({
        "editor.foreground": theme.ui.fg,
        "editor.background": theme.ui.bg,
        "editorError.foreground": theme.diag.error,
        "editorWarning.foreground": theme.diag.warning,
        "ports.iconRunningProcessForeground": theme.diag.ok,
        "editorGutter.addedBackground": theme.vcs.added,
        "editorGutter.deletedBackground": theme.vcs.removed,
        "editorGutter.modifiedBackground": theme.vcs.changed,
        "editor.selectionHighlightBackground": theme.ui.bg_visual + "80",
      }))
        assert.equal(
          colors[key].toLowerCase(),
          role.toLowerCase(),
          `${variant}: ${key}`,
        );
      for (let index = 1; index <= 6; index++)
        assert.equal(
          colors[`editorBracketHighlight.foreground${index}`],
          theme.rainbow[`rainbow${index}`],
        );
      for (const color of [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white",
      ]) {
        const title = color[0].toUpperCase() + color.slice(1);
        assert.equal(colors[`terminal.ansi${title}`], theme.term[color]);
        assert.equal(
          colors[`terminal.ansiBright${title}`],
          theme.term[color + "_bright"],
        );
      }
      const tokens: Record<string, Record<string, string>> = Object.fromEntries(
        rendered.tokenColors.map(
          (token: { name: string; settings: Record<string, string> }) => [
            token.name,
            token.settings,
          ],
        ),
      );
      for (const [name, group, role] of [
        ["Constants", "syn", "constant"],
        ["Numbers", "syn", "number"],
        ["Characters", "syn", "string"],
        ["Strings: Escape Sequences", "syn", "regex"],
        ["Markup: Link", "syn", "special3"],
        ["Markup Quote", "syn", "punct"],
        ["Markup: Heading", "rainbow", "rainbow1"],
      ])
        assert.equal(tokens[name].foreground, theme[group][role]);
      for (let index = 1; index <= 6; index++)
        assert.equal(
          tokens[`Markup: Heading ${index}`].foreground,
          theme.rainbow[`rainbow${index}`],
        );
      assert.ok(!Object.hasOwn(tokens["Markup: Bold"], "foreground"));
      assert.ok(!Object.hasOwn(tokens["Markup: Italic"], "foreground"));
      assert.equal(colors["editor.findMatchForeground"], theme.ui.fg_dark);
      for (const [token, role] of Object.entries({
        function: "fun",
        type: "type",
        parameter: "parameter",
        operator: "operator",
        namespace: "keyword",
        "variable.defaultLibrary": "keyword",
        "method.defaultLibrary": "keyword",
        "function.defaultLibrary": "fun",
        stringLiteral: "string",
      }))
        assert.equal(rendered.semanticTokenColors[token], theme.syn[role]);
    }
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
