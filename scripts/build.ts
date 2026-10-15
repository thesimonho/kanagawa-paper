import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { buildNeovim } from "../packages/neovim/build.ts";
import { buildVscode } from "../packages/vscode/build.ts";
import { buildExtras } from "../generators/build.ts";
import { extras, type ExtraName } from "../generators/registry.ts";
import { publishTarget } from "./output.ts";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const targets = ["neovim", "vscode", "extras"] as const;
export type Target = (typeof targets)[number];
export interface BuildOptions {
  target: Target | "all";
  output: string;
  only?: ExtraName;
}
export function options(args: string[]): BuildOptions {
  let target: string = "all",
    output = join(root, "dist"),
    only: string | undefined;
  if (args[0] && !args[0].startsWith("--")) target = args.shift()!;
  while (args.length) {
    const flag = args.shift(),
      value = args.shift();
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${flag}`);
    if (flag === "--output") output = resolve(value);
    else if (flag === "--only") only = value;
    else throw new Error(`Unknown build option: ${flag}`);
  }
  if (target !== "all" && !(targets as readonly string[]).includes(target))
    throw new Error(`Unknown target: ${target}`);
  if (only && (target !== "extras" || !Object.hasOwn(extras, only)))
    throw new Error("--only requires extras and a registered adapter name");
  return {
    target: target as Target | "all",
    output,
    only: only as ExtraName | undefined,
  };
}
export function typecheck() {
  const result = spawnSync(
    process.execPath,
    [join(root, "node_modules/typescript/bin/tsc"), "--noEmit"],
    { cwd: root, stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error("Typecheck failed; previous output retained");
}
export async function build(
  target: Target,
  output = join(root, "dist"),
  only?: ExtraName,
) {
  const destination = resolve(output, target);
  const local = relative(root, destination);
  if (
    !local ||
    local === ".." ||
    (local.startsWith("../") && root.startsWith(destination + "/")) ||
    /^(packages|shared|scripts|generators|tests|\.git)(\/|$)/.test(local)
  ) {
    throw new Error(`Refusing to replace source directory: ${destination}`);
  }
  return publishTarget(resolve(output), target, async (stage, previous) => {
    if (target === "neovim") await buildNeovim(root, stage);
    else if (target === "vscode") await buildVscode(root, stage);
    else await buildExtras(root, stage, previous, only);
  });
}
export async function run(opts: BuildOptions) {
  typecheck();
  for (const target of opts.target === "all" ? targets : [opts.target])
    process.stdout.write((await build(target, opts.output, opts.only)) + "\n");
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  run(options(process.argv.slice(2))).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
