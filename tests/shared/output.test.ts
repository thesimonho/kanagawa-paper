import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  readFile,
  writeFile,
  symlink,
  mkdir,
  rm,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { root, build } from "../../scripts/build/build.ts";
import { publishTarget } from "../../scripts/build/output.ts";
test("failed rendering retains output and completion marker; source aliases are protected", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa failure "));
  try {
    await publishTarget(output, "sample", async (stage) => {
      await writeFile(join(stage, "theme"), "original");
    });
    const marker = await readFile(join(output, ".sample-build.json"), "utf8");
    await assert.rejects(
      publishTarget(output, "sample", async (stage) => {
        await writeFile(join(stage, "theme"), "partial");
        throw new Error("broken template");
      }),
      /broken template/,
    );
    assert.equal(
      await readFile(join(output, "sample/theme"), "utf8"),
      "original",
    );
    assert.equal(
      await readFile(join(output, ".sample-build.json"), "utf8"),
      marker,
    );
    await symlink(join(root, "packages"), join(output, "alias"), "dir");
    await assert.rejects(
      build("neovim", join(output, "alias")),
      /Refusing to replace source/,
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("target locks reject competing writers and marker failure restores prior output", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa lock "));
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let entered!: () => void;
  const rendering = new Promise<void>((resolve) => {
    entered = resolve;
  });
  try {
    const first = publishTarget(output, "sample", async (stage) => {
      entered();
      await gate;
      await writeFile(join(stage, "theme"), "original");
    });
    await rendering;
    await assert.rejects(
      publishTarget(output, "sample", async () => {}),
      /Another build owns/,
    );
    release();
    await first;
    // Force completion-marker publication to fail after the target rename.
    await rm(join(output, ".sample-build.json"));
    await mkdir(join(output, ".sample-build.json"));
    await assert.rejects(
      publishTarget(output, "sample", async (stage) => {
        await writeFile(join(stage, "theme"), "replacement");
      }),
    );
    assert.equal(
      await readFile(join(output, "sample/theme"), "utf8"),
      "original",
    );
  } finally {
    release();
    await rm(output, { recursive: true, force: true });
  }
});
