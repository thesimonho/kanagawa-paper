---
agent:
  instruction: Keep these entry points and their callers aligned when this directory changes.
  on-change: "scripts/test/**"
---

# Test runners

`test.sh` builds Neovim and launches `test.lua`; `bootstrap.lua` loads the built runtime and isolates test state under `.tests/`. Actual test cases belong in `tests/`.

Run `just test` from the repository root. Pass specific Lua spec paths as arguments when needed.
