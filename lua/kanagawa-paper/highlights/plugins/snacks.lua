local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		SnacksIndent = { fg = theme.ui.indent },
		SnacksIndentScope = { fg = theme.ui.indent_scope },
		SnacksIndentChunk = { fg = theme.ui.indent_scope },
		SnacksPickerInputCursorLine = { bg = theme.ui.float.bg },
		SnacksPickerCursorLine = { link = "CursorLineAlt" },
		SnacksPickerListCursorLine = { link = "CursorLineAlt" },
		SnacksPickerPreviewCursorLine = { link = "CursorLineAlt" },
		SnacksPickerMatch = { link = "Search" },
	}
end

return M
