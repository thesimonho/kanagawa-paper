local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local wezterm = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------

[colors]
foreground = "${ui.fg}"
background = "${ui.bg}"
cursor_bg = "${modes.normal}"
cursor_border = "${modes.normal}"
cursor_fg = "${ui.bg}"
selection_bg = "${ui.bg_visual}"
selection_fg = "${ui.fg}"
split = "${ui.win_separator}"
compose_cursor = "${ui.special}"
scrollbar_thumb = "${ui.scrollbar}"

ansi = [
  "${term.black}",
  "${term.red}",
  "${term.green}",
  "${term.yellow}",
  "${term.blue}",
  "${term.magenta}",
  "${term.cyan}",
  "${term.white}",
]
brights = [
  "${term.black_bright}",
  "${term.red_bright}",
  "${term.green_bright}",
  "${term.yellow_bright}",
  "${term.blue_bright}",
  "${term.magenta_bright}",
  "${term.cyan_bright}",
  "${term.white_bright}",
]

[colors.indexed]
16 = "${term.indexed1}"
17 = "${term.indexed2}"

[colors.tab_bar]
background = "${ui.bg_statusline}"
inactive_tab_edge = "${ui.tabline.indicator}"

[colors.tab_bar.active_tab]
fg_color = "${modes.normal}"
bg_color = "${ui.tabline.bg_selected}"
intensity = "Bold"

[colors.tab_bar.inactive_tab]
fg_color = "${ui.fg_dim}"
bg_color = "${ui.bg_statusline}"

[colors.tab_bar.inactive_tab_hover]
fg_color = "${ui.tabline.fg_alternate}"
bg_color = "${ui.tabline.bg_selected}"

[colors.tab_bar.new_tab]
fg_color = "${ui.fg_dim}"
bg_color = "${ui.bg_statusline}"

[colors.tab_bar.new_tab_hover]
fg_color = "${ui.tabline.fg_alternate}"
bg_color = "${ui.tabline.bg_selected}"
intensity = "Bold"

[metadata]
name = "${_name}"
author = "Simon Ho"
origin_url = "${_upstream_url}"
]],
		colors
	)
	return wezterm
end

return M
