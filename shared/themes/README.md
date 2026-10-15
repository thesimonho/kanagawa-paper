---
agent:
  instruction: Keep Ink and Canvas structurally consistent and preserve exact palette values and independent public overrides.
  on-change: shared/themes/**
---

# Theme relationships

Ink and Canvas implement `ThemeDefinition` through named palette references and explicit color operations. Adapters decide placement and context. `changes` groups indicators and diff treatments; `accents` contains shared emphasis colors. Separate presentation values are retained when the variants currently differ.

The Neovim adapter projects these roles into the existing public configuration fields. Sharing a default expression does not couple user overrides of those fields. No role is removed solely because its current hex matches another role.

UI emphasis uses `accents.primary` after visual review. Neovim still exposes independent `ui.special` and `accent.accent1` overrides. Syntax special colors remain separate.
