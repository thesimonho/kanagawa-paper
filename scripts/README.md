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
