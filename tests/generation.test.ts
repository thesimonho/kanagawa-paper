import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { root } from "../scripts/build.ts";
import { paletteMarkdown } from "../scripts/generate-palette.ts";
test("palette documentation is current and deterministic", async () => {
  const generated = paletteMarkdown();
  assert.equal(paletteMarkdown(), generated);
  assert.equal(
    await readFile(join(root, "palette_colors.md"), "utf8"),
    generated,
  );
});
