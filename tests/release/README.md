---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/release/**"
---

# Release tests

Python tests own the release coordinator, its Python-to-Node assembly wrapper, and shell-generated publication against local Git remotes. `oidc.test.ts` checks the pinned VSCE credential boundary without credentials or network access. Run `just test-targets` after installing root Node and pinned release dependencies. Definition tests use a temporary additional archive target to cover discovery, preparation, packaging and frozen publication retries without editing the common coordinator. Invalid profiles, declarations, paths and missing build registrations must fail before preparation. Fixture repositories and outputs must stay temporary.
