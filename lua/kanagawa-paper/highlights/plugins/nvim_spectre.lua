local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		SpectreFaint = vim.tbl_extend("force", { fg = theme.ui.fg_dim }, styles.faint),
	}
end

return M
