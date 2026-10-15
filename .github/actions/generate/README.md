---
agent:
  instruction: Keep PR validation and post-merge generation on this shared action, with deterministic output and no publishing credentials.
  on-change:
    - .github/actions/generate/**
    - .github/workflows/run-tests.yml
    - .github/workflows/release.yml
---

# Generated theme files

This composite action owns the generator sequence used by read-only PR validation and post-merge publishing. It builds extras and the palette preview, then uses the existing panvimdoc v4.0.1 tool to convert the root README into `packages/neovim/doc/kanagawa-paper.nvim.txt`. Keep the original help project name and rendering options. The fixed description replaces the current-date header so identical sources do not create daily bot commits.

The action only generates files. `scripts/publish-generated.sh` commits the allowed outputs after merge; PR validation packages the generated help and uploads outputs for inspection. Contributors, including fork authors, do not need to run generators or commit output. A generator failure must stop the caller before publication or package assembly.
