---
agent:
  instruction: Keep highlight mappings and shared role boundaries consistent when this directory changes.
  on-change: "packages/neovim/lua/kanagawa-paper/highlights/**"
---

# Neovim highlights

`init.lua` assembles core highlights and enabled plugin integrations, then applies user overrides. `syntax.lua` maps legacy syntax groups, `treesitter.lua` maps parser captures, and `semantic.lua` maps LSP token types and modifiers. `editor.lua` owns editor UI, `lsp.lua` owns references, inlay hints, signature help, and code lenses, and `ft.lua` owns filetype-specific groups. Plugin integrations remain in `plugins/`.

Modules receive resolved colors and configuration. Use shared style roles through `opts.styles`; preserve links when a group should follow another highlight. Plugin discovery caches are reusable only for the current runtime plugin directory. This directory is copied as part of the existing Lua runtime build; it needs no separate packaging step.
