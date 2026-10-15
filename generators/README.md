---
agent:
  instruction: Preserve existing extras output contracts; generator modules are not part of the installed Neovim runtime.
  on-change: "generators/**"
---

# Extras generators

The Lua modules produce the existing copyable files in `extras/`. They currently consume the Neovim adapter's default colors and highlights through `scripts/bootstrap.lua`. This preserves existing output behavior while shared palette and role ownership moves to `shared/`.

For an optional local preview, run `bash scripts/build.sh` from the repository root. CI runs generation automatically. Full application packages use their own mappings and assembly path; adding an application package does not require migrating every extra generator.
