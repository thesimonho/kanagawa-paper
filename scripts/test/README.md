---
agent:
  instruction: Keep these entry points and their callers aligned when this directory changes.
  on-change: "scripts/test/**"
---

# Test runners

`test.sh` builds Neovim before isolating XDG paths, so mise shims can find the selected Node installation. It then launches `test.lua`; `bootstrap.lua` loads the built runtime and isolates test state under `.tests/`. Actual test cases belong in `tests/`.

`check.sh` is the shared full validation pipeline, called by `npm run check`, `mise run check`, and CI. It runs the existing suites, builds every registered target, then checks packages for all release-enabled targets. It requires the root and release Node dependencies, pinned Python release dependencies, and Neovim. Package checks use temporary artifacts and do not publish.

Run `mise run test` from the repository root. Pass specific Lua spec paths as arguments when needed.
