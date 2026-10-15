---
agent:
  instruction: Generate Neovim help from the root README; never hand-edit the help text or tags.
  on-change: "packages/neovim/doc/**"
---

> [!WARNING]
> **Generated help — do not edit the `.txt` files or `tags` manually.** Edit the repository's root `README.md` instead. Generation will overwrite manual changes.

# Neovim help

The shared generation action in `.github/actions/generate/action.yml` converts the root README to `kanagawa-paper.nvim.txt` with panvimdoc. CI checks generation on pull requests, and post-merge automation commits the updated help. Neovim generates `tags` when the package is installed.

This README documents the directory and is maintained by hand.
