---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "shared/**"
---

# Shared theme data

`palette.ts` owns the immutable named colors. `theme.ts` defines the shared semantic contract; `themes/ink.ts` and `themes/canvas.ts` assign expressions to it. `color/` evaluates those expressions without editor dependencies. Application settings and exceptions belong to adapters.

`styles.ts` owns named text styles for syntax, markup, and UI states. Its `textStyles` policy has no editor token names or colors. Adapters bind their classifications to those roles; equal defaults do not make distinct roles interchangeable. For example, `openedFile` is independent of `comment`, even when their defaults match. Neovim receives the policy as generated `style_defaults.lua`, including plugin integrations. Its existing `styles.comment`, `styles.functions`, and other configuration overrides remain supported; the generated `KanagawaStyles` annotation exposes all role names.

Style attributes are `bold`, `italic`, `underline`, and `strikethrough`. `true` enables an attribute, `false` disables it, and omission inherits the underlying style. VS Code semantic overlays can retain independent attributes through `semanticStyle`. Existing whole-style replacements continue to use `fontStyle`, preserving their clearing of less-specific and fallback attributes. TextMate replaces the entire font style set when any attribute is specified, so partial inheritance cannot be represented there. An empty style leaves `fontStyle` unset. Zed emits explicit normal weight/style for `false`; its pinned theme format supports only bold and italic, and the translator rejects enabled unsupported decorations. Comments and documentation default to italic. Deprecated text uses a strikethrough-only overlay, preserving other emphasis. Function names, declaration names, calls, and control flow default to bold. `functions` is the fallback for undifferentiated function tokens; `functionDeclaration`, `functionCall`, `functionReference`, and `typeDeclaration` are independent contextual roles. Syntax references use the plain `functionReference` style. The base `type` style inherits contextual emphasis, so a type used as a callable can retain call styling; unclassified type references inherit their parser context. `typeAnnotation` and `annotation` italicize type contracts and declaration metadata. VS Code decorator modifiers consume `annotation`; object properties retain their separate role, and targets that distinguish markup attributes keep the separate `attribute` role. Individual roles can enable attributes independently. Neovim diagnostic/spelling undercurls retain their separate runtime option.

Neovim receives generated Lua definitions at build time. Empty records use `vim.empty_dict()` so empty style policies retain their dictionary shape when encoded as JSON. Its runtime preserves palette and theme overrides, including recalculation of dependent expressions. Do not maintain a second palette or hand-edit generated Lua.

The presentation rule is: **bold means pay attention to this; italic means interpret this differently; regular means read this normally.** Code uses bold for structure and execution landmarks, and italic for contextual annotations. Markdown uses bold for strong importance and headings, and italic for emphasis and quoted voice. UI uses bold for current focus and actionable importance, and italic for inferred or supplementary information. Ordinary file names, inactive tabs, inline code, and ordinary data stay regular. Separate roles retain independent overrides even when they share a default.

UI text styling depends on the target API. Neovim exposes highlight groups for active tabs, line numbers, mode indicators, jump labels, active signature parameters, test focus/marks, inlay hints, code lenses, and detail labels. VS Code and Zed theme UI fields mostly expose colors, so these roles cannot force font styles there. Markdown syntax mappings affect the editor buffer; rendered Markdown viewers control their own presentation.

Markdown strong, emphasis, and quote styles are overlays so nested captures can combine. VS Code additionally emits combined strong/emphasis and heading/emphasis rules because TextMate replaces the full font-style set. Plain and inactive UI roles use explicit resets.

Tree roots and opened-file labels also use bold as navigation landmarks; ordinary file labels keep their regular style. These retain independent `treeRoot` and `openedFile` overrides.

In Neovim, false clears an attribute on that highlight group; overlapping captures can still contribute the attribute. Prefer non-overlapping context captures. A target mapping can use `nocombine` when one classification must replace another’s presentation, as with Python decorator names that also match call captures. This differs from TextMate’s whole-style replacement.
