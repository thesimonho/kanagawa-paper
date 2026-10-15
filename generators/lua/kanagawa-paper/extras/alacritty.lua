local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local alacritty = util.template(
		[=[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------

[colors.primary]
background = '${ui.bg}'
foreground = '${ui.fg}'

[colors.cursor]
cursor = '${modes.normal}'
text = '${ui.bg}'

[colors.selection]
background = '${ui.bg_visual}'
foreground = '${ui.fg_dim}'

[colors.normal]
black = '${term.black}'
red = '${term.red}'
green = '${term.green}'
yellow = '${term.yellow}'
blue = '${term.blue}'
magenta = '${term.magenta}'
cyan = '${term.cyan}'
white = '${term.white}'

[colors.bright]
black = '${term.black_bright}'
red = '${term.red_bright}'
green = '${term.green_bright}'
yellow = '${term.yellow_bright}'
blue = '${term.blue_bright}'
magenta = '${term.magenta_bright}'
cyan = '${term.cyan_bright}'
white = '${term.white_bright}'

[[colors.indexed_colors]]
index = 16
color = '${term.indexed1}'

[[colors.indexed_colors]]
index = 17
color = '${term.indexed2}'
]=],
		colors
	)
	return alacritty
end

return M
