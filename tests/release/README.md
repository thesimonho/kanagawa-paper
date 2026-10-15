---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/release/**"
---

# Release tests

Python tests own the release coordinator, its Python-to-Node assembly wrapper, and shell-generated publication against local Git remotes. `oidc.test.ts` checks the pinned VSCE credential boundary without credentials or network access. Run `just test-targets` after installing root Node and pinned release dependencies. Fixture repositories and outputs must stay temporary.
