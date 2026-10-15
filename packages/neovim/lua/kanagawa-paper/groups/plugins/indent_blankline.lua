local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		IndentBlanklineChar = { fg = theme.ui.indent },
		IndentBlanklineSpaceChar = { fg = theme.ui.indent },
		IndentBlanklineSpaceCharBlankline = { fg = theme.ui.indent },
		IndentBlanklineContextChar = { fg = theme.ui.indent_scope },
		IndentBlanklineContextStart = { sp = theme.ui.indent_scope, underline = true },
		IblIndent = { fg = theme.ui.indent },
		IblWhitespace = { fg = theme.ui.indent },
		IblScope = { fg = theme.ui.indent_scope },
	}
end

return M
