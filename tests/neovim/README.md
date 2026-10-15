---
agent:
  instruction: Keep this directory ownership and runtime guidance current.
  on-change: "tests/neovim/**"
---

# Neovim tests

`*_spec.lua` files exercise the plugin inside Neovim through `just test`. `installable.lua`, `neovim_roles.lua`, `runtime_snapshot.lua` and `style_defaults.lua` are standalone probes launched by the TypeScript target suites with an explicit built runtime path. They must not load the source checkout as the installed plugin.
