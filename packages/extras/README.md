---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "packages/extras/**"
---

# Extras target

`registry.ts` registers the 18 copyable formats; `adapters/*.ts` map shared roles to each format. `build.ts` renders a complete target in staging before publication. These modules are never installed with Neovim.

Run `just build extras` for `dist/extras`, or `npm run watch -- extras --only kitty` for one adapter. A filtered build retains other existing extras. `just generate` updates checked-in extras and the palette preview. All 39 existing configuration files have baseline parity coverage.
