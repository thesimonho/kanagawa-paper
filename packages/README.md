---
agent:
  instruction: Preserve application identity and versions; package only assembled trees, with the root README and license.
  on-change: "packages/**"
---

# Build target packages

Each target maps the shared theme to its application or output formats. `neovim/` owns the handwritten runtime, legacy public role adapter, and Lua emitter. `vscode/` owns the extension metadata and typed UI/syntax adapter. Installable trees are built under `dist/`; source package directories are not installable.

The root README and license are copied to editor distributions; extras use `extras/README.md`. Neovim help is generated from that README by panvimdoc in CI. Preserve application identities and independent version histories. Do not edit generated Lua or JSON. Build-time dependencies live in the root lockfile; installed themes need no Node runtime.

`zed/` is a local Ink/Canvas extension and a test of adding a target without changing shared roles. It is registered for build/watch, but is not included in automated releases.

`extras/` owns the registry, builder, and adapters for copyable application configurations. Builds write to `dist/extras/`; generation updates the root `extras/` directory. It has no independent application version or automated release.
