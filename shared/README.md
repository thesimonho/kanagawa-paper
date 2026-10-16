---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "shared/**"
---

# Shared theme data

`palette.ts` owns the immutable named colors. `theme.ts` defines the shared semantic contract; `themes/ink.ts` and `themes/canvas.ts` assign expressions to it. `color/` evaluates those expressions without editor dependencies. Application settings and exceptions belong to adapters.

`styles.ts` owns named text styles for syntax, markup, and UI states. Its `textStyles` policy has no editor token names or colors. Adapters bind their classifications to those roles; equal defaults do not make distinct roles interchangeable. For example, `openedFile` is independent of `comment`, even when their defaults match. Neovim receives the policy as generated `style_defaults.lua`, including plugin integrations. Its existing `styles.comment`, `styles.functions`, and other configuration overrides remain supported; the generated `KanagawaStyles` annotation exposes all role names.

Style attributes are `bold`, `italic`, `underline`, and `strikethrough`. `true` enables an attribute, `false` disables it, and omission inherits the underlying style. VS Code semantic overlays can retain independent attributes through `semanticStyle`. Existing whole-style replacements continue to use `fontStyle`, preserving their clearing of less-specific and fallback attributes. TextMate replaces the entire font style set when any attribute is specified, so partial inheritance cannot be represented there. An empty style leaves `fontStyle` unset. Zed emits explicit normal weight/style for `false`; its pinned theme format supports only bold and italic, and the translator rejects enabled unsupported decorations. Comments and documentation default to italic. Deprecated text uses a strikethrough-only overlay, preserving other emphasis. Other roles remain plain. Individual roles can enable attributes independently. Neovim diagnostic/spelling undercurls retain their separate runtime option.

Neovim receives generated Lua definitions at build time. Its runtime preserves palette and theme overrides, including recalculation of dependent expressions. Do not maintain a second palette or hand-edit generated Lua.
