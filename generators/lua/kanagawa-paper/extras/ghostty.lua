local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local ghostty = util.template(
		[[
palette = 0=${term.black}
palette = 1=${term.red}
palette = 2=${term.green}
palette = 3=${term.yellow}
palette = 4=${term.blue}
palette = 5=${term.magenta}
palette = 6=${term.cyan}
palette = 7=${term.white}
palette = 8=${term.black_bright}
palette = 9=${term.red_bright}
palette = 10=${term.green_bright}
palette = 11=${term.yellow_bright}
palette = 12=${term.blue_bright}
palette = 13=${term.magenta_bright}
palette = 14=${term.cyan_bright}
palette = 15=${term.white_bright}

background = ${ui.bg}
foreground = ${ui.fg}
cursor-color = ${modes.normal}
selection-background = ${ui.bg_visual}
selection-foreground = ${ui.fg_dim}
split-divider-color = ${ui.win_separator}
]],
		colors
	)
	return ghostty
end

return M
