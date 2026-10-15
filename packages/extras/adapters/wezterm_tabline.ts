import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `-----------------------------------------------------------------------------
--- ${meta.styleName}
--- Upstream: ${meta.upstreamUrl}
--- URL: ${meta.url}
-----------------------------------------------------------------------------

local M = {}

M = {
  normal_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.modes.normal}" },
    b = { fg = "${theme.modes.normal}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  copy_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.modes.insert}" },
    b = { fg = "${theme.modes.insert}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  search_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.modes.visual}" },
    b = { fg = "${theme.modes.visual}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  window_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.accents.primary}" },
    b = { fg = "${theme.accents.primary}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  resize_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.accents.secondary}" },
    b = { fg = "${theme.accents.secondary}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  tab_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.accents.tertiary}" },
    b = { fg = "${theme.accents.tertiary}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  default_mode = {
    a = { fg = "${theme.ui.surface.tones.p2}", bg = "${theme.accents.attention}" },
    b = { fg = "${theme.accents.attention}", bg = "${theme.ui.surface.tones.p2}" },
    c = { fg = "${theme.ui.text.secondary}", bg = "${theme.ui.statusline.background}" },
  },
  tab = {
    active = { fg = '${theme.modes.normal}', bg = '${theme.ui.tabs.selected.background}', bold = true },
    inactive = { fg = '${theme.ui.text.secondary}', bg = '${theme.ui.statusline.background}' },
    inactive_hover = { fg = '${theme.ui.tabs.alternate.foreground}', bg = '${theme.ui.tabs.selected.background}' },
  },
  ansi = {
    "${theme.terminal.normal.black}",
    "${theme.terminal.normal.red}",
    "${theme.terminal.normal.green}",
    "${theme.terminal.normal.yellow}",
    "${theme.terminal.normal.blue}",
    "${theme.terminal.normal.magenta}",
    "${theme.terminal.normal.cyan}",
    "${theme.terminal.normal.white}",
  },
  brights = {
    "${theme.terminal.bright.black}",
    "${theme.terminal.bright.red}",
    "${theme.terminal.bright.green}",
    "${theme.terminal.bright.yellow}",
    "${theme.terminal.bright.blue}",
    "${theme.terminal.bright.magenta}",
    "${theme.terminal.bright.cyan}",
    "${theme.terminal.bright.white}",
  },
}

return M
`,
  };
}
