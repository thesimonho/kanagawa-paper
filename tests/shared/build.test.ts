import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, targets } from "../../scripts/build/build.ts";
import { files } from "../support/files.ts";
for (const target of targets) {
  test(`${target}: repeated builds produce identical package contents`, async () => {
    const output = await mkdtemp(join(tmpdir(), "kanagawa deterministic "));
    try {
      const tree = await build(target, output);
      const first = await files(tree);
      await build(target, output);
      assert.deepEqual(await files(tree), first);
    } finally {
      await rm(output, { recursive: true, force: true });
    }
  });
}
