---
agent:
  instruction: Preserve application identity and versions; package only assembled trees, with the root README and license.
  on-change: "packages/**"
---

# Build target packages

This directory turns one shared theme into packages for different applications. Colors and text-style policy come from `shared/`; each target decides how to express those roles in its application's format.

## Adapters and builders

An **adapter** decides which shared role an application field receives. For example, Zed's gutter background maps to the shared editor background, and VS Code's import scopes map to the shared preprocessor color. Editor token names, supported features, and format differences belong here; palette values and reusable style decisions belong in `shared/`.

A **builder** turns those mappings into files and assembles an installable package. It serializes the theme, performs target-specific validation, and copies the required runtime, metadata, assets, README, and license. Output paths and packaging belong here rather than in the adapter.

The flow is:

```text
shared palette, theme roles, and text styles
    → target mappings and serialization
    → assembled package under dist/<target>/
    → application loads the theme
```

`just build <target>` and `just watch <target>` use the common dispatcher in `scripts/build/` to call the target's `build.ts`. Neovim, VS Code, and Zed each have an `adapter.ts` and a `build.ts`. Extras have multiple application adapters and one shared builder. Source package directories are not installable; preview or package the assembled output instead. See `scripts/README.md` for commands and the source-to-output table.

## Target boundaries

`neovim/` has an additional runtime layer. Its TypeScript adapter projects shared colors into Neovim's public `ui`, `syn`, and other role names. Its builder emits Lua palette, theme, and style defaults, then copies the handwritten runtime. At load time, that runtime applies user overrides and constructs actual highlight groups, including plugin integrations such as Neo-tree. Those Lua groups are also target mappings; their style values come from the generated shared defaults through the resolved configuration.

`vscode/` maps shared roles directly into UI colors, TextMate rules, and semantic-token rules. Its builder writes the theme JSON files and assembles the extension.

`zed/` maps shared roles into Zed's UI and syntax styles. Its builder validates the pinned theme schema and assembles the extension. Zed's own semantic-token rules determine which theme styles semantic tokens select; the theme package cannot control every such distinction. It supports independent archive releases, but the archive publisher does not manage Zed registry entries.

`extras/` owns the registry, builder, and adapters for copyable application configurations. Builds write to `dist/extras/`; generation updates the root `extras/` directory. It has no independent application version or automated release.

## Packaging rules

The root README and license are copied to editor distributions; extras use `extras/README.md`. Neovim help is generated from that README by panvimdoc in CI. Preserve application identities and independent version histories. Do not edit generated Lua or JSON. Build-time dependencies live in the root lockfile; installed themes need no Node runtime.
