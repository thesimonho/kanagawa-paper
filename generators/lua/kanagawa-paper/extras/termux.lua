local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local termux = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------
background: ${ui.bg}
foreground: ${ui.fg}

# Normal colors
color0:  ${term.black}
color1:  ${term.red}
color2:  ${term.green}
color3:  ${term.yellow}
color4:  ${term.blue}
color5:  ${term.magenta}
color6:  ${term.cyan}
color7:  ${term.white}

# Bright colors
color8:  ${term.black_bright}
color9:  ${term.red_bright}
color10: ${term.green_bright}
color11: ${term.yellow_bright}
color12: ${term.blue_bright}
color13: ${term.magenta_bright}
color14: ${term.cyan_bright}
color15: ${term.white_bright}

# Extended colors
color16: ${term.indexed1}
color17: ${term.indexed2}
]],
		colors
	)
	return termux
end

return M
