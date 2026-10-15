---
agent:
  instruction: Preserve application identity and versions; package only assembled trees, with the root README and license.
  on-change: "packages/**"
---

# Application packages

`neovim/` contains runtime integration, highlight mappings, and its historical changelog. Its help file is generated from the root README by panvimdoc in CI and committed automatically after merge. Shared modules are supplied by `shared/` during development and copied into the installed runtime by `scripts/assemble.py`.

`vscode/` preserves the `SimonHo.kanagawa-paper` extension identity and version history. Its mapping JSON uses `@palette.name` or `@theme.section.role`; append `:80` for alpha. The current shared Neovim themes are the color authority for both variants; old VS Code shades are not preserved. UI, syntax, diagnostic, rainbow, diff and terminal entries reference their shared semantic roles. The only raw color is fully transparent `#00000000`. The renderer rejects unresolved references, non-transparent literal colors, and missing or non-RGBA selection backgrounds. Do not manually edit assembled theme JSON.

The maintained user README and license live at the repository root and are copied into both distributions. Application source directories are not installable artifacts. Run `python3 scripts/assemble.py` to create `dist/neovim`, `dist/vscode`, and the copyable configurations in `dist/extras`. All consumers resolve colors through `shared/lua/kanagawa-paper/theme.lua`; packaging and publication stay application-specific.

## Node build checkpoint

`npm run build -- all` uses typed source and adapters. Neovim receives generated palette, relationship and type modules alongside its handwritten runtime; VS Code receives static JSON. `packages/neovim/adapter.ts` preserves the public role projection, while static adapters use canonical roles directly. Old commands remain temporarily during integration.
