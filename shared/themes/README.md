---
agent:
  instruction: Keep Ink and Canvas structurally consistent and preserve exact palette values and independent public overrides.
  on-change: shared/themes/**
---

# Theme relationships

Ink and Canvas implement `ThemeDefinition` through named palette references and explicit color operations. Adapters decide placement and context. `changes` groups indicators and diff treatments; `accents` contains shared emphasis colors. Separate presentation values are retained when the variants currently differ.

The Neovim adapter projects these roles into the existing public configuration fields. Sharing a default expression does not couple user overrides of those fields. No role is removed solely because its current hex matches another role.

UI emphasis uses `accents.primary`. Neovim still exposes independent `ui.special` and `accent.accent1` overrides. Syntax special colors remain separate.

`ui.editor.lineNumbers.default` and `.active` set line-number colors across Neovim, VS Code, and Zed. Neovim exposes them as `ui.line_numbers.default` and `.active`; they are independent of `ui.nontext` and `diag.warning`. Its active line-number emphasis uses the shared `activeLineNumber` style role. Gutter backgrounds remain separate adapter settings.

Active indent guides use `ui.editor.indent.active`, exposed as Neovim's `ui.indent_scope`. Mini.indentscope, Snacks, and indent-blankline consume this role independently of the primary accent. Its defaults match ordinary guides: Ink `#363646` and Canvas `#d1cfc5`. Ordinary guides use `ui.editor.indent.default`; the active and ordinary roles can be overridden independently.

`syntax.builtinFunction`, `syntax.tag`, and `syntax.selector` keep parser-style built-ins, markup tags, and CSS selectors consistent across adapters. Neovim exposes these as `syn.fun_builtin`, `syn.tag`, and `syn.selector`; each remains independently overridable. Default syntax emphasis is defined in `shared/styles.ts`, consumed by VS Code/Zed and emitted as Neovim's `style_defaults.lua`.

Rendered heading blocks use each rainbow foreground on `ui.surface.tones.p1` (`ui.bg_p1` in Neovim). Popup surfaces and text use the floating roles; focused picker rows use the alternate current-line surface.
