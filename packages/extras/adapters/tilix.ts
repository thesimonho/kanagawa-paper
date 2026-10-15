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
  "comment": "",
  "use-theme-colors": false,
  "foreground-color": "${theme.ui.text.primary}",
  "background-color": "${theme.ui.surface.editor.background}",
  "palette": [
      "${theme.terminal.normal.black}",
      "${theme.terminal.normal.red}",
      "${theme.terminal.normal.green}",
      "${theme.terminal.normal.yellow}",
      "${theme.terminal.normal.blue}",
      "${theme.terminal.normal.magenta}",
      "${theme.terminal.normal.cyan}",
      "${theme.terminal.normal.white}",
      "${theme.terminal.bright.black}",
      "${theme.terminal.bright.red}",
      "${theme.terminal.bright.green}",
      "${theme.terminal.bright.yellow}",
      "${theme.terminal.bright.blue}",
      "${theme.terminal.bright.magenta}",
      "${theme.terminal.bright.cyan}",
      "${theme.terminal.bright.white}"
  ]
}
`,
  };
}
