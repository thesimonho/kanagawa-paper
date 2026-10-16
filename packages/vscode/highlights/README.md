---
agent:
  instruction: Keep highlight mappings and shared role boundaries consistent when this directory changes.
  on-change: "packages/vscode/highlights/**"
---

# VS Code highlights

`index.ts` assembles the theme exposed by `packages/vscode/adapter.ts`. `editor.ts` maps UI fields, `textmate.ts` maps syntax scopes, and `semantic.ts` maps semantic token types and modifiers. Colors and presentation values come from the shared theme and style policy.

TextMate and base semantic `fontStyle` values replace the whole style set. Semantic deprecated overlays retain independent attributes and are derived for every selector so they outrank base resets after sorted serialization. Preserve rule order in the TextMate array.

Function tokens use the generic function style when call/reference context is unavailable. Declaration and definition modifiers receive style-only overlays, derived for existing selectors so built-in resets cannot hide them. Contextual TextMate rules emphasize declaration names and calls; import keywords remain plain even under the control-flow parent scope.
