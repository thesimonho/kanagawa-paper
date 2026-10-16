---
agent:
  instruction: Keep Zed differences in this adapter and preserve the shared palette and semantic contract.
  on-change: packages/zed/**
---

# Zed adapter

`just build zed` writes a local extension with Ink and Canvas under `dist/zed`. In Zed, use **Install Dev Extension** and select that directory. Choose **Kanagawa Paper Ink** or **Kanagawa Paper Canvas** with the theme selector. The extension ID is `kanagawa-paper-theme`.

`adapter.ts` exposes the theme assembled by `highlights/index.ts`. The `highlights/` modules map canonical UI, syntax, status, changes, and ANSI roles to all 142 fields in the pinned style schema. Transparent controls and dim terminal colors use alpha at the adapter boundary. General conflict colors and backgrounds use the error status treatment. Zed's player selection and cursor fields use the shared selection and main text colors. Syntax titles use the first rainbow heading color, and namespaces use the LSP keyword color. Built-in functions, tags, selectors, and default emphasis use the shared syntax roles and `shared/styles.ts`. Common syntax captures include dotted punctuation, selectors, namespaces, diff markers and builtin functions. Unassigned variable color retains Zed's inherited foreground; language-specific captures can fall back to a configured parent.

`theme.schema.json` is the unmodified v0.2.0 schema retrieved from [Zed](https://zed.dev/schema/themes/v0.2.0.json) on 2026-10-15. Builds validate against this pinned schema without network access. When refreshing it, review changes against the [theme extension contract](https://zed.dev/docs/extensions/themes). The adapter's style keys and background-appearance enum are typed from this schema. Build validation requires exact style-key coverage and valid hexadecimal colors, including nested accents, players and syntax fields, before publishing output. The upstream schema remains unmodified.

Explicit text emphasis comes from `textStyles` in `shared/styles.ts` through `zedStyle`. A false bold/italic attribute emits normal weight/style; an omitted attribute inherits. The pinned theme format cannot express underline or strikethrough, and the translator rejects enabling those attributes; disabled decorations require no Zed field. Semantic token routing belongs to Zed's semantic rules, so adding a theme style alone cannot distinguish modifiers those rules discard.

## Package metadata

`extension.toml` declares the extension identity, version, and generated theme path. `CHANGELOG.md` holds the package release history. `build.ts` copies the manifest, changelog, root README, and license into the distribution alongside the generated theme JSON.

`scripts/ci/release/zed.toml` uses this manifest version and changelog with the shared archive release profile. Below 1.0, fixes advance the patch version; features and breaking changes advance the minor version. Archive releases do not register the extension with Zed's registry.
