---
agent:
  instruction: Keep test ownership, discovery commands and runtime requirements current when tests move or change.
  on-change: "tests/**"
---

# Tests

| Directory   | Ownership                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `shared/`   | Palette/color arithmetic, shared syntax-role and emphasis parity, deterministic builds for every target, publication, watching and generated palette documentation |
| `targets/`  | Neovim, VS Code, Zed and extras adapter/output contracts; VS Code also compares installed Neovim roles                     |
| `neovim/`   | Lua runtime specs and standalone runtime probes called by TypeScript                                                       |
| `release/`  | Python release/assembly/publication checks and TypeScript VSCE OIDC and authentication-probe contracts                     |
| `support/`  | Shared file hashing and independent artifact-fixture comparison                                                            |
| `fixtures/` | Regression fixtures and documented behavior differences; see its README                                                   |

Run `npm test` for the shared and target TypeScript suites after installing root dependencies. Neovim must be available for installed-runtime checks. `npm run test:release` separately runs the OIDC and authentication-probe contracts after installing the Node dependencies in `scripts/ci/release`; core build tests do not require Marketplace tooling.

`just test` runs the Lua specs in `neovim/`. The other Lua files there are probes invoked by target tests, not standalone test suites. Keep Neovim operations in Lua rather than embedding Lua strings in another language.

Run Python automation tests with `python3 -m unittest discover -s tests/release -p 'test_*.py'` after installing the pinned release dependencies. `just test-targets` runs those plus the OIDC and authentication-probe contracts. `just check` and CI both call `npm run check`, which includes all suites, builds every registered target, and packages/validates every release-enabled target without publishing.

Do not rewrite baseline fixtures to make a regression pass. The generation action requires fresh, nonempty vimdoc output; repeatability checks use the pinned panvimdoc runtime outside these suites.
