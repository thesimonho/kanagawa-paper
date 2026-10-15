import type { Theme } from "../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `// -----------------------------------------------------------------------------
// ${meta.styleName}
// Upstream: ${meta.upstreamUrl}
// URL: ${meta.url}
// -----------------------------------------------------------------------------
{
  "terminal.background": "${theme.ui.surface.editor.background}",
  "terminal.foreground": "${theme.ui.text.primary}",
  "terminalCursor.background": "${theme.modes.normal}",
  "terminalCursor.foreground": "${theme.ui.surface.editor.background}",
  "terminal.ansiBlack": "${theme.terminal.normal.black}",
  "terminal.ansiBlue": "${theme.terminal.normal.blue}",
  "terminal.ansiCyan": "${theme.terminal.normal.cyan}",
  "terminal.ansiGreen": "${theme.terminal.normal.green}",
  "terminal.ansiMagenta": "${theme.terminal.normal.magenta}",
  "terminal.ansiRed": "${theme.terminal.normal.red}",
  "terminal.ansiWhite": "${theme.terminal.normal.white}",
  "terminal.ansiYellow": "${theme.terminal.normal.yellow}",
  "terminal.ansiBrightBlack": "${theme.terminal.bright.black}",
  "terminal.ansiBrightBlue": "${theme.terminal.bright.blue}",
  "terminal.ansiBrightCyan": "${theme.terminal.bright.cyan}",
  "terminal.ansiBrightGreen": "${theme.terminal.bright.green}",
  "terminal.ansiBrightMagenta": "${theme.terminal.bright.magenta}",
  "terminal.ansiBrightRed": "${theme.terminal.bright.red}",
  "terminal.ansiBrightWhite": "${theme.terminal.bright.white}",
  "terminal.ansiBrightYellow": "${theme.terminal.bright.yellow}"
}
`,
  };
}
