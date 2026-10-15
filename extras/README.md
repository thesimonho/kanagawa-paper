---
agent:
  instruction: Edit shared colors or generator templates instead of generated extras; keep this warning visible.
  on-change: "extras/**"
---

> [!WARNING]
> **Generated files — do not edit the configurations in this directory manually.** Changes will be overwritten. Edit the palette and theme roles in `shared/` or the templates in `packages/extras/adapters/` instead.

# Extras

These files are generated automatically after source changes merge. The bot commits updated output to the default branch; contributors do not need to generate or commit it locally.

Edit the shared theme sources or templates in `packages/extras/` instead of these generated files, which will be overwritten.
