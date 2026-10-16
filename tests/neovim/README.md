---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/neovim/**"
---

# Neovim tests

`*_spec.lua` files exercise the plugin inside Neovim through `just test`. `installable.lua`, `neovim_roles.lua`, `runtime_snapshot.lua`, `style_defaults.lua` and `style_policy.lua` are standalone probes launched by the TypeScript target suites with an explicit built runtime path. They must not load the source checkout as the installed plugin. `highlights_spec.lua` covers highlight assembly and plugin discovery, including caches from the previous directory layout. The style-policy probe verifies public overrides in core syntax and plugin integrations, including explicit false values and color-only semantic overlays.
