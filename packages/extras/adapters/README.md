---
agent:
  instruction: Preserve each target's output contract and use typed role references; keep generated outputs out of this source directory.
  on-change: packages/extras/adapters/**
---

# Extras adapters

These maintained TypeScript functions return files for the registry in `../registry.ts`. Simple formats use native template literals with typed role references. Multi-file adapters return named suffixes. Tailwind also produces the complete palette.

Color references use typed shared roles; headers use the registry metadata fields. Do not emit legacy template placeholders in generated output.

Use `npm run build -- extras` or `npm run watch -- extras --only kitty` from the repository root. A filtered build preserves other adapters' output; the selected adapter owns its generated subdirectory.
