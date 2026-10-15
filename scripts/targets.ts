import { buildNeovim } from "../packages/neovim/build.ts";
import { buildVscode } from "../packages/vscode/build.ts";
import { buildZed } from "../packages/zed/build.ts";
import { buildExtras } from "../generators/build.ts";
import type { ExtraName } from "../generators/registry.ts";

type Builder = (
  root: string,
  stage: string,
  previous: string,
  only?: ExtraName,
) => Promise<void>;
export const builders = {
  neovim: buildNeovim,
  vscode: buildVscode,
  extras: buildExtras,
  zed: buildZed,
} satisfies Record<string, Builder>;
export type Target = keyof typeof builders;
export const targets = Object.keys(builders) as Target[];
export function renderTarget(
  target: Target,
  root: string,
  stage: string,
  previous: string,
  only?: ExtraName,
) {
  return (builders[target] as Builder)(root, stage, previous, only);
}
