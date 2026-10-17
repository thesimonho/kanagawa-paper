import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { build } from "../../scripts/build/build.ts";
import { zedTheme } from "../../packages/zed/adapter.ts";
import { validateZedTheme } from "../../packages/zed/build.ts";
import schema from "../../packages/zed/theme.schema.json" with { type: "json" };
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { neovimRoles } from "../../packages/neovim/adapter.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";

test("Zed builds both variants with valid inherited colors and extension metadata", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa zed "));
  try {
    const target = await build("zed", output);
    const path = join(target, "themes/kanagawa-paper.json");
    const first = await readFile(path, "utf8");
    const family = JSON.parse(first);
    assert.deepEqual(
      family.themes.map((theme: { appearance: string }) => theme.appearance),
      ["dark", "light"],
    );
    for (const [index, definition] of [ink, canvas].entries()) {
      const theme = resolveTheme(definition),
        rendered = family.themes[index];
      assert.deepEqual(
        Object.keys(rendered.style).sort(),
        Object.keys(schema.definitions.ThemeStyleContent.properties).sort(),
      );
      assert.equal(rendered.style["background.appearance"], "opaque");
      assert.equal(
        rendered.style["editor.gutter.background"],
        rendered.style["editor.background"],
      );
      assert.equal(rendered.style["border.transparent"].slice(-2), "00");
      assert.equal(
        rendered.style["panel.focused_border"],
        theme.ui.surface.tones.m3,
      );
      assert.equal(
        rendered.style["conflict.background"],
        theme.status.error.subtle,
      );
      assert.equal(rendered.style["renamed.border"], theme.changes.text.base);
      assert.equal(
        rendered.style["terminal.ansi.dim_red"],
        theme.terminal.normal.red + "AA",
      );
      assert.equal(rendered.style["editor.foreground"], theme.ui.text.primary);
      const neovim = resolveTheme(neovimRoles(definition));
      assert.equal(
        rendered.style["editor.line_number"],
        neovim.ui.line_numbers.default,
      );
      assert.equal(
        rendered.style["editor.active_line_number"],
        neovim.ui.line_numbers.active,
      );
      assert.equal(
        rendered.style["terminal.ansi.bright_red"],
        theme.terminal.bright.red,
      );
      for (const key of [
        "editor.indent_guide_active",
        "panel.indent_guide_active",
        "panel.indent_guide_hover",
      ])
        assert.equal(rendered.style[key], neovim.ui.indent_scope);
      assert.equal(rendered.style.syntax.variable, undefined);
      assert.equal(rendered.style.syntax.function.color, theme.syntax.function);
      assert.equal(
        rendered.style.syntax["punctuation.special"].color,
        neovim.syn.symbol,
      );
      assert.equal(
        rendered.style.syntax["variable.special"].color,
        neovim.syn.constant,
      );
      assert.equal(rendered.style.syntax.namespace.color, neovim.syn.keyword);
      assert.equal(
        rendered.style.syntax["keyword.import"].color,
        neovim.syn.preproc,
      );
      assert.equal(rendered.style.syntax.title.color, neovim.rainbow.rainbow1);
      assert.equal(rendered.style.players[0].cursor, neovim.ui.fg);
      assert.equal(
        rendered.style.syntax["function.builtin"].color,
        theme.syntax.builtinFunction,
      );
      assert.equal(
        rendered.style.syntax["diff.plus"].color,
        theme.changes.added.base,
      );
      assert.equal(
        rendered.style.syntax["selector.pseudo"].color,
        theme.syntax.attribute,
      );
      for (const scope of [
        "namespace",
        "primary",
        "selector",
        "punctuation.bracket",
        "punctuation.delimiter",
        "punctuation.list_marker",
        "punctuation.markup",
        "punctuation.special",
        "string.special.symbol",
        "text.literal",
        "variable.special",
        "variant",
        "diff.minus",
      ])
        assert.match(
          rendered.style.syntax[scope].color,
          /^#[\da-f]{6}$/i,
          scope,
        );
      assert.equal(
        rendered.style.players[0].selection,
        theme.ui.selection.background,
      );
    }
    assert.match(
      await readFile(join(target, "extension.toml"), "utf8"),
      /themes = \["themes\/kanagawa-paper.json"\]/,
    );
    const manifest = await readFile(join(target, "extension.toml"), "utf8");
    assert.match(manifest, /^id = "kanagawa-paper-theme"$/m);
    assert.match(manifest, /^version = "\d+\.\d+\.\d+"$/m);
    assert.equal(
      manifest,
      await readFile(
        new URL("../../packages/zed/extension.toml", import.meta.url),
        "utf8",
      ),
    );
    for (const name of ["README.md", "LICENSE", "CHANGELOG.md"])
      assert.ok((await readFile(join(target, name), "utf8")).length > 0);
    assert.throws(
      () =>
        zedTheme(
          {
            ...resolveTheme(ink),
            ui: { ...resolveTheme(ink).ui, selection: { background: "none" } },
          },
          "ink",
        ),
      /Invalid alpha/,
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("Zed rejects invalid colors, incomplete keys and invalid structured fields", () => {
  const family = {
    name: "Kanagawa Paper",
    author: "Simon Ho",
    themes: [zedTheme(resolveTheme(ink), "ink")],
  };
  validateZedTheme(family);
  const invalid = [
    (style: Record<string, any>) => {
      style["editor.foreground"] = "none";
    },
    (style: Record<string, any>) => {
      style.players[0].selection = "invalid";
    },
    (style: Record<string, any>) => {
      style.syntax.function.background_color = "invalid";
    },
    (style: Record<string, any>) => {
      style.accents[0] = "invalid";
    },
    (style: Record<string, any>) => {
      style.accents[0] = { color: "#ffffff" };
    },
    (style: Record<string, any>) => {
      style["background.appearance"] = "#ffffff";
    },
    (style: Record<string, any>) => {
      style["unknown.color"] = "#ffffff";
    },
    (style: Record<string, any>) => {
      delete style["panel.focused_border"];
    },
  ];
  for (const mutate of invalid) {
    const broken = structuredClone(family);
    mutate(broken.themes[0].style);
    assert.throws(
      () => validateZedTheme(broken),
      /Invalid Zed|Incomplete or unknown Zed/,
    );
  }
});
