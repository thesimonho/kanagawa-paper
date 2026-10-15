import { cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Ajv } from "ajv";
import schema from "./theme.schema.json" with { type: "json" };
import { zedTheme } from "./adapter.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { json } from "../../scripts/output.ts";
const validate = new Ajv({ strict: false, allErrors: true }).compile(schema);
export async function buildZed(root: string, destination: string) {
  const family = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: "Kanagawa Paper",
    author: "Simon Ho",
    themes: [
      zedTheme(resolveTheme(ink), "ink"),
      zedTheme(resolveTheme(canvas), "canvas"),
    ],
  };
  // The upstream schema allows arbitrary strings; enforce actual color syntax.
  for (const theme of family.themes) {
    const colors = Object.entries(theme.style).flatMap<unknown>(
      ([key, value]) => {
        if (key === "syntax")
          return Object.values(theme.style.syntax).map((item) => item.color);
        if (key === "players")
          return theme.style.players.flatMap((player) => Object.values(player));
        return Array.isArray(value) ? value : [value];
      },
    );
    for (const color of colors) {
      if (
        typeof color !== "string" ||
        !/^#(?:[\da-f]{6}|[\da-f]{8})$/i.test(color)
      )
        throw new Error(`Invalid Zed color: ${String(color)}`);
    }
  }
  if (!validate(family))
    throw new Error(`Invalid Zed theme: ${JSON.stringify(validate.errors)}`);
  await mkdir(join(destination, "themes"));
  await writeFile(
    join(destination, "themes/kanagawa-paper.json"),
    json(family),
  );
  await cp(
    join(root, "packages/zed/extension.toml"),
    join(destination, "extension.toml"),
  );
  for (const name of ["README.md", "LICENSE"])
    await cp(join(root, name), join(destination, name));
}
