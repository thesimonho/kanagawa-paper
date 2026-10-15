---
agent:
  instruction: Keep CI entry points and their workflow callers aligned; shared local commands belong in the parent directory.
  on-change:
    - scripts/ci/**
    - .github/workflows/**
---

# CI automation

`publish-generated.sh` publishes the generated files from the shared generation action after merge. It requires a clean source checkout on `main` and rejects concurrent source updates.

`release/` owns release preparation, frozen artifact publication, and pinned publication dependencies. Its `check-marketplace-auth.mts` probes authentication without publication and rejects incompatible VSCE clients before network access. See the release README for commands, current upstream blockers, and hosted setup requirements.

The workflows in `.github/workflows/` call these entry points. Validation calls `npm run check`; application build and release lists belong in their registries, not workflow YAML. Runner toolchains and permissions remain explicit workflow setup. Build and assembly commands in `scripts/build/`, test runners in `scripts/test/`, and generation commands in `scripts/` remain shared with local development. Run CI entry points from the repository root.
