import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sorted((value as Record<string, unknown>)[key])]),
    );
  return value;
}
export const json = (value: unknown) =>
  JSON.stringify(sorted(value), null, 2) + "\n";
export async function publishTarget(
  output: string,
  target: string,
  render: (stage: string, previous: string) => Promise<void>,
) {
  await mkdir(output, { recursive: true });
  const lock = join(output, `.${target}.lock`);
  try {
    await mkdir(lock);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    throw new Error(
      `Another build owns ${lock}. Choose another --output or remove the lock after confirming its process has stopped.`,
    );
  }
  let stage: string | undefined;
  let backedUp = false;
  let installed = false;
  const destination = join(output, target),
    backup = join(output, `.${target}-previous-${randomUUID()}`);
  try {
    await writeFile(
      join(lock, "owner.json"),
      json({ pid: process.pid, target }),
    );
    stage = await mkdtemp(join(output, `.${target}-stage-`));
    await render(stage, destination);
    try {
      await rename(destination, backup);
      backedUp = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    try {
      await rename(stage, destination);
      installed = true;
    } catch (error) {
      if (backedUp) {
        await rename(backup, destination);
        backedUp = false;
      }
      throw error;
    }
    await rm(backup, { recursive: true, force: true });
    backedUp = false;
    const marker = join(output, `.${target}-build.json`);
    const tempMarker = marker + ".tmp";
    await writeFile(tempMarker, json({ generation: randomUUID() }));
    await rename(tempMarker, marker);
    return destination;
  } finally {
    if (stage) await rm(stage, { recursive: true, force: true });
    // A failed rollback leaves the backup available for recovery; never delete it.
    if (installed && !backedUp)
      await rm(backup, { recursive: true, force: true });
    await rm(lock, { recursive: true, force: true });
  }
}
