---
agent:
  instruction: Keep query context, capture priorities, and packaging guidance current.
  on-change: "packages/neovim/queries/**"
---

# Parser context extensions

These queries extend installed parser highlight queries; they do not replace them or install parsers. The Neovim builder copies this directory into the assembled runtime. Shared presentation stays in the style policy, and Lua highlight mappings bind the captures to it.

TypeScript syntax distinguishes `type_identifier` and `predefined_type` nodes from runtime `identifier` nodes. `typescript/highlights.scm` captures the type nodes as `@type.annotation` at priority 110 and declaration names as `@type.definition` at 111, above the usual parser priority 100 and below semantic tokens. TSX inherits the TypeScript queries from its installed base queries. Language-specific generic type highlight groups remain color-only, so runtime class values retain their existing colors and callable contexts. Other languages retain their existing mappings.

This is a syntax distinction, not symbol-name matching. It covers named/primitive type expressions, including aliases, parameter/return types, assertions, constraints, and generic arguments. It does not italicize every character of an annotation. Semantic providers can still override presentation when they supply more specific styles.

Python `type` nodes distinguish real annotation syntax from runtime identifiers. Its extension captures type-name leaves, terminal names of qualified expressions, forward-reference string pieces, and annotation brackets at priority 110. It excludes declaration contexts and executable expressions, rather than styling whole regions: Neovim can combine overlapping attributes even when a later group specifies `false`. Class names, explicit aliases, and simple type-parameter declarations use the declaration capture at 111. Generic Python type captures remain color-only, so capitalization and builtin-name heuristics do not italicize runtime values or indexing. Unmarked assignments such as `Alias = list[Tensor]` remain runtime syntax; no alias intent is inferred from names.

Qualified Python expressions style only the terminal name: in `factory().Type`, `Type` is italic while `factory()` retains call emphasis. Qualifier names and dots retain their base presentation. This avoids extending annotation styling across arbitrary executable object expressions.

Python extension declarations use the style-only `@type.declaration` capture: syntax naming heuristics and semantic tokens retain foreground ownership, including simple type-parameter names that also match constant captures.

The existing `@type.definition` capture keeps its foreground ownership for installed Python TypeVar, NewType, and TypeAlias queries. Do not replace it with a language-wide style-only override.
