---
agent:
  instruction: Keep CI entry points and their workflow callers aligned; shared local commands belong in the parent directory.
  on-change:
    - scripts/ci/**
    - .github/workflows/**
---

# CI automation

`publish-generated.sh` publishes the generated files from the shared generation action after merge. It requires a clean source checkout on `main` and rejects concurrent source updates.

`release/` owns release preparation, frozen artifact publication, and pinned publication dependencies. See its README for release commands and hosted setup requirements.

The workflows in `.github/workflows/` call these entry points. Build, assembly, generation, and test commands in the parent directory remain shared with local development. Run CI entry points from the repository root.
