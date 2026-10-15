---
agent:
  instruction: Treat these fixtures as independent pre-migration evidence; do not refresh them to make a regression pass.
  on-change: tests/fixtures/**
---

# Migration baselines

Captured before switching the Lua build to TypeScript, from local source based on commit `f89146a` plus the behavior-preserving native-runner work:

- `colors.json`: all 140 palette names/hexes and 138 default roles in each variant.
- `math.json`: 840 outputs from the original Lua color helper.
- `artifacts.json`: SHA-256 of 39 extras and two VS Code theme JSON files.
- `runtime.json`: hashes of sorted JSON snapshots from `tests/neovim/runtime_snapshot.lua`, covering both variants with defaults, palette/role/callback overrides, and color balance.

The runtime fixture records the theme's calculated groups, not editor-version-specific builtin highlights. Fixtures are verification evidence, not source inputs. Change an expectation only for a separately explained and accepted behavior change.
