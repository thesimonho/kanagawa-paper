import type { Theme } from "../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------
[colors-dark]
background = ${theme.ui.surface.editor.background}
foreground = ${theme.ui.text.primary}
selection-background = ${theme.ui.selection.background}
selection-foreground = ${theme.ui.text.secondary}
urls = ${theme.accents.special.two}

cursor = ${theme.modes.insert} ${theme.modes.normal}

search-box-no-match = ${theme.terminal.bright.black} ${theme.terminal.bright.red}
search-box-match = ${theme.terminal.bright.blue} ${theme.terminal.bright.black}

jump-labels = ${theme.modes.normal} ${theme.terminal.bright.yellow}

# Normal colors
regular0 = ${theme.terminal.normal.black}
regular1 = ${theme.terminal.normal.red}
regular2 = ${theme.terminal.normal.green}
regular3 = ${theme.terminal.normal.yellow}
regular4 = ${theme.terminal.normal.blue}
regular5 = ${theme.terminal.normal.magenta}
regular6 = ${theme.terminal.normal.cyan}
regular7 = ${theme.terminal.normal.white}

# Bright colors
bright0 = ${theme.terminal.bright.black}
bright1 = ${theme.terminal.bright.red}
bright2 = ${theme.terminal.bright.green}
bright3 = ${theme.terminal.bright.yellow}
bright4 = ${theme.terminal.bright.blue}
bright5 = ${theme.terminal.bright.magenta}
bright6 = ${theme.terminal.bright.cyan}
bright7 = ${theme.terminal.bright.white}

# Extended colors
16 = ${theme.terminal.indexed[16]}
17 = ${theme.terminal.indexed[17]}
`.replace(/#([0-9a-f]{6})/gi, "$1"),
  };
}
