import { cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Ajv } from "ajv";
import schema from "./theme.schema.json" with { type: "json" };
import { zedTheme } from "./adapter.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { json } from "../../scripts/build/output.ts";
const validate = new Ajv({ strict: false, allErrors: true }).compile(schema);
const styleKeys = Object.keys(
  schema.definitions.ThemeStyleContent.properties,
).sort();

export function validateZedTheme(value: unknown): void {
  if (!validate(value))
    throw new Error(`Invalid Zed theme: ${JSON.stringify(validate.errors)}`);
  const family = value as {
    themes: { name: string; style: Record<string, unknown> }[];
  };
  for (const theme of family.themes) {
    if (
      JSON.stringify(Object.keys(theme.style).sort()) !==
      JSON.stringify(styleKeys)
    )
      throw new Error(`Incomplete or unknown Zed style keys: ${theme.name}`);
    const color = (value: unknown, path: string) => {
      if (
        typeof value !== "string" ||
        !/^#(?:[\da-f]{6}|[\da-f]{8})$/i.test(value)
      )
        throw new Error(`Invalid Zed color: ${theme.name} ${path}`);
    };
    for (const [key, value] of Object.entries(theme.style)) {
      if (key === "background.appearance") continue;
      if (key === "syntax") {
        for (const [scope, highlight] of Object.entries(
          value as Record<string, Record<string, unknown>>,
        )) {
          for (const field of ["color", "background_color"]) {
            if (field in highlight)
              color(highlight[field], `syntax.${scope}.${field}`);
          }
        }
      } else if (key === "players") {
        for (const [index, player] of (
          value as Record<string, unknown>[]
        ).entries())
          for (const [field, item] of Object.entries(player))
            color(item, `players.${index}.${field}`);
      } else if (key === "accents") {
        for (const [index, item] of (value as unknown[]).entries())
          color(item, `accents.${index}`);
      } else color(value, key);
    }
  }
}

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
  // Upstream permits arbitrary color strings and omitted style fields.
  validateZedTheme(family);
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
  await cp(
    join(root, "packages/zed/CHANGELOG.md"),
    join(destination, "CHANGELOG.md"),
  );
}
