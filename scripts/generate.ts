import { writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { build, root, typecheck } from "./build/build.ts";
import { paletteMarkdown } from "./generate-palette.ts";
try {
  typecheck();
  await build("extras", root);
  const temporary = join(root, ".palette_colors.md.tmp");
  await writeFile(temporary, paletteMarkdown());
  await rename(temporary, join(root, "palette_colors.md"));
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
