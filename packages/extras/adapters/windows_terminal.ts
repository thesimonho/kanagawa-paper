import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `// -----------------------------------------------------------------------------
// ${meta.styleName}
// Upstream: ${meta.upstreamUrl}
// URL: ${meta.url}
// -----------------------------------------------------------------------------
{
  "name": "${meta.styleName}",
  "cursorColor": "${theme.modes.normal}",
  "selectionBackground": "${theme.ui.selection.background}",
  "background": "${theme.ui.surface.editor.background}",
  "foreground": "${theme.ui.text.primary}",
  "black": "${theme.terminal.normal.black}",
  "blue": "${theme.terminal.normal.blue}",
  "green": "${theme.terminal.normal.green}",
  "purple": "${theme.terminal.normal.magenta}",
  "red": "${theme.terminal.normal.red}",
  "white": "${theme.terminal.normal.white}",
  "yellow": "${theme.terminal.normal.yellow}",
  "cyan": "${theme.terminal.normal.cyan}",
  "brightBlack": "${theme.terminal.bright.black}",
  "brightBlue": "${theme.terminal.bright.blue}",
  "brightGreen": "${theme.terminal.bright.green}",
  "brightPurple": "${theme.terminal.bright.magenta}",
  "brightRed": "${theme.terminal.bright.red}",
  "brightWhite": "${theme.terminal.bright.white}",
  "brightYellow": "${theme.terminal.bright.yellow}",
  "brightCyan": "${theme.terminal.bright.cyan}",
}
`,
  };
}
