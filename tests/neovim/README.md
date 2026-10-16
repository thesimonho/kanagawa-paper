---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/neovim/**"
---

# Neovim tests

`*_spec.lua` files exercise the plugin inside Neovim through `just test`. `installable.lua`, `neovim_roles.lua`, `runtime_snapshot.lua`, `style_defaults.lua` and `style_policy.lua` are standalone probes launched by the TypeScript target suites with an explicit built runtime path. They must not load the source checkout as the installed plugin. `highlights_spec.lua` covers highlight assembly and plugin discovery, including caches from the previous directory layout. The style-policy probe verifies public overrides in core syntax and plugin integrations, including explicit false values and color-only semantic overlays.

`typescript_annotations.lua` is an optional real-parser probe for the TypeScript/TSX context extension. Run `nvim --headless --clean -l tests/neovim/typescript_annotations.lua dist/neovim /path/to/nvim-treesitter/runtime /path/to/parser-runtime` after building; the parser runtime must contain `parser/typescript.so` and `parser/tsx.so`. It checks actual installed queries and assembled highlight groups in both variants, including the reported class/default-library semantic color overlays. Parsers are external development dependencies, not bundled theme dependencies; the default suite verifies packaging and style mappings without requiring parser installations.
