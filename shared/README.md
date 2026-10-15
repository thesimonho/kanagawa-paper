---
agent:
  instruction: Keep shared palette and roles loadable without Neovim package configuration; preserve runtime module names.
  on-change: "shared/**"
---

# Shared theme data

`lua/kanagawa-paper/palette.lua` owns named colors. `themes/ink.lua` and `themes/canvas.lua` own semantic roles. Their only option is `gutter`; application configuration stays in its package. `theme.lua` exposes `prepare(variant, opts)` for all consumers. It resolves an explicit Ink or Canvas variant, accepts an optional complete palette, role overrides and gutter setting, and returns fresh palette/theme tables. `lib/color.lua` and `lib/hsluv.lua` provide color calculations. `lib/io.lua` supplies file helpers shared by the extras writer and Neovim cache.

Neovim loads these modules directly during development. Assembly copies them into its runtime tree. Neovim delegates color preparation here after resolving its configuration; highlights and editor state stay in its package. VS Code and extras use the same preparation without loading the Neovim plugin. Headless Neovim remains the build-time Lua runner. Keep the `kanagawa-paper` namespace so the project-local reload command clears shared modules too.

## TypeScript migration checkpoint

`palette.ts`, `theme.ts`, `themes/` and `color/` now provide the typed source consumed by `npm run build`. The legacy `lua/` tree remains temporarily for the old entry points until the integration commit switches them. Do not edit both palettes; TypeScript parity tests enforce the captured palette contract.
