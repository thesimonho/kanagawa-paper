---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: "packages/vscode/**"
---

# VS Code adapter

`adapter.ts` maps the shared theme into VS Code UI, TextMate, and semantic token colors. `build.ts` validates and writes the installable extension under `dist/vscode`. `package.json` preserves publisher, extension identity, and version. Node dependencies belong to the repository root.

Open the root workspace and press F5 to run the background watch task and launch the assembled extension. After a successful rebuild, reload the Extension Development Host to refresh the theme. Never edit `dist/vscode` directly.
