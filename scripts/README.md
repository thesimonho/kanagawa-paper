---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "scripts/**"
---

# Build and validation commands

Install Node 22 or later, then `npm ci --ignore-scripts` at the repository root. `just build` builds every target; `just watch` rebuilds after edits. Both accept a target and output root. Each build checks TypeScript, renders into a sibling staging directory, then publishes under a per-target lock. A failed render leaves previous output intact. Confirm a lock owner has stopped before manually removing a stale lock.

`build.ts` is the common dispatcher. `assemble.py` is a compatibility wrapper for Python release tooling. `bootstrap.lua` loads only `dist/neovim` for tests; `just test` builds it first and isolates Neovim state under `.tests`. `just check` runs the build, type, format, Node, Lua, and Python checks. Python release tests also need the pinned dependencies in `release/requirements.txt`.

`generate.ts` updates extras and the palette Markdown. The generation action uses it plus panvimdoc to produce Neovim help from the root README. Never hand-edit generated help. PR validation generates these files and uploads them for inspection. The approved post-merge publisher commits only generated files; normal source work still requires PR review. `release/` owns independent versions and frozen artifact publication.

Build output, local previews, and temporary experiments are disposable.

## Generated-file inventory

Paths below use the default output root, `dist`. Build output is disposable; checked-in generated files are maintained by the generation workflow.

| Source | Generator | Output |
| --- | --- | --- |
| `shared/palette.ts`, `shared/themes/*.ts`, `packages/neovim/adapter.ts` | `packages/neovim/build.ts` | `dist/neovim/lua/kanagawa-paper/palette.lua`, `themes/{ink,canvas}.lua`, `generated_types.lua` |
| Shared theme definitions and `packages/vscode/adapter.ts` | `packages/vscode/build.ts` | `dist/vscode/themes/kanagawa-paper-{ink,canvas}-color-theme.json` |
| Shared theme definitions and `packages/zed/adapter.ts` | `packages/zed/build.ts` | `dist/zed/themes/kanagawa-paper.json` |
| Shared theme definitions and `generators/extras/*.ts`; output names in `generators/registry.ts` | `generators/build.ts` | `dist/extras/**`; `scripts/generate.ts` publishes the same files to checked-in `extras/**` |
| `shared/palette.ts` and shared theme definitions | `scripts/build.ts` success marker | `dist/.neovim-build.json` preview swatches consumed by `.lazy.lua` |
| `shared/palette.ts` | `scripts/generate.ts` | Checked-in `palette_colors.md` |
| Root `README.md` | panvimdoc in `.github/actions/generate/action.yml` | Checked-in `packages/neovim/doc/kanagawa-paper.nvim.txt`, copied into `dist/neovim/doc/` during assembly |

Target builders also copy runtime files, package metadata, licenses, and assets into their distribution. Those copies remain owned by their source files. `scripts/targets.ts` registers application targets; `generators/registry.ts` registers extras. Edit the source or generator, then rebuild the affected output.
