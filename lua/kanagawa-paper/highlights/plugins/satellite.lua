local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		SatelliteBar = { bg = theme.ui.scrollbar },
		SatelliteCursor = { fg = theme.ui.fg },
		SatelliteMark = { fg = theme.ui.mark },
	}
end

return M
