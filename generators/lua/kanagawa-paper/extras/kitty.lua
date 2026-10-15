local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local kitty = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------

background ${ui.bg}
foreground ${ui.fg}
selection_background ${ui.bg_visual}
selection_foreground ${ui.fg_dim}
url_color ${syn.special3}
cursor ${modes.normal}
cursor_text_color ${ui.bg}

# Tabs
active_tab_background ${ui.tabline.bg_selected}
active_tab_foreground ${modes.normal}
inactive_tab_background ${ui.bg_statusline}
inactive_tab_foreground ${ui.fg_dim}
tab_bar_background ${ui.bg_statusline}

# normal
color0 ${term.black}
color1 ${term.red}
color2 ${term.green}
color3 ${term.yellow}
color4 ${term.blue}
color5 ${term.magenta}
color6 ${term.cyan}
color7 ${term.white}

# bright
color8  ${term.black_bright}
color9  ${term.red_bright}
color10 ${term.green_bright}
color11 ${term.yellow_bright}
color12 ${term.blue_bright}
color13 ${term.magenta_bright}
color14 ${term.cyan_bright}
color15 ${term.white_bright}

# extended colors
color16 ${term.indexed1}
color17 ${term.indexed2}
]],
		colors
	)
	return kitty
end

return M
