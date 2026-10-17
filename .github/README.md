---
agent:
  instruction: Keep issue form IDs, labels, and workflow parsing aligned. Document the files and current workflow behavior.
  on-change: ".github/**"
---

# GitHub contribution setup

Both issue forms use a free-text `application` field and a `theme` selector. Applications and plugins are named by the reporter and do not create labels. Keep the theme options aligned with `advanced-issue-labeler.yml`. The feature form accepts an optional application or plugin link instead of assuming every request concerns a Neovim plugin.

`workflows/label-issues.yml` selects one form from the issue's `bug` or `enhancement` label and adds theme labels when the issue opens. It does not reconcile labels after body edits; maintainers adjust those during triage. It uses `GITHUB_TOKEN` with issue write and contents read access, without a deploy key or persisted checkout credentials.

Keep the existing `bug`, `enhancement`, `theme: ink`, and `theme: canvas` labels. Existing `plugin` labels remain historical; new requests describe the application or plugin in the form.

The PR template asks for affected applications, validation, and visual comparisons. Its HTML comments are authoring guidance and do not appear in the submitted Markdown preview.

Build validation and post-merge generation use the shared action documented in `actions/generate/README.md`. Release commands and publication contracts are documented in `scripts/ci/release/README.md`.

The release workflow has an `authentication_only` dispatch input. On `main`, it runs the Marketplace token-exchange probe with contents read and OIDC write permissions. It skips both generation and publication and does not use `DEPLOY_KEY`. Other branches skip this mode entirely.

Generation and release jobs in `workflows/release.yml` require the Actions variable `KANAGAWA_RELEASES_ENABLED` to equal `true`, the `main` ref, and a non-authentication run. An unset or false variable skips both jobs, including manual release dispatches. Validation in `workflows/run-tests.yml` is independent of this switch. The authentication-only job is also independent and requires explicit dispatch on `main`. Workflow token permissions default to read-only; the release job declares its write permissions.
