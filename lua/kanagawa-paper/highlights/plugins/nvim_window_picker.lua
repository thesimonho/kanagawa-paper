local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		WindowPickerStatusLine = { fg = theme.ui.picker },
		WindowPickerStatusLineNC = { link = "WindowPickerStatusLine" },
		WindowPickerWinBar = { link = "WindowPickerStatusLine" },
		WindowPickerWinBarNC = { link = "WindowPickerStatusLine" },
	}
end

return M
