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
  metadata: Record<string, unknown> = {},
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
  const destination = join(output, target),
    backup = join(output, `.${target}-previous-${randomUUID()}`),
    marker = join(output, `.${target}-build.json`),
    tempMarker = marker + ".tmp";
  try {
    await writeFile(
      join(lock, "owner.json"),
      json({ pid: process.pid, target }),
    );
    stage = await mkdtemp(join(output, `.${target}-stage-`));
    await render(stage, destination);
    await writeFile(
      tempMarker,
      json({ ...metadata, generation: randomUUID() }),
    );
    try {
      await rename(destination, backup);
      backedUp = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    try {
      await rename(stage, destination);
      try {
        await rename(tempMarker, marker);
      } catch (error) {
        await rm(destination, { recursive: true, force: true });
        throw error;
      }
    } catch (error) {
      if (backedUp) {
        await rename(backup, destination);
        backedUp = false;
      }
      throw error;
    }
    // Publication is complete. Cleanup failure must not report a failed build
    // after consumers have observed its successful marker.
    await rm(backup, { recursive: true, force: true }).catch((error) => {
      console.warn(
        `Published ${destination}, but could not remove ${backup}: ${error.message}`,
      );
    });
    backedUp = false;
    return destination;
  } finally {
    if (stage) await rm(stage, { recursive: true, force: true });
    // A failed rollback leaves the backup available for recovery; never delete it.
    await rm(tempMarker, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}
