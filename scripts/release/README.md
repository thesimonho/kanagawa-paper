---
agent:
  instruction: Preserve independent versions, overlapping shared inputs, immutable candidates, and retry behavior; never publish from an unreviewed or stale release plan.
  on-change:
    - scripts/release/**
    - .github/workflows/release.yml
    - .release-plan.json
---

# Application releases

Python Semantic Release 10.7.0 selects commits and prepares versions and changelogs. `coordinator.py` combines those edits into one PR, assembles distributions, and publishes frozen artifacts. Install Python dependencies from `requirements.txt` and Node dependencies with `npm ci --prefix scripts/release --ignore-scripts`. Node 22 or later is required by the pinned VSCE 4.0.0.

## Verification

`npm run test:release` runs the TypeScript VSCE credential-boundary check after both root and release Node dependencies are installed. Python tests under `tests/release/test_release.py` own coordinator behavior; `tests/release/test_assemble.py` owns its Python assembly wrapper. The target package contracts are TypeScript suites under `tests/targets/`. See `tests/README.md` for the complete ownership map.

## Selection and preparation

Run `python scripts/release/coordinator.py prepare` on a clean `main` checkout with complete history and source tags. This command writes prepared files locally; it does not commit, push, or publish. Each target configuration includes its package, shared TypeScript sources and root build dependencies, root README/license, assembly helper, and release tooling. Both targets install the root lockfile in the exact release-source worktree before assembly. Conventional `fix` and `feat` commits trigger the configured bumps. Ordinary `docs` and `chore` commits do not. Shared releasable changes select both targets even if their output is unchanged.

The generated `.release-plan.json` records the prepared source, previous source tags, previous distribution commits, selected versions, and release notes. It is machine coordination state. The bot puts only this file, version files, and package changelogs into the combined PR. Historical changelog content below the PSR marker is retained.

The hosted workflow first generates and commits extras, palette output and README-derived Neovim help on main, then passes that exact source SHA to release coordination. If main advances before coordination starts, the run defers to the newer push's queued generation workflow. This direct bot commit is an explicit automation exception; source contributions still use PR review. `run` is the release coordination entry point. It first finishes any pending merged release, then prepares the next PR from current `main`. `automation/release` is updated with a normal fast-forward: each new prepared tree has current main and the previous automation head as parents. The tree always comes from main, so obsolete generated versions do not accumulate. No force push is used.

Require the validation check and an up-to-date branch before merging. `check-plan` compares the prepared source with `RELEASE_BASE_SHA`. Publication additionally requires the merge's first parent to equal that source and rejects unrelated edits in the release merge. Squash and ordinary merge commits are supported; do not rebase a release PR into multiple source commits.

## Immutable candidates and retries

Each selected target is assembled from the exact merged release source. Its distribution commit contains `source.json`; commit identity, parent, and timestamp are deterministic. `{target}-{version}` identifies that installable commit. A draft GitHub Release stores its artifact and `candidate.json`. Release lookup resolves drafts and published releases through GraphQL, then loads their assets by release ID; the REST tag endpoint only covers published releases. The metadata is uploaded last and seals the source, distribution commit, and artifact SHA-256 checksums.

Before sealing, a retry can rebuild the tree, but it must reuse and validate any artifact already uploaded. After sealing, every retry downloads and verifies the existing artifact. It does not rebuild or replace it. An existing immutable tag with another commit, a conflicting package version, or an artifact checksum mismatch stops publication.

Only after every selected candidate is sealed does the coordinator atomically push `{target}-source-{version}` markers on the source commit. These reserve versions; they do not assert registry success. Only public distribution tags have GitHub Releases. There are no moving latest tags.

Neovim publication advances its installable branch and publishes the draft. VS Code publishes the frozen VSIX, confirms that exact version's payload in Marketplace, then advances its branch and publishes its draft. A timeout is retried against the same artifact. An already present Marketplace version must match all candidate ZIP payload entries; a conflicting version stops the run. A published GitHub Release marks that target complete. Successful deployment records use stable application environment names and link to the public release or Marketplace. Status repair is idempotent.

The workflow serializes release work and blocks the next release PR until the previous batch finishes. Ordinary source commits can continue meanwhile. Retry a failed run with workflow dispatch. Do not edit `.release-plan.json`, move tags, delete candidates, or manufacture another version to bypass a failed publication.

## Hosted cutover

Before enabling the workflow:

1. Rename the repository to `kanagawa-paper` and the default branch to `main`. Preserve the old repository name's redirect and historical tags.
2. Confirm a write-enabled `DEPLOY_KEY`, Marketplace trusted publishing for this repository and `.github/workflows/release.yml`, and permission for Actions to create pull requests. The deploy key makes automation branch pushes trigger validation; `GITHUB_TOKEN` alone does not trigger those ordinary follow-up workflows. Fork PR validation uses read-only credentials.
3. Enable required validation with an up-to-date base. Confirm the stable `neovim` and `vscode` deployment links are visible to users.
4. Seed `neovim-source-4.1.0` and `vscode-source-2.2.1` at an explicitly reviewed source baseline. For the unchanged VS Code import, this must be a main commit containing the package. Never fabricate an ancestor before import or let PSR replay unrelated old commits from version zero. If the consolidation is squash-merged, seed both baselines at that reviewed merge, then make an intentional shared `feat` commit to produce the first consolidated releases.
5. Run and verify the combined release PR, publication, installation from the Neovim channel/tag, Marketplace update, and deployment links. Archive the old VS Code repository only after successful publication and add a pointer to this repository.

These steps require live verification. Local fixtures do not establish hosted permissions, registry access, public UI, or a successful release.

VSCE uses `publish --oidc --packagePath` with no PAT fallback. Only the release job receives `id-token: write`. The publisher trust configuration must match the final repository name, workflow filename, and any environment restriction. Configure and verify this in Marketplace before enabling publication; local tests only verify invocation and inherited CI environment.
