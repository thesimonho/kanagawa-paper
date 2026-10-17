local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		IndentBlanklineChar = { fg = theme.ui.indent },
		IndentBlanklineSpaceChar = { fg = theme.ui.indent },
		IndentBlanklineSpaceCharBlankline = { fg = theme.ui.indent },
		IndentBlanklineContextChar = { fg = theme.ui.indent_scope },
		IndentBlanklineContextStart = vim.tbl_extend("force", { sp = theme.ui.indent_scope }, styles.indentContext),
		IblIndent = { fg = theme.ui.indent },
		IblWhitespace = { fg = theme.ui.indent },
		IblScope = { fg = theme.ui.indent_scope },
	}
end

return M
