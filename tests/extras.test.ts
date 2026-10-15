import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../scripts/build.ts";
import { artifactParity, files } from "./helpers.ts";
test("extras preserve baseline output and filtered builds preserve other extras", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa extras "));
  try {
    const tree = await build("extras", output);
    await artifactParity("extras", tree);
    const first = await files(tree);
    await build("extras", output, "kitty");
    assert.deepEqual(await files(tree), first);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
