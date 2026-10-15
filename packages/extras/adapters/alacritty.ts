import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------

[colors.primary]
background = '${theme.ui.surface.editor.background}'
foreground = '${theme.ui.text.primary}'

[colors.cursor]
cursor = '${theme.modes.normal}'
text = '${theme.ui.surface.editor.background}'

[colors.selection]
background = '${theme.ui.selection.background}'
foreground = '${theme.ui.text.secondary}'

[colors.normal]
black = '${theme.terminal.normal.black}'
red = '${theme.terminal.normal.red}'
green = '${theme.terminal.normal.green}'
yellow = '${theme.terminal.normal.yellow}'
blue = '${theme.terminal.normal.blue}'
magenta = '${theme.terminal.normal.magenta}'
cyan = '${theme.terminal.normal.cyan}'
white = '${theme.terminal.normal.white}'

[colors.bright]
black = '${theme.terminal.bright.black}'
red = '${theme.terminal.bright.red}'
green = '${theme.terminal.bright.green}'
yellow = '${theme.terminal.bright.yellow}'
blue = '${theme.terminal.bright.blue}'
magenta = '${theme.terminal.bright.magenta}'
cyan = '${theme.terminal.bright.cyan}'
white = '${theme.terminal.bright.white}'

[[colors.indexed_colors]]
index = 16
color = '${theme.terminal.indexed[16]}'

[[colors.indexed_colors]]
index = 17
color = '${theme.terminal.indexed[17]}'
`,
  };
}
