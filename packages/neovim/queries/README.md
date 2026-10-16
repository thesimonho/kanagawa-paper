---
agent:
  instruction: Keep query context, capture priorities, and packaging guidance current.
  on-change: "packages/neovim/queries/**"
---

# Parser context extensions

These queries extend installed parser highlight queries; they do not replace them or install parsers. The Neovim builder copies this directory into the assembled runtime. Shared presentation stays in the style policy, and Lua highlight mappings bind the captures to it.

TypeScript syntax distinguishes `type_identifier` and `predefined_type` nodes from runtime `identifier` nodes. `typescript/highlights.scm` captures the type nodes as `@type.annotation` at priority 110 and declaration names as `@type.definition` at 111, above the usual parser priority 100 and below semantic tokens. TSX inherits the TypeScript queries from its installed base queries. Language-specific generic type highlight groups remain color-only, so runtime class values retain their existing colors and callable contexts. Other languages retain their existing mappings.

This is a syntax distinction, not symbol-name matching. It covers named/primitive type expressions, including aliases, parameter/return types, assertions, constraints, and generic arguments. It does not italicize every character of an annotation. Semantic providers can still override presentation when they supply more specific styles.
