---
agent:
  instruction: Keep Zed differences in this adapter and preserve the shared palette and semantic contract.
  on-change: packages/zed/**
---

# Zed adapter

`just build zed` writes a local extension with Ink and Canvas under `dist/zed`. In Zed, use **Install Dev Extension** and select that directory. Choose **Kanagawa Paper Ink** or **Kanagawa Paper Canvas** with the theme selector. The extension ID is `kanagawa-paper-theme`. Registry publication is pending.

The adapter maps canonical UI, syntax, status, changes, and ANSI roles to all 142 fields in the pinned style schema. Transparent controls and dim terminal colors use alpha at the adapter boundary. General conflict backgrounds use the warning status treatment. Zed's player selection and cursor fields use the shared selection and normal-mode colors. Common syntax captures include dotted punctuation, selectors, namespaces, diff markers and builtin functions. Unassigned variable color retains Zed's inherited foreground; language-specific captures can fall back to a configured parent. No shared palette, role, or Neovim mapping was added for this target.

`theme.schema.json` is the unmodified v0.2.0 schema retrieved from [Zed](https://zed.dev/schema/themes/v0.2.0.json) on 2026-10-15. Builds validate against this pinned schema without network access. When refreshing it, review changes against the [theme extension contract](https://zed.dev/docs/extensions/themes). The adapter's style keys and background-appearance enum are typed from this schema. Build validation requires exact style-key coverage and valid hexadecimal colors, including nested accents, players and syntax fields, before publishing output. The upstream schema remains unmodified.

## Releases

`scripts/ci/release/zed.toml` selects independent versions from `extension.toml` and maintains `CHANGELOG.md`. It reuses the `git-archive` profile: an installable `zed` branch, immutable `zed-X.Y.Z` distribution tags, `zed-source-X.Y.Z` source markers, and a frozen tar archive. The current `0.1.0` is an unreleased source baseline. Below 1.0, fixes advance the patch; features and breaking changes advance the minor version. Hosted setup must seed the reviewed baseline before running release preparation.

A GitHub release distributes the extension but does not publish it to Zed's registry. A later, separately authorized PR to `zed-industries/extensions` must reference the immutable distribution commit on the `zed` branch, where `extension.toml` and `themes/` are at the root. Do not point to the source package directory, which does not contain generated theme JSON. Follow [Zed's publishing guide](https://zed.dev/docs/extensions/publishing/publishing-guide) and manually test the exact submitted commit. See `scripts/ci/release/README.md` for baseline and submission steps.
