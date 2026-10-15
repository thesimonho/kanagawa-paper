import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { vscodeTheme } from "./adapter.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import { json } from "../../scripts/build/output.ts";

export function validateTheme(value: ReturnType<typeof vscodeTheme>) {
  function check(item: unknown): void {
    if (Array.isArray(item)) {
      item.forEach(check);
      return;
    }
    if (item && typeof item === "object") {
      Object.values(item).forEach(check);
      return;
    }
    if (typeof item === "string" && item.startsWith("@"))
      throw new Error(`Unresolved color: ${item}`);
    if (
      typeof item === "string" &&
      item.startsWith("#") &&
      !/^#(?:[\da-f]{6}|[\da-f]{8})$/i.test(item)
    )
      throw new Error(`Invalid color: ${item}`);
  }
  check(value);
  for (const key of [
    "editor.selectionHighlightBackground",
    "editor.inactiveSelectionBackground",
  ] as const) {
    const color = value.colors[key];
    if (!/^#[\da-f]{8}$/i.test(color))
      throw new Error(`Selection color requires RGBA: ${key}`);
    if (parseInt(color.slice(-2), 16) === 255)
      throw new Error(`Selection color must be nonopaque: ${key}`);
  }
}
export async function buildVscode(root: string, destination: string) {
  await mkdir(join(destination, "themes"));
  for (const variant of ["ink", "canvas"] as const) {
    const rendered = vscodeTheme(
      resolveTheme(variant === "ink" ? ink : canvas),
      variant,
    );
    validateTheme(rendered);
    await writeFile(
      join(destination, "themes", `kanagawa-paper-${variant}-color-theme.json`),
      json(rendered),
    );
  }
  const source = join(root, "packages/vscode");
  const manifest = JSON.parse(
    await readFile(join(source, "package.json"), "utf8"),
  );
  delete manifest.scripts;
  delete manifest.devDependencies;
  await writeFile(
    join(destination, "package.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  await cp(join(source, "assets"), join(destination, "assets"), {
    recursive: true,
  });
  for (const name of ["README.md", "LICENSE"])
    await cp(join(root, name), join(destination, name));
  await cp(join(source, "CHANGELOG.md"), join(destination, "CHANGELOG.md"));
}
