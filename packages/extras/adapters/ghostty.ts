import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `palette = 0=${theme.terminal.normal.black}
palette = 1=${theme.terminal.normal.red}
palette = 2=${theme.terminal.normal.green}
palette = 3=${theme.terminal.normal.yellow}
palette = 4=${theme.terminal.normal.blue}
palette = 5=${theme.terminal.normal.magenta}
palette = 6=${theme.terminal.normal.cyan}
palette = 7=${theme.terminal.normal.white}
palette = 8=${theme.terminal.bright.black}
palette = 9=${theme.terminal.bright.red}
palette = 10=${theme.terminal.bright.green}
palette = 11=${theme.terminal.bright.yellow}
palette = 12=${theme.terminal.bright.blue}
palette = 13=${theme.terminal.bright.magenta}
palette = 14=${theme.terminal.bright.cyan}
palette = 15=${theme.terminal.bright.white}

background = ${theme.ui.surface.editor.background}
foreground = ${theme.ui.text.primary}
cursor-color = ${theme.modes.normal}
selection-background = ${theme.ui.selection.background}
selection-foreground = ${theme.ui.text.secondary}
split-divider-color = ${theme.ui.border.separator}
`,
  };
}
