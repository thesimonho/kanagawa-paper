import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { extras, metadata, type Extra, type ExtraName } from "./registry.ts";
import { resolveTheme } from "../shared/color/evaluate.ts";
import { ink } from "../shared/themes/ink.ts";
import { canvas } from "../shared/themes/canvas.ts";

export async function buildExtras(
  root: string,
  destination: string,
  previous: string,
  only?: ExtraName,
) {
  if (only) {
    try {
      await cp(previous, destination, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  for (const name of only
    ? [only]
    : (Object.keys(extras).sort() as ExtraName[])) {
    const info: Extra = extras[name];
    const directory = join(destination, name);
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
    for (const variant of ["ink", "canvas"] as const) {
      const meta = metadata(name, info, variant);
      const files = info.generate(
        resolveTheme(variant === "ink" ? ink : canvas),
        meta,
      );
      for (const [suffix, contents] of Object.entries(files)) {
        if (!/^[\w-]*$/.test(suffix))
          throw new Error(`Invalid generated suffix: ${name}/${suffix}`);
        const path = `kanagawa-paper-${variant}${suffix ? "-" + suffix : ""}${info.ext ? "." + info.ext : ""}`;
        await writeFile(join(directory, path), contents);
      }
    }
    if (info.generatePalette) {
      const meta = metadata(name, info, "ink");
      const filename = `kanagawa-paper-palette.${info.ext}`;
      await writeFile(
        join(directory, filename),
        info.generatePalette({
          ...meta,
          name: "kanagawa-paper-palette",
          styleName: "Kanagawa Paper Palette",
          upstreamUrl: `https://github.com/thesimonho/kanagawa-paper/tree/main/extras/${name}/${filename}`,
        }),
      );
    }
  }
  await cp(join(root, "extras/README.md"), join(destination, "README.md"));
}
