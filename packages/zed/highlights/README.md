---
agent:
  instruction: Keep highlight mappings and shared role boundaries consistent when this directory changes.
  on-change: "packages/zed/highlights/**"
---

# Zed highlights

`index.ts` assembles the theme exposed by `packages/zed/adapter.ts`. `editor.ts` maps UI, status, and terminal fields against the pinned theme schema. `syntax.ts` maps the combined parser and semantic highlight categories and omits inherited colors. Colors and presentation values come from the shared theme and style policy.

Zed controls semantic-token routing; these theme mappings cannot recover distinctions its routing discards. Keep one combined syntax table rather than duplicating semantic mappings. The pinned theme format supports bold and italic, but not underline or strikethrough.
