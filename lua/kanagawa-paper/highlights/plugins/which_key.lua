local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		WhichKey = { fg = theme.ui.picker },
		WhichKeyBorder = { bg = theme.ui.float.bg, fg = theme.ui.float.fg_border },
		WhichKeyIcon = { link = "Label" },
		WhichKeyTitle = vim.tbl_extend("force", { bg = theme.ui.picker, fg = theme.ui.fg_reverse }, styles.title),
	}
end

return M
