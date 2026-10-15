import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { build, root } from "../scripts/build.ts";
import { sorted } from "../scripts/output.ts";
import { spawnSync } from "node:child_process";
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
async function files(
  directory: string,
  prefix = "",
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory())
      Object.assign(
        result,
        await files(join(directory, entry.name), name + "/"),
      );
    else result[name] = hash(await readFile(join(directory, entry.name)));
  }
  return result;
}
test("existing static artifacts match the pre-migration output; repeated builds are deterministic", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa parity "));
  try {
    await build("extras", output);
    await build("vscode", output);
    const expected = JSON.parse(
      await readFile(
        new URL("./fixtures/artifacts.json", import.meta.url),
        "utf8",
      ),
    );
    for (const [name, digest] of Object.entries(expected))
      assert.equal(hash(await readFile(join(output, name))), digest, name);
    const first = {
      ...(await files(join(output, "vscode"))),
      ...(await files(join(output, "extras"), "extras/")),
    };
    await build("extras", output, "kitty");
    await build("vscode", output);
    const second = {
      ...(await files(join(output, "vscode"))),
      ...(await files(join(output, "extras"), "extras/")),
    };
    assert.deepEqual(second, first);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
test("installed Neovim preserves baseline highlights and customization semantics", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa runtime "));
  try {
    const tree = await build("neovim", output);
    const snapshot = join(output, "runtime.json");
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/runtime_snapshot.lua"),
        tree,
        snapshot,
      ],
      {
        encoding: "utf8",
        env: { ...process.env, NVIM_LOG_FILE: join(output, "nvim.log") },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const actual = JSON.parse(await readFile(snapshot, "utf8"));
    const expected = JSON.parse(
      await readFile(
        new URL("./fixtures/runtime.json", import.meta.url),
        "utf8",
      ),
    );
    for (const [name, value] of Object.entries(actual))
      assert.equal(hash(JSON.stringify(sorted(value))), expected[name], name);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
