import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
export const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
export async function files(
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

export async function artifactParity(target: string, directory: string) {
  const expected = JSON.parse(
    await readFile(
      new URL("../fixtures/artifacts.json", import.meta.url),
      "utf8",
    ),
  );
  const entries = Object.entries(expected).filter(([name]) =>
    name.startsWith(target + "/"),
  );
  assert.ok(entries.length, `No artifact baseline for ${target}`);
  for (const [name, digest] of entries)
    assert.equal(
      hash(await readFile(join(directory, name.slice(target.length + 1)))),
      digest,
      name,
    );
}
