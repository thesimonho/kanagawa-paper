import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------

[colors]
foreground = "${theme.ui.text.primary}"
background = "${theme.ui.surface.editor.background}"
cursor_bg = "${theme.modes.normal}"
cursor_border = "${theme.modes.normal}"
cursor_fg = "${theme.ui.surface.editor.background}"
selection_bg = "${theme.ui.selection.background}"
selection_fg = "${theme.ui.text.primary}"
split = "${theme.ui.border.separator}"
compose_cursor = "${theme.accents.emphasis}"
scrollbar_thumb = "${theme.ui.scrollbar.thumb}"

ansi = [
  "${theme.terminal.normal.black}",
  "${theme.terminal.normal.red}",
  "${theme.terminal.normal.green}",
  "${theme.terminal.normal.yellow}",
  "${theme.terminal.normal.blue}",
  "${theme.terminal.normal.magenta}",
  "${theme.terminal.normal.cyan}",
  "${theme.terminal.normal.white}",
]
brights = [
  "${theme.terminal.bright.black}",
  "${theme.terminal.bright.red}",
  "${theme.terminal.bright.green}",
  "${theme.terminal.bright.yellow}",
  "${theme.terminal.bright.blue}",
  "${theme.terminal.bright.magenta}",
  "${theme.terminal.bright.cyan}",
  "${theme.terminal.bright.white}",
]

[colors.indexed]
16 = "${theme.terminal.indexed[16]}"
17 = "${theme.terminal.indexed[17]}"

[colors.tab_bar]
background = "${theme.ui.statusline.background}"
inactive_tab_edge = "${theme.ui.tabs.indicator}"

[colors.tab_bar.active_tab]
fg_color = "${theme.modes.normal}"
bg_color = "${theme.ui.tabs.selected.background}"
intensity = "Bold"

[colors.tab_bar.inactive_tab]
fg_color = "${theme.ui.text.secondary}"
bg_color = "${theme.ui.statusline.background}"

[colors.tab_bar.inactive_tab_hover]
fg_color = "${theme.ui.tabs.alternate.foreground}"
bg_color = "${theme.ui.tabs.selected.background}"

[colors.tab_bar.new_tab]
fg_color = "${theme.ui.text.secondary}"
bg_color = "${theme.ui.statusline.background}"

[colors.tab_bar.new_tab_hover]
fg_color = "${theme.ui.tabs.alternate.foreground}"
bg_color = "${theme.ui.tabs.selected.background}"
intensity = "Bold"

[metadata]
name = "${meta.name}"
author = "Simon Ho"
origin_url = "${meta.upstreamUrl}"
`,
  };
}
