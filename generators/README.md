---
agent:
  instruction: Preserve existing extras output contracts; generator modules are not part of the installed Neovim runtime.
  on-change: "generators/**"
---

# Extras generators

The Lua modules produce the copyable files in `extras/`. They use `shared/` color preparation directly and never load the Neovim theme package, configuration, or highlight groups. `generator_util.lua` owns template formatting and output-file helpers; each extra maps shared roles to its application format.

Run `just build extras` for an isolated preview under `dist/extras`, or `just build extras /tmp/theme-preview` to choose an output root. `just build` builds Neovim, VS Code, and extras through the same dispatcher. The existing `bash scripts/build.sh` command uses that dispatcher to refresh checked-in extras, as part of automatic post-merge generation. A template error fails the build before existing output is replaced.
