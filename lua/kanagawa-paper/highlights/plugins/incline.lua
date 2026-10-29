local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		InclineNormal = { bg = theme.ui.fg, fg = theme.ui.bg_dim },
		InclineNormalNC = { bg = theme.ui.bg_p2, fg = theme.ui.fg },
	}
end

return M
