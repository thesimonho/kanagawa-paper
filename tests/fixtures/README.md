---
agent:
  instruction: Preserve these baselines and their documented approved changes; do not refresh them to make a regression pass.
  on-change: tests/fixtures/**
---

# Migration baselines

Captured before switching the Lua build to TypeScript, from local source based on commit `f89146a` plus the behavior-preserving native-runner work:

- `colors.json`: all 140 palette names/hexes and 138 default roles in each variant.
- `math.json`: 840 outputs from the original Lua color helper.
- `artifacts.json`: SHA-256 of 39 extras and two VS Code theme JSON files.
- `runtime.json`: hashes of sorted JSON snapshots from `tests/neovim/runtime_snapshot.lua`, covering both variants with defaults, palette/role/callback overrides, and color balance.

The runtime fixture records the theme's calculated groups, not editor-version-specific builtin highlights. Fixtures are verification evidence, not source inputs. Change an expectation only for a separately explained and accepted behavior change.

Approved change, 2026-10-15: UI emphasis shares the primary accent. Ink's `ui.special` changes from `#8ea49e` to `#658594`; Canvas stays unchanged. The color fixture, three Ink runtime hashes, and Ink artifact hashes for VS Code, fzf, Lazygit and WezTerm include this change. Before/after outputs were compared before updating these expectations; palette values, syntax special roles and independent public overrides remain intact.
