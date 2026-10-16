local M = {}

---@param colors KanagawaColors
---@param opts KanagawaConfig
function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		LeapBackdrop = { fg = theme.syn.comment },
		LeapMatch = { link = "Search" },
		LeapLabel = vim.tbl_extend("force", { fg = theme.ui.picker }, styles.jumpLabel),
	}
end

return M
