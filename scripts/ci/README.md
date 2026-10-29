---
agent:
  instruction: Keep CI entry points and their workflow callers aligned; shared local commands belong in the parent directory.
  on-change:
    - scripts/ci/**
    - .github/workflows/**
---

# CI automation

`publish-generated.sh` publishes the generated files from the shared generation action after merge. It requires a clean source checkout on `main` and rejects concurrent source updates.

Generation and release Git pushes use repository-scoped installation tokens from the PR Master for CI GitHub App. Configure repository variable `PR_MASTER_APP_ID` and secret `PR_MASTER_PRIVATE_KEY` (the PEM contents). Each job requests only Contents write permission; the action revokes its token when the job finishes. The app needs bypass access to the rulesets protecting `main` for generated-file pushes. Release API calls use the job's `GITHUB_TOKEN`, and Marketplace publication uses OIDC. No deploy key or release-enable variable is required.

Generated-only pushes (`extras/**`, `palette_colors.md`, and the generated Neovim help file) do not start validation or release workflows again. Markdown-only pushes also skip post-merge validation; every pull request still receives the required `checks` job, including documentation changes. README changes still run generation after merge to refresh Neovim help. Validation cancels older runs for the same PR or ref, while release publication remains serialized without cancellation. Manual workflow dispatch remains available for checks and release retries.

`release/` owns release preparation, frozen artifact publication, and pinned publication dependencies. Its `check-marketplace-auth.mts` probes authentication without publication and rejects incompatible VSCE clients before network access. See `release/README.md` for commands and authentication behavior.

The workflows in `.github/workflows/` call these entry points. Validation calls `npm run check`; application build and release lists belong in their registries, not workflow YAML. Runner toolchains and permissions remain explicit workflow setup. Build and assembly commands in `scripts/build/`, test runners in `scripts/test/`, and generation commands in `scripts/` remain shared with local development. Run CI entry points from the repository root.
