---
agent:
  instruction: Keep these entry points and their callers aligned when this directory changes.
  on-change: "scripts/test/**"
---

# Test runners

`test.sh` builds Neovim and launches `test.lua`; `bootstrap.lua` loads the built runtime and isolates test state under `.tests/`. Actual test cases belong in `tests/`.

`check.sh` is the shared full validation pipeline, called by `npm run check`, `just check`, and CI. It runs the existing suites, builds every registered target, then checks packages for all release-enabled targets. It requires the root and release Node dependencies, pinned Python release dependencies, and Neovim. Package checks use temporary artifacts and do not publish.

Run `just test` from the repository root. Pass specific Lua spec paths as arguments when needed.
