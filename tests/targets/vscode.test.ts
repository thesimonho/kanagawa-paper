import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { build, root } from "../../scripts/build/build.ts";
import { artifactParity } from "../support/files.ts";
import type { NeovimColors } from "../../packages/neovim/adapter.ts";
import { validateTheme } from "../../packages/vscode/build.ts";

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
      validateTheme(theme);
      const opaqueOccurrence = structuredClone(theme);
      opaqueOccurrence.colors["editor.selectionHighlightBackground"] =
        theme.colors["editor.selectionBackground"] + "FF";
      assert.throws(
        () => validateTheme(opaqueOccurrence),
        /Selection color must be nonopaque/,
      );
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
    const highlightSnapshot = join(output, "highlights.json");
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/neovim/neovim_roles.lua"),
        neovim,
        snapshot,
        highlightSnapshot,
      ],
      {
        cwd: output,
        encoding: "utf8",
        env: {
          ...process.env,
          NVIM_LOG_FILE: join(output, "nvim.log"),
          XDG_CACHE_HOME: join(output, "cache"),
          XDG_STATE_HOME: join(output, "state"),
          XDG_DATA_HOME: join(output, "data"),
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const roles: Record<string, NeovimColors> = JSON.parse(
      await readFile(snapshot, "utf8"),
    );
    const highlights: Record<
      string,
      Record<string, { fg: number; bold?: boolean; italic?: boolean }>
    > = JSON.parse(await readFile(highlightSnapshot, "utf8"));
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
        "editorIndentGuide.activeBackground1": theme.ui.indent_scope,
        "editorIndentGuide.background1": theme.ui.indent,
        "editorLineNumber.foreground": theme.ui.line_numbers.default,
        "editorLineNumber.activeForeground": theme.ui.line_numbers.active,
        "editor.background": theme.ui.bg,
        "editorError.foreground": theme.diag.error,
        "editorWarning.foreground": theme.diag.warning,
        "editorInfo.foreground": theme.diag.info,
        "editorHint.foreground": theme.diag.hint,
        "editorInlayHint.foreground": theme.ui.fg_dim,
        "editorInlayHint.background": theme.accent.invert,
        "editorHoverWidget.background": theme.ui.float.bg,
        "editorHoverWidget.foreground": theme.ui.float.fg,
        "quickInput.background": theme.ui.float.bg,
        "quickInput.foreground": theme.ui.float.fg,
        "quickInputList.focusBackground": theme.ui.bg_cursorline_alt,
        "gitDecoration.conflictingResourceForeground": theme.diag.error,
        "editorHoverWidget.border": theme.ui.float.fg_border,
        "list.activeSelectionBackground": theme.ui.bg_cursorline_alt,
        "editor.selectionBackground": theme.ui.bg_visual,
        "editor.inactiveSelectionBackground": theme.ui.bg_visual,
        "terminal.selectionBackground": theme.ui.bg_visual,
        "editorBracketMatch.foreground": theme.diag.warning,
        "statusBar.foreground": theme.ui.fg_dim,
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
      for (const index of [1, 2, 3, 4, 5, 6] as const)
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
      ] as const) {
        const title = color[0].toUpperCase() + color.slice(1);
        assert.equal(colors[`terminal.ansi${title}`], theme.term[color]);
        assert.equal(
          colors[`terminal.ansiBright${title}`],
          theme.term[`${color}_bright`],
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
      for (const [name, role] of Object.entries({
        Constants: theme.syn.constant,
        Numbers: theme.syn.number,
        Characters: theme.syn.string,
        "HTML: Tag Names": theme.syn.tag,
        "CSS: Selectors": theme.syn.selector,
        "Strings: Escape Sequences": theme.syn.regex,
        "Markup: Link": theme.syn.special3,
        "Markup Quote": theme.syn.punct,
        "Markup: Heading": theme.rainbow.rainbow1,
      }))
        assert.equal(tokens[name].foreground, role);
      for (const index of [1, 2, 3, 4, 5, 6] as const)
        assert.equal(
          tokens[`Markup: Heading ${index}`].foreground,
          theme.rainbow[`rainbow${index}`],
        );
      const groups = highlights[variant];
      const hex = (name: string) =>
        "#" + groups[name].fg.toString(16).padStart(6, "0");
      for (const [name, group] of Object.entries({
        "Import Keywords": "@keyword.import",
        "Declaration Keywords": "@keyword.function",
        "Built-in Types": "@type.builtin",
        Modules: "@module",
        Members: "@variable.member",
        "Built-in Variables": "@variable.builtin",
        Booleans: "Boolean",
      }))
        assert.equal(tokens[name].foreground, hex(group));
      assert.equal(
        tokens.Modules.fontStyle.includes("bold"),
        Boolean(groups["@module"].bold),
      );
      assert.equal(
        tokens["Built-in Variables"].fontStyle.includes("italic"),
        Boolean(groups["@variable.builtin"].italic),
      );
      assert.equal(
        tokens.Booleans.fontStyle.includes("bold"),
        Boolean(groups.Boolean.bold),
      );
      assert.equal(tokens["Built-in Types"].fontStyle, "");
      const builtinVariableScopes: string[] = rendered.tokenColors.find(
        (token: { name: string }) => token.name === "Built-in Variables",
      ).scope;
      // Rust assigns the same scope to self/Self, and uses variable.language.super for modules.
      for (const scope of [
        "variable.language.self.rust",
        "variable.language.super.rust",
      ])
        assert.ok(
          !builtinVariableScopes.some(
            (selector) =>
              scope === selector || scope.startsWith(selector + "."),
          ),
        );

      for (const [token, group] of Object.entries({
        module: "@module",
        "variable.static": "@lsp.typemod.variable.static",
        selfParameter: "@variable.builtin",
        "class.builtin": "@type.builtin",
        "type.builtin": "@type.builtin",
        "variable.builtin.classMember": "@variable.member",
        "variable.classMember": "@variable.member",
      }))
        assert.equal(
          rendered.semanticTokenColors[token].foreground,
          hex(group),
        );
      assert.equal(
        rendered.semanticTokenColors.selfParameter.fontStyle,
        "italic",
      );
      // Parent-type modifier rules outrank custom parameter subtypes such as selfParameter.
      assert.ok(
        !Object.hasOwn(rendered.semanticTokenColors, "parameter.declaration"),
      );
      assert.ok(
        !Object.hasOwn(rendered.semanticTokenColors, "parameter.definition"),
      );
      assert.equal(
        rendered.semanticTokenColors["class.builtin"].fontStyle.includes(
          "bold",
        ),
        Boolean(groups.Type.bold),
      );
      assert.equal(
        rendered.semanticTokenColors["variable.builtin.classMember"].italic,
        false,
      );
      assert.equal(
        rendered.semanticTokenColors["variable.classMember.readonly"],
        theme.syn.constant,
      );
      assert.equal(
        rendered.semanticTokenColors.property,
        hex("@lsp.type.property"),
      );
      assert.equal(
        rendered.semanticTokenColors["property.readonly"],
        hex("@lsp.mod.readonly"),
      );
      // Providers can classify booleans and null with this same token; retain TextMate fallback.
      assert.ok(
        !Object.hasOwn(rendered.semanticTokenColors, "builtinConstant"),
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
        "function.defaultLibrary": "fun_builtin",
        stringLiteral: "string",
      } as const))
        assert.equal(
          typeof rendered.semanticTokenColors[token] === "string"
            ? rendered.semanticTokenColors[token]
            : rendered.semanticTokenColors[token].foreground,
          theme.syn[role],
        );
    }
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
