---
agent:
  instruction: Preserve application identity and versions; package only assembled trees, with the root README and license.
  on-change: "packages/**"
---

# Application packages

Each package maps the shared theme to its application. `neovim/` owns the handwritten runtime, legacy public role adapter, and Lua emitter. `vscode/` owns the extension metadata and typed UI/syntax adapter. Installable trees are built under `dist/`; source package directories are not installable.

The root README and license are copied to distributions. Neovim help is generated from that README by panvimdoc in CI. Preserve application identities and independent version histories. Do not edit generated Lua or JSON. Build-time dependencies live in the root lockfile; installed themes need no Node runtime.

`zed/` is a local Ink/Canvas extension and a test of adding a target without changing shared roles. It is registered for build/watch, but is not included in automated releases.
