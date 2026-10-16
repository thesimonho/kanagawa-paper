---
agent:
  instruction: Keep highlight mappings and shared role boundaries consistent when this directory changes.
  on-change: "packages/vscode/highlights/**"
---

# VS Code highlights

`index.ts` assembles the theme exposed by `packages/vscode/adapter.ts`. `editor.ts` maps UI fields, `textmate.ts` maps syntax scopes, and `semantic.ts` maps semantic token types and modifiers. Colors and presentation values come from the shared theme and style policy.

TextMate and base semantic `fontStyle` values replace the whole style set. Semantic deprecated overlays retain independent attributes and are derived for every selector so they outrank base resets after sorted serialization. Preserve rule order in the TextMate array.

Function tokens use the generic function style when call/reference context is unavailable. Declaration and definition modifiers receive style-only overlays, derived for existing selectors so built-in resets cannot hide them. Contextual TextMate rules emphasize declaration names and calls; import keywords remain plain even under the control-flow parent scope.

Semantic variables and parameters retain contextual syntax emphasis, allowing callable variables to remain bold. Built-in syntax names receive bold only in call context; uncalled lexical built-in names stay plain. The base type style inherits call-site syntax; TextMate type declarations require declaration context so semantic fallback scopes cannot bold every class reference. Decorator modifiers derive style-only overrides for existing selectors, followed by deprecation overlays.

Call scopes use the direct-parent combinator (`>`) rather than matching any call ancestor. More specific direct argument scopes use `functionReference`, so argument references remain plain while nested call targets retain call emphasis. Generic call-name scopes keep callable variables bold. Grammars that do not expose these contexts still rely on semantic function fallback.

Supplementary italics use contextual type-annotation grammar scopes and type/class `typeHint` modifiers. Declaration overlays follow those modifiers, then decorator and deprecation overlays. Base class styles remain inheritable so constructor calls keep call emphasis. Metadata decorators use `annotation`; markup attribute names keep the separate `attribute` role.

Markdown headings, strong text, emphasis, and quotations consume shared roles. A combined strong/emphasis selector preserves both styles when scopes nest. These mappings style source buffers; UI font weights and rendered Markdown are generally controlled by VS Code rather than color themes.
