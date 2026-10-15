---
agent:
  instruction: Preserve these baselines and their documented behavior differences; do not refresh them to make a regression pass.
  on-change: tests/fixtures/**
---

# Regression fixtures

These fixtures capture reference Lua behavior and generated application output:

- `colors.json`: all 140 palette names/hexes and 138 default roles in each variant.
- `math.json`: 840 outputs from the original Lua color helper.
- `artifacts.json`: SHA-256 of 39 extras and two VS Code theme JSON files.
- `runtime.json`: hashes of sorted JSON snapshots from `tests/neovim/runtime_snapshot.lua`, covering both variants with defaults, palette/role/callback overrides, and color balance.

The runtime fixture records the theme's calculated groups, not editor-version-specific builtin highlights. Fixtures are verification evidence, not source inputs. Change an expectation only when the intended behavior changes, and document the difference.

UI emphasis shares the primary accent. Ink's `ui.special` changes from `#8ea49e` to `#658594`; Canvas stays unchanged. The color fixture, three Ink runtime hashes, and Ink artifact hashes for VS Code, fzf, Lazygit and WezTerm include this change. Palette values, syntax special roles and independent public overrides remain intact.

Nushell `shape_garbage` resolves its foreground from `ui.text.secondary` (legacy `ui.fg_dim`), and Zellij resolves its three header metadata fields. The four affected Ink/Canvas artifact hashes include these resolved values.

VS Code line-number colors use the dedicated shared roles: Ink `#54546D`/`#c4b28a` and Canvas `#92928b`/`#a1805e` for normal/active numbers. The two VS Code artifact hashes include these values. Neovim's original role and runtime comparisons omit the additive `ui.line_numbers` fields, which have separate default, palette, and override checks; existing highlight snapshots remain unchanged.
