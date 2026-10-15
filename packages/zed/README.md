---
agent:
  instruction: Keep Zed differences in this adapter and preserve the shared palette and semantic contract.
  on-change: packages/zed/**
---

# Zed adapter

`just build zed` writes a local extension with Ink and Canvas under `dist/zed`. In Zed, use **Install Dev Extension** and select that directory. This target has no automated registry publication or release version selection yet.

The adapter maps canonical UI, syntax, status, changes, and ANSI roles directly. Zed's player selection and cursor fields use the shared selection and normal-mode colors. Unsupported scopes retain Zed's fallback. No shared palette, role, or Neovim mapping was added for this target.

`theme.schema.json` is the unmodified v0.2.0 schema retrieved from [Zed](https://zed.dev/schema/themes/v0.2.0.json) on 2026-10-15. Builds validate against this pinned schema without network access. When refreshing it, review changes against the [theme extension contract](https://zed.dev/docs/extensions/themes). The adapter's style keys are typed from this schema; misspelled keys fail TypeScript.
