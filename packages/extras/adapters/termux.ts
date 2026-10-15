import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------
background: ${theme.ui.surface.editor.background}
foreground: ${theme.ui.text.primary}

# Normal colors
color0:  ${theme.terminal.normal.black}
color1:  ${theme.terminal.normal.red}
color2:  ${theme.terminal.normal.green}
color3:  ${theme.terminal.normal.yellow}
color4:  ${theme.terminal.normal.blue}
color5:  ${theme.terminal.normal.magenta}
color6:  ${theme.terminal.normal.cyan}
color7:  ${theme.terminal.normal.white}

# Bright colors
color8:  ${theme.terminal.bright.black}
color9:  ${theme.terminal.bright.red}
color10: ${theme.terminal.bright.green}
color11: ${theme.terminal.bright.yellow}
color12: ${theme.terminal.bright.blue}
color13: ${theme.terminal.bright.magenta}
color14: ${theme.terminal.bright.cyan}
color15: ${theme.terminal.bright.white}

# Extended colors
color16: ${theme.terminal.indexed[16]}
color17: ${theme.terminal.indexed[17]}
`,
  };
}
