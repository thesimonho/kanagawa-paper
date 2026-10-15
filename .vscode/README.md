---
agent:
  instruction: Keep the theme preview launch pointed at assembled output and build it before launch.
  on-change: ".vscode/**"
---

# VS Code theme preview

Open the repository root in VS Code. Press F5 and select **Preview Kanagawa Paper**. The build task runs the common assembler for VS Code, then the launch configuration opens an Extension Development Host with `dist/vscode` loaded.

In the development window, run **Preferences: Color Theme** and select **Kanagawa Paper Ink** or **Kanagawa Paper Canvas**. After source changes, stop and restart debugging to rebuild. Python 3 and Neovim must be available on VS Code's PATH.

Edit `shared/` or `packages/vscode/mappings/`; do not edit `dist/vscode`. These launch and task configurations are maintained by hand.
