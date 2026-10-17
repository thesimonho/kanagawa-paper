import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, targets } from "../../scripts/build/build.ts";
import { spawnSync } from "node:child_process";
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

// Querying the real CLI must work before compilation and must not build anything.
test("build CLI lists registered targets and rejects unknown names", () => {
  const query = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/build/build.ts", "--list-targets"],
    { encoding: "utf8" },
  );
  assert.equal(query.status, 0, query.stderr);
  assert.deepEqual(JSON.parse(query.stdout), targets);
  const invalid = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/build/build.ts", "unknown-target"],
    { encoding: "utf8" },
  );
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /Unknown target/);
});
