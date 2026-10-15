---
agent:
  instruction: Preserve exact legacy color arithmetic and palette-reference identity; validate changes against the captured Lua fixtures.
  on-change: shared/color/**
---

# Color expressions

Expressions retain palette names until evaluation. Static targets evaluate them in Node; Neovim emits equivalent Lua expressions so user palette overrides still affect derived colors at load time. `inherit` means no assigned color, not transparent RGBA. Alpha is an adapter operation with an exact hexadecimal byte.

`hsluv.ts` ports the existing Lua numerical implementation, including constants and rounding. Blend uses RMS RGB, then HSLuv; brighten and saturate change HSLuv components. Do not replace these with similarly named library operations. The original license remains in the source.

`tests/fixtures/math.json` records six original Lua calculations for every palette entry, including a chained operation. The fixture is a regression oracle, not a second maintained palette.
