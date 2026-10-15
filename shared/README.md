---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "shared/**"
---

# Shared theme data

`palette.ts` owns the immutable named colors. `theme.ts` defines the shared semantic contract; `themes/ink.ts` and `themes/canvas.ts` assign expressions to it. `color/` evaluates those expressions without editor dependencies. Application settings and exceptions belong to adapters.

Neovim receives generated Lua definitions at build time. Its runtime preserves palette and theme overrides, including recalculation of dependent expressions. Do not maintain a second palette or hand-edit generated Lua.
