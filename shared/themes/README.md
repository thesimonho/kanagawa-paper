---
agent:
  instruction: Keep Ink and Canvas structurally consistent and preserve exact palette values and independent public overrides.
  on-change: shared/themes/**
---

# Theme relationships

Ink and Canvas implement `ThemeDefinition` through named palette references and explicit color operations. Adapters decide placement and context. `changes` groups indicators and diff treatments; `accents` contains shared emphasis colors. Separate presentation values are retained when the variants currently differ.

The Neovim adapter projects these roles into the existing public configuration fields. Sharing a default expression does not couple user overrides of those fields. No role is removed solely because its current hex matches another role.

UI emphasis uses `accents.primary`. Neovim still exposes independent `ui.special` and `accent.accent1` overrides. Syntax special colors remain separate.

`ui.editor.lineNumbers.default` and `.active` set line-number colors across Neovim, VS Code, and Zed. Neovim exposes them as `ui.line_numbers.default` and `.active`; they are independent of `ui.nontext` and `diag.warning`. The active Neovim line number remains bold. Gutter backgrounds remain separate adapter settings.

Active indent guides use `ui.editor.indent.active`, exposed as Neovim's `ui.indent_scope`. Mini.indentscope, Snacks, and indent-blankline consume this role independently of the primary accent. Its defaults match ordinary guides: Ink `#363646` and Canvas `#d1cfc5`. Ordinary guides use `ui.editor.indent.default`; the active and ordinary roles can be overridden independently.
