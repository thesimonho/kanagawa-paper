import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { rawPalette } from "../shared/palette.ts";
import { ink } from "../shared/themes/ink.ts";
import { canvas } from "../shared/themes/canvas.ts";
import { resolveTheme } from "../shared/color/evaluate.ts";
import { neovimRoles } from "../packages/neovim/adapter.ts";
const baseline = JSON.parse(
  readFileSync(new URL("./fixtures/colors.json", import.meta.url), "utf8"),
);
test("all palette names and exact hexes remain unchanged", () =>
  assert.deepEqual(rawPalette, baseline.ink.palette));
for (const [name, definition] of Object.entries({ ink, canvas })) {
  test(`${name}: all existing default roles retain their colors`, () => {
    const resolved = resolveTheme(neovimRoles(definition));
    resolved.ui.bg_gutter = "none";
    assert.deepEqual(resolved, baseline[name].theme);
  });
}

import { palette } from "../shared/palette.ts";
import { blend, brighten, saturate } from "../shared/color/expression.ts";
import { evaluate } from "../shared/color/evaluate.ts";
const math = JSON.parse(
  readFileSync(new URL("./fixtures/math.json", import.meta.url), "utf8"),
);
test("color arithmetic matches original Lua across the full palette and chained operations", () => {
  for (const [name, source] of Object.entries(palette)) {
    const dark = { kind: "literal", hex: "#223344" } as const;
    const light = { kind: "literal", hex: "#eeeeee" } as const;
    const cream = { kind: "literal", hex: "#e4dacb" } as const;
    assert.deepEqual(
      {
        brighten: evaluate(brighten(source, 0.2)),
        darken: evaluate(brighten(source, -0.6)),
        background: evaluate(brighten(source, 0.1, light)),
        saturate: evaluate(saturate(source, -0.2)),
        blend: evaluate(blend(source, dark, 0.9)),
        chain: evaluate(
          saturate(brighten(blend(source, cream, 0.8), -0.1), 0.2),
        ),
      },
      math[name],
      name,
    );
  }
});
