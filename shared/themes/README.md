---
agent:
  instruction: Keep Ink and Canvas structurally consistent and preserve exact palette values; semantic regrouping must follow the delivery plan.
  on-change: shared/themes/**
---

# Theme relationships

Ink and Canvas implement `ThemeDefinition` through named palette references and explicit color operations. Adapters decide placement and context. `changes` groups indicators and diff treatments; `accents` contains shared emphasis colors. Separate presentation values are retained when the variants currently differ.

The Neovim adapter projects these roles into the existing public configuration fields. Sharing a default expression does not couple user overrides of those fields. No role is removed solely because its current hex matches another role.
