---
agent:
  instruction: Keep issue form IDs, labels, and workflow parsing aligned; preserve the local-only cutover boundary until hosted setup is approved.
  on-change: ".github/**"
---

# GitHub contribution setup

Both issue forms use a free-text `application` field and a `theme` selector. Applications and plugins are named by the reporter and do not create labels. Keep the theme options aligned with `advanced-issue-labeler.yml`. The feature form accepts an optional application or plugin link instead of assuming every request concerns a Neovim plugin.

`label-issues.yml` selects one form from the issue's `bug` or `enhancement` label and adds theme labels when the issue opens. It does not reconcile labels after body edits; maintainers adjust those during triage. It uses `GITHUB_TOKEN` with issue write and contents read access, without a deploy key or persisted checkout credentials.

Keep the existing `bug`, `enhancement`, `theme: ink`, and `theme: canvas` labels. Existing `plugin` labels remain historical; new requests describe the application or plugin in the form. The form links use the planned `kanagawa-paper` repository name. Apply the repository rename before enabling these forms on the default branch. No new labels are required.

The PR template asks for affected applications, validation, and visual comparisons. Its HTML comments are authoring guidance and do not appear in the submitted Markdown preview.

Build validation and post-merge generation use the shared action documented in `actions/generate/README.md`. Release workflow behavior and hosted cutover requirements live in `scripts/ci/release/README.md`.

The release workflow has an `authentication_only` dispatch input. On `main`, it runs the Marketplace token-exchange probe with contents read and OIDC write permissions. It skips both generation and publication and does not use `DEPLOY_KEY`. Other branches skip this mode entirely. See the release README for the current client/backend blockers and the order of hosted readiness checks.
