---
agent:
  instruction: Treat distribution trees as disposable build output; edit source packages, shared colors, or generator templates instead.
  on-change: "dist/**"
---

> [!WARNING]
> **Build output — do not edit the generated files in this directory manually.** Rebuilding replaces the target trees. Make changes in the source directories, then run `just build`.

# Distribution artifacts

| Output | Source to edit |
| --- | --- |
| `neovim/` | `packages/neovim/` and `shared/` |
| `vscode/` | `packages/vscode/` and `shared/` |
| `zed/` | `packages/zed/` and `shared/` |
| `extras/` | `packages/extras/` and `shared/` |

The application READMEs and licenses are copied from the repository root. Neovim help is generated from the root README. The extras README is copied from `extras/README.md`.

This README is tracked and maintained by hand. All target trees are ignored build output. `just build` creates all four; `just build neovim`, `just build vscode`, `just build zed`, or `just build extras` rebuilds one target.

Successful builds write sibling `.<target>-build.json` markers. The Neovim marker includes developer swatch data; it is not part of the installable tree. `.lazy.lua` watches this marker and preserves the selected variant when reloading. Run `just watch neovim` before editing shared themes or runtime code.
