---
agent:
  instruction: Keep build entry points rooted in this checkout and use isolated outputs; restrict direct main writes to the approved post-merge generated-file publisher.
  on-change: scripts/**
---

# Build and validation commands

`bootstrap.lua` adds the package, shared, and generator runtime roots for isolated Neovim commands. The test runner uses checkout-local `.tests` state. `assemble.py` creates complete application trees under ignored `dist/`; it copies the shared README and license, combines Neovim runtime modules, and invokes the standalone VS Code mapping renderer.

`build.sh` generates the copyable extras. `generate_palette.lua` reads the shared palette directly. The shared `.github/actions/generate` action runs both plus the existing panvimdoc generator, using the root README to produce `packages/neovim/doc/kanagawa-paper.nvim.txt`. Never hand-edit that generated help file. The fixed panvimdoc title makes repeated runs deterministic.

PR validation runs the shared generation action, including for forks, without requiring output to be committed. It assembles packages after generation and uploads the generated files for optional inspection. After merge, the serialized default-branch workflow runs the same action, then `publish-generated.sh` commits only extras, palette output and Neovim help directly to main under the approved automation exception. New ignored extras are included; unchanged output creates no commit. A concurrent source push is rejected rather than overwritten; its queued workflow regenerates from the latest source. Release coordination receives the generated source SHA and defers if main has advanced. `just generate` remains an optional local extras/palette preview, not a delivery requirement.

`release/` owns release selection and publication. Build output and temporary experiments are disposable. Package tests verify assembled runtime loading, identity, content, and determinism. Release tests use real PSR and local bare Git with fake external publishing to exercise selection and recovery.
