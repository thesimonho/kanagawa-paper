---
agent:
  instruction: Keep collector capabilities, evidence limits, and commands current when audit tooling changes.
  on-change: "scripts/theme-audit/**"
---

# Theme audit tools

These contributor tools collect highlighting evidence from the same source probes in different editors. Neovim is the comparison baseline. This directory is independent of the distributed theme packages and has no additional Node dependencies. Node 22 or later is required.

## Fixtures and reports

`fixtures/manifest.json` gives stable probe IDs and unique line/text anchors for Python, TypeScript, and Rust. Fixtures are ASCII so zero-based UTF-16 columns (VS Code) and byte columns (Neovim) agree. Each report includes the fixture SHA-256, editor version, theme name, raw classifications, and optional effective styles. Reports can contain local extension details; `reports/` is ignored and must not be published.

Run from the repository root:

```sh
node scripts/theme-audit/cli.cjs validate
node --test scripts/theme-audit/core.test.cjs
node scripts/theme-audit/cli.cjs compare scripts/theme-audit/reports/neovim-sample.py.json scripts/theme-audit/reports/vscode-sample.py.json
```

The comparison rejects different fixture contents or theme names. It compares exact RGB colors and emphasis for matching probes. Missing or incomplete effective styles are **unknown**, never a match. Use exactly the same theme name in both reports, for example `Kanagawa Paper Canvas`.

## VS Code

Build the theme with `npm run build -- vscode`, then launch a separate development window without attaching a debugger. On systems where `code` is available:

```sh
code --new-window --extensionDevelopmentPath="$PWD/dist/vscode" --extensionDevelopmentPath="$PWD/scripts/theme-audit" "$PWD"
```

For the Flatpak distribution with its Node SDK installed:

```sh
FLATPAK_ENABLE_SDK_EXT=node24 flatpak run com.visualstudio.code --new-window --extensionDevelopmentPath="$PWD/dist/vscode" --extensionDevelopmentPath="$PWD/scripts/theme-audit" "$PWD"
```

Select the local theme, open a fixture, and wait for its language extension to finish starting. Python needs Python/Pylance; TypeScript uses the built-in language service; Rust needs rust-analyzer. These tools do not install or configure language servers. A standalone Rust file may need to be included in a Cargo project for semantic analysis. Treat absent tokens as incomplete coverage.

Run **Theme Audit: Collect Active Fixture**. The command records document semantic tokens using VS Code's documented provider commands, active extension versions, and the semantic-highlighting setting. It opens the JSON report. Rerunning replaces that fixture's report, including manual annotations; save annotated copies under another name first.

The collector does not expose TextMate scopes or final computed colors. VS Code's supported extension API does not provide the token inspector's resolved style. Use **Developer: Inspect Editor Tokens and Scopes** at each probe to record those details manually. Provider tokens alone do not prove that semantic highlighting is displayed. See the [command API](https://code.visualstudio.com/api/references/commands) and [semantic highlighting guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide).

`runtime-smoke.cjs` is an extension-host integration test using a controlled semantic provider. Run it with `--extensionTestsPath` in a disposable copy of this tool directory and an isolated user-data directory. It verifies collection, not Pylance or theme rendering.

## Neovim

Use your configured Neovim with the local theme, Tree-sitter parser, and desired language server active. Open the same fixture, then run from the repository root:

```vim
:lua dofile(vim.fn.getcwd() .. '/scripts/theme-audit/neovim.lua').collect('Kanagawa Paper Canvas')
```

The collector writes `reports/neovim-<fixture>.json`, preserving `vim.inspect_pos()` output and resolved definitions of candidate highlight groups. Candidate definitions are not final rendered styles: highlight priority, combinations, diagnostics, and overlays can change the result. The collector deliberately leaves `effective` empty. It does not start parsers or language servers or change the editor configuration. See [Neovim inspection APIs](<https://neovim.io/doc/user/lua/#vim.inspect_pos()>).

## Effective styles and Zed

Record the actual displayed foreground/background and emphasis from the editor inspector in an observation's `effective` object:

```json
{
  "foreground": "#5c8388",
  "background": "#e1e1de",
  "bold": true,
  "italic": false,
  "underline": false,
  "strikethrough": false
}
```

All six fields are required for a comparison. Keep inspector evidence in an extra `evidence` field, and preserve the collector's raw classifications. Use a position within the probe consistently and compare an unselected, unfocused token without diagnostic overlays. A probe is a point observation, not a claim about every character in the token.

For Zed, use **dev: open highlights tree view** to inspect captures and semantic mappings. There is no automatic Zed collector here. To compare a manually inspected Zed run, copy a report for the same fixture, set `editor` to `zed`, record its version and theme name, clear inherited classifications and collection metadata, and enter its own classifications/evidence/effective styles. Never relabel another editor's evidence as Zed's. See [Zed semantic tokens](https://zed.dev/docs/semantic-tokens).

This tool does not infer semantic equivalence from token names, change adapter mappings, or guarantee identical rendering across editor versions. Classification evidence and displayed-style evidence remain separate.
