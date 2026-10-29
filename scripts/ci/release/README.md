---
agent:
  instruction: Preserve independent versions, overlapping shared inputs, immutable candidates, and retry behavior; never publish from an unreviewed or stale release plan.
  on-change:
    - scripts/ci/release/**
    - .github/workflows/release.yml
    - .release-plan.json
---

# Application releases

Python Semantic Release 10.7.0 selects commits and prepares versions and changelogs. `coordinator.py` combines those edits into one PR, assembles distributions, and publishes frozen artifacts. Install Python dependencies from `requirements.txt` and Node dependencies with `npm ci --prefix scripts/ci/release --ignore-scripts`. Node 22 or later is required by the pinned VSCE 4.1.0.

## Verification

`npm run test:release` runs the offline TypeScript VSCE credential-boundary and authentication-probe checks after both root and release Node dependencies are installed. Python tests under `tests/release/test_release.py` own coordinator behavior; `tests/release/test_assemble.py` owns its Python assembly wrapper. The target package contracts are TypeScript suites under `tests/targets/`. See `tests/README.md` for the complete ownership map.

## Target definitions

Every `*.toml` here is an explicit release definition and the PSR configuration for its filename's target. Add `[kanagawa.release]` with `profile = "git-archive"` or `profile = "vscode-marketplace"`. Discovery is sorted and uses the current source checkout. `definitions.py` validates definitions before preparation or publication; a missing or unsupported profile is an error.

The existing PSR settings provide the version file/key, changelog path and source tag format. Use exactly one `version_variables` entry in `path:key` form, with either a JSON field or a quoted text assignment. Version and changelog files must live under `packages/{target}/`; the source tag format must be `{target}-source-{version}`. Marketplace profiles read the publisher and extension name from that JSON package. The target must also exist in the build registry. Unsupported declarations fail before release edits.

`git-archive` uses the deterministic tar and GitHub release/channel path. `vscode-marketplace` packages with VSCE and confirms the frozen payload in Marketplace before advancing its channel. Both use the same candidate sealing and retry rules below. A new target using either profile needs its package, builder registration, release TOML, source baseline tag and tests; common workflow YAML and coordinator routing remain unchanged. A different publisher or toolchain needs a separate implementation. Neovim and Zed use `git-archive`; VS Code uses `vscode-marketplace`. Extras remain build-only. Zed registry submission is separate from its archive release.

`python scripts/ci/release/coordinator.py check-packages` packages and validates every release-enabled target from `dist/` using the same helpers as publication. Build first. It writes only temporary artifacts and performs no Git or registry publication. The shared `npm run check` pipeline builds all targets immediately before this step; CI and `just check` call that pipeline.

## Selection and preparation

Run `python scripts/ci/release/coordinator.py prepare` on a clean `main` checkout with complete history and source tags. This command writes prepared files locally; it does not commit, push, or publish. Each target configuration includes its package, shared TypeScript sources and root build dependencies, root README/license, assembly helper, and release tooling. All release targets install the root lockfile in the exact release-source worktree before assembly. Conventional `fix` and `feat` commits trigger the configured bumps. Ordinary `docs` and `chore` commits do not. Shared releasable changes select all consuming targets even if their output is unchanged.

The generated `.release-plan.json` records the prepared source, previous source tags, previous distribution commits, selected versions, and release notes. It is machine coordination state. The bot puts only this file, version files, and package changelogs into the combined PR. Historical changelog content below the PSR marker is retained.

The hosted workflow first generates and commits extras, palette output and README-derived Neovim help on main, then passes that exact source SHA to release coordination. If main advances before coordination starts, the run defers to the newer push's queued generation workflow. The bot commits generated output directly; source contributions use PR review. `run` is the release coordination entry point. It first finishes any pending merged release, then prepares the next PR from current `main`. `automation/release` is updated with a normal fast-forward: each new prepared tree has current main and the previous automation head as parents. The tree always comes from main, so obsolete generated versions do not accumulate. No force push is used.

Require the validation check and an up-to-date branch before merging. `check-plan` compares the prepared source with `RELEASE_BASE_SHA`. Publication additionally requires the merge's first parent to equal that source and rejects unrelated edits in the release merge. Squash and ordinary merge commits are supported; do not rebase a release PR into multiple source commits.

## Immutable candidates and retries

Each selected target is assembled from the exact merged release source. Its distribution commit contains `source.json`; commit identity, parent, and timestamp are deterministic. `{target}-{version}` identifies that installable commit. A draft GitHub Release stores its artifact and `candidate.json`. Release lookup resolves drafts and published releases through GraphQL, then loads their assets by release ID; the REST tag endpoint only covers published releases. The metadata is uploaded last and seals the source, distribution commit, and artifact SHA-256 checksums.

Before sealing, a retry can rebuild the tree, but it must reuse and validate any artifact already uploaded. After sealing, every retry downloads and verifies the existing artifact. It does not rebuild or replace it. An existing immutable tag with another commit, a conflicting package version, or an artifact checksum mismatch stops publication.

Only after every selected candidate is sealed does the coordinator atomically push `{target}-source-{version}` markers on the source commit. These reserve versions; they do not assert registry success. Only public distribution tags have GitHub Releases. There are no moving latest tags.

Archive publication for Neovim and Zed advances the target’s installable branch and publishes the draft. VS Code publishes the frozen VSIX, confirms that exact version's payload in Marketplace, then advances its branch and publishes its draft. A timeout is retried against the same artifact. An already present Marketplace version must match all candidate ZIP payload entries; a conflicting version stops the run. A published GitHub Release marks that target complete. Successful deployment records use stable application environment names and link to the public release or Marketplace. Status repair is idempotent.

The workflow serializes release work and blocks the next release PR until the previous batch finishes. Ordinary source commits can continue meanwhile. Retry a failed run with workflow dispatch. Do not edit `.release-plan.json`, move tags, delete candidates, or manufacture another version to bypass a retryable publication failure.

For a permanent Marketplace validation rejection, a reviewed declaration in `rejections.json` can retire the candidate without claiming publication. Each declaration binds the source, target, version, and SHA-256 of the original `candidate.json`, with a reason and evidence URL. Recovery requires a sealed draft whose artifacts and immutable tag still match, and confirms the version is absent from Marketplace. The draft, artifacts, tags, and channel remain unchanged; no successful deployment is recorded. Other targets finish normally, after which a separately corrected release may be prepared. Rejections are never inferred from a failed command.

Reconciliation runs the current coordinator against the exact frozen source worktree using paired `publish --source-root PATH --source-sha SHA` arguments. The source must be the current worktree root, share the tooling checkout's Git directory, and have the requested HEAD. Current tooling owns rejection declarations and publication dependencies; the frozen source owns release definitions, package versions, assembly code, and build dependencies. Sealed candidates are still downloaded and verified rather than rebuilt.

## Authentication probe

`check-marketplace-auth.mts` checks the installed VSCE credential helper's token endpoint, authorization scheme, audience, and publisher before making live requests. Run the offline check from the repository root:

```sh
node --import tsx scripts/ci/release/check-marketplace-auth.mts --check-client
```

The pinned VSCE 4.1.0 passes this protocol check. Offline tests cover the installed client, rejection of incompatible clients, an independent protocol fixture, and secret-free errors. The probe does not patch the installed client.

The `authentication_only` dispatch input in `.github/workflows/release.yml` runs the live check on `main` with `contents: read` and `id-token: write`. It skips generation and publication. The probe requests a GitHub OIDC token, exchanges it through the installed VSCE helper, and discards the credential. It rejects redirects, limits request time, and omits response bodies and credentials from errors. Other branches skip this mode. A successful exchange establishes authentication only, not package publication.

Publication uses `vsce publish --oidc --packagePath` with no PAT fallback. The workflow selects `vsce.sh` through `KANAGAWA_VSCE` to keep CLI progress and failures on stderr while the coordinator captures stdout. The wrapper forwards arguments and the exit status to the pinned client, including when retrying a frozen source. Publisher trust must match the repository, workflow filename, and any job environment restriction. Deployment records do not set a job environment.

## Zed archive

`zed.toml` reads the version from `packages/zed/extension.toml` and writes the package changelog. With `allow_zero_version = true` and `major_on_zero = false`, fixes advance the patch version; features and breaking changes below 1.0 advance the minor version. Preparation requires a matching source baseline tag.

The archive profile produces `zed-X.Y.Z.tar`, an immutable distribution commit/tag, and the `zed` branch. Its deployment links to the GitHub Release. The distribution contains `extension.toml`, generated `themes/`, the README, license, and changelog. This tooling does not submit or update Zed registry entries.
