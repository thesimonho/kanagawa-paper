---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/neovim/**"
---

# Neovim tests

`*_spec.lua` files exercise the plugin inside Neovim through `just test`. `installable.lua`, `neovim_roles.lua`, `runtime_snapshot.lua`, `style_defaults.lua` and `style_policy.lua` are standalone probes launched by the TypeScript target suites with an explicit built runtime path. They must not load the source checkout as the installed plugin. `highlights_spec.lua` covers highlight assembly and plugin discovery, including caches from the previous directory layout. The style-policy probe verifies public overrides in core syntax and plugin integrations, including explicit false values and color-only semantic overlays.

`parser_annotations.lua` is an optional actual rendered-grid probe for Python, TypeScript, and TSX. Run `nvim --headless --clean -i NONE -n -l tests/neovim/parser_annotations.lua dist/neovim /path/to/nvim-treesitter/runtime /path/to/parser-runtime` after building; the parser runtime must provide those three parsers. The probe launches a clean embedded child of the same Neovim executable, attaches a virtual UI, and inspects actual composed cell attributes. It checks both variants, including annotation names/brackets, indexing and runtime values, decorators, class/type-parameter declarations, explicit aliases, constructors, and executable calls inside annotations. It catches additive highlight flags that a Lua table merge cannot model.

The probe requires the tested Neovim inspection API (`nvim__inspect_cell`, verified with 0.12.4). Parsers are external development dependencies, not bundled theme dependencies. The default suite checks packaging and style mappings without requiring parser installations. The probe stops its child on success or failure and does not open a GUI window or start a language server.
