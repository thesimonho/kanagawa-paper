---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/support/**"
---

# Support tests

Shared test helpers only: `files.ts` hashes package contents and compares generated artifacts with independent baseline fixtures. Keep target assertions in `../targets/` and shared behavior assertions in `../shared/`.
