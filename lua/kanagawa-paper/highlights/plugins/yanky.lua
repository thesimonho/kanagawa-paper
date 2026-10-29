local color = require("kanagawa-paper.lib.color")
local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		YankyYanked = { bg = theme.ui.yank },
		YankyPut = { bg = color(theme.modes.insert):brighten(0.1):to_hex(), fg = theme.ui.fg_reverse },
	}
end

return M
