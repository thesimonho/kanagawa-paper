---
agent:
  instruction: Keep test ownership and runtime requirements current when tests move or change.
  on-change: ["tests/**", "scripts/release/*.test.ts"]
---

# Test ownership

Run `npm test` for the TypeScript build suites. Install root dependencies first; Neovim must be available for distribution and cross-target runtime checks.

- `colors.test.ts`: shared palette and color arithmetic.
- `build.test.ts`: deterministic package contents for every registered target.
- `output.test.ts`: shared publication, rollback, locking and source protection.
- `watch.test.ts`: watch invalidation, fresh modules and recovery after errors.
- `generation.test.ts`: checked-in palette documentation.
- `neovim.test.ts`, `vscode.test.ts`, `zed.test.ts`, `extras.test.ts`: each target's adapter, output and packaging contracts. VS Code also compares its output with the installed Neovim roles.
- `helpers.ts`: file hashing and independent artifact-fixture comparison; no target behavior.

Lua `*_spec.lua` files run inside Neovim through `just test`. The standalone `installable.lua`, `neovim_roles.lua` and `runtime_snapshot.lua` scripts are runtime probes invoked by TypeScript tests. Keep Neovim-specific operations in Lua rather than embedding Lua strings in another language.

Python `test_assemble.py` checks the Python-to-Node wrapper, and `test_release.py` checks the Python release coordinator. `test_generation.py` exercises the shell publication workflow against local Git remotes; its Python harness also owns the release automation fixtures. Run them through `python3 -m unittest discover -s tests -p 'test_*.py'` with the pinned release dependencies installed.

The Node-only publisher credential contract lives in `scripts/release/oidc.test.ts`. Run `npm run test:release` after installing `scripts/release` dependencies. Keeping it separate lets the core build suites run without Marketplace tooling. `just check`, `just test-targets` and CI include it.

See `fixtures/README.md` for baseline provenance. Do not rewrite baselines as part of test reorganization. The generation action requires fresh, nonempty vimdoc output. Repeatability checks for vimdoc use the pinned panvimdoc runtime outside these test suites.
