import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { build } from "../../scripts/build/build.ts";
import { zedTheme } from "../../packages/zed/adapter.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
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
      assert.equal(rendered.style["editor.foreground"], theme.ui.text.primary);
      assert.equal(
        rendered.style["terminal.ansi.bright_red"],
        theme.terminal.bright.red,
      );
      assert.equal(rendered.style.syntax.variable, undefined);
      assert.equal(rendered.style.syntax.function.color, theme.syntax.function);
      assert.equal(
        rendered.style.players[0].selection,
        theme.ui.selection.background,
      );
    }
    assert.match(
      await readFile(join(target, "extension.toml"), "utf8"),
      /themes = \["themes\/kanagawa-paper.json"\]/,
    );
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
