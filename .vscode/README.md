---
agent:
  instruction: Keep these build and source boundaries current when this directory changes.
  on-change: ".vscode/**"
---

# VS Code preview

Open the repository root, install its Node dependencies, then press F5 and select **Preview Kanagawa Paper**. The background task performs an initial build before launching the assembled extension from `dist/vscode`. It rebuilds after shared or VS Code adapter changes.

Edit `shared/` or `packages/vscode/adapter.ts`; do not edit build output. A failed build keeps the previous output and leaves the watch task running. Reload the Extension Development Host after a successful rebuild to refresh the theme.
