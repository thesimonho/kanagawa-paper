import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { rawPalette } from "../../shared/palette.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import type { ColorExpression } from "../../shared/color/expression.ts";
import { neovimRoles } from "./adapter.ts";
import { textStyles } from "../../shared/styles.ts";

const warning =
  "-- Generated from shared TypeScript definitions. Do not edit.\n";
function expression(value: ColorExpression): string {
  if (value.kind === "palette") return `palette.${value.name}`;
  if (value.kind === "literal") return JSON.stringify(value.hex);
  if (value.kind === "inherit") return '"none"';
  return chain(value) + ":to_hex()";
}
function chain(value: ColorExpression): string {
  if (value.kind === "blend")
    return `${chain(value.source)}:blend(${expression(value.background)}, ${value.amount})`;
  if (value.kind === "brighten" || value.kind === "saturate")
    return `${chain(value.source)}:${value.kind}(${value.amount}${value.background ? ", " + expression(value.background) : ""})`;
  return `color(${expression(value)})`;
}
function lua(value: unknown, path = "", indent = 0): string {
  if (value && typeof value === "object" && "kind" in value) {
    const rendered = expression(value as ColorExpression);
    return path === "ui.bg_gutter"
      ? `opts.gutter and ${rendered} or "none"`
      : rendered;
  }
  if (!value || typeof value !== "object") return JSON.stringify(value);
  if (!Array.isArray(value) && Object.keys(value).length === 0)
    return "vim.empty_dict()";
  return (
    "{\n" +
    Object.entries(value)
      .map(
        ([key, item]) =>
          `${"\t".repeat(indent + 1)}[${JSON.stringify(key)}] = ${lua(item, path ? path + "." + key : key, indent + 1)},\n`,
      )
      .join("") +
    "\t".repeat(indent) +
    "}"
  );
}
function annotation(name: string, value: Record<string, unknown>): string {
  let body = `---@class ${name}\n`;
  let children = "";
  for (const [key, item] of Object.entries(value)) {
    if (item && typeof item === "object" && !("kind" in item)) {
      const child = `${name}_${key}`;
      body += `---@field ${key}? ${child}\n`;
      children += "\n" + annotation(child, item as Record<string, unknown>);
    } else body += `---@field ${key}? ColorSpec\n`;
  }
  return body + children;
}
export async function buildNeovim(root: string, destination: string) {
  for (const directory of ["lua", "colors", "doc", "queries"]) {
    await cp(
      join(root, "packages/neovim", directory),
      join(destination, directory),
      {
        recursive: true,
        filter: (source) => !source.endsWith("/doc/tags"),
      },
    );
  }
  const modules = join(destination, "lua/kanagawa-paper");
  await mkdir(join(modules, "themes"), { recursive: true });
  await writeFile(
    join(modules, "palette.lua"),
    warning + "return " + lua(rawPalette) + "\n",
  );
  for (const [variant, definition] of Object.entries({ ink, canvas })) {
    await writeFile(
      join(modules, "themes", variant + ".lua"),
      warning +
        'local color = require("kanagawa-paper.lib.color")\nlocal M = {}\nfunction M.get(opts, palette)\n\treturn ' +
        lua(neovimRoles(definition), "", 1) +
        "\nend\nreturn M\n",
    );
  }
  await writeFile(
    join(modules, "style_defaults.lua"),
    warning + "return " + lua(textStyles) + "\n",
  );
  const annotations =
    warning +
    annotation("PaletteColors", rawPalette) +
    "\n" +
    annotation("ThemeColors", neovimRoles(ink)) +
    "\n---@class KanagawaStyles\n" +
    Object.keys(textStyles)
      .map((name) => `---@field ${name}? vim.api.keyset.highlight\n`)
      .join("");
  await writeFile(join(modules, "generated_types.lua"), annotations);
  for (const name of ["README.md", "LICENSE"])
    await cp(join(root, name), join(destination, name));
  await cp(
    join(root, "packages/neovim/CHANGELOG.md"),
    join(destination, "CHANGELOG.md"),
  );
}
