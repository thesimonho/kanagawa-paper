---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/release/**"
---

# Release tests

Python tests own the release coordinator, its Python-to-Node assembly wrapper, and shell-generated publication against local Git remotes. `oidc.test.ts` checks the pinned VSCE credential boundary without credentials or network access. `marketplace-auth.test.ts` checks the current-protocol gate, safe token-exchange probe, and secret-free failures. The installed VSCE client must pass the protocol gate; an incompatible-client fixture must fail before live network access. These offline tests do not prove publisher policy or live Marketplace access. Run `just test-targets` after installing root Node and pinned release dependencies. Definition tests use a temporary additional archive target to cover discovery, preparation, packaging and frozen publication retries without editing the common coordinator. Zed tests cover independent manifest stamping, zero-version rules, its required source baseline, and frozen archive publication/retry. Invalid profiles, declarations, paths and missing build registrations must fail before preparation. Fixture repositories and outputs must stay temporary.
