---
agent:
  instruction: Keep highlight mappings and shared role boundaries consistent when this directory changes.
  on-change: "packages/neovim/lua/kanagawa-paper/highlights/**"
---

# Neovim highlights

`init.lua` assembles core highlights and enabled plugin integrations, then applies user overrides. `syntax.lua` maps legacy syntax groups, `treesitter.lua` maps parser captures, and `semantic.lua` maps LSP token types and modifiers. `editor.lua` owns editor UI, `lsp.lua` owns references, inlay hints, signature help, and code lenses, and `ft.lua` owns filetype-specific groups. Plugin integrations remain in `plugins/`.

Modules receive resolved colors and configuration. Use shared style roles through `opts.styles`; preserve links when a group should follow another highlight. Plugin discovery caches are reusable only for the current runtime plugin directory. This directory is copied as part of the existing Lua runtime build; it needs no separate packaging step.

Structural emphasis distinguishes parser function declarations/calls and type definitions. Semantic declaration/definition modifiers add styles without replacing colors. Undifferentiated semantic functions use the generic function style; semantic keywords preserve parser control-flow emphasis. Parser type references use supplementary italics; explicit definitions and constructors retain structural bold. Semantic `typeHint` modifiers use the annotation style without changing colors.

Parser attributes and dedicated semantic decorator types use metadata italics. Function tokens carrying only a decorator modifier can still receive higher-priority function styles, especially built-in/default-library type modifiers; static highlight groups cannot reliably order conflicting modifiers.

Core tabs and plugin current-tab groups use `activeTab`; visible or inactive tabs stay separate. UI emphasis comes from shared roles, including supplementary inlay hints/code lenses and focused signature parameters. Markdown headings and emphasis use the same roles in legacy syntax, Tree-sitter, and rendering integrations. Overlapping strong/emphasis captures combine. Quoted-body styling requires a parser capture; the built-in Markdown syntax only identifies the quote marker.

TypeScript and TSX specialize generic type groups to color-only mappings. The packaged query extension adds annotation captures for syntax type nodes and higher-priority declaration captures, preserving the distinction between `Record` in a type expression and runtime `Object.values`. The generic `@type.annotation` capture consumes the shared annotation role without changing colors.

Python also specializes generic type groups to color-only mappings. Its query captures type-name leaves and annotation brackets while leaving indexing and executable expressions outside italic captures. Declaration names are excluded from annotation captures. Python decorator captures use `nocombine` so metadata emphasis replaces overlapping call emphasis, including the built-in decorator foreground inherited from `Special1`.
