local M = {}
---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme
	return {
		LspReferenceText = vim.tbl_extend("force", { bg = "none" }, styles.reference),
		LspReferenceRead = vim.tbl_extend("force", { bg = theme.ui.bg_visual }, styles.reference),
		LspReferenceWrite = vim.tbl_extend("force", { bg = theme.ui.bg_visual }, styles.reference),
		LspInlayHint = vim.tbl_extend("force", { fg = theme.ui.fg_dim, bg = theme.accent.invert }, styles.inlayHint),
		LspSignatureActiveParameter = vim.tbl_extend("force", { fg = theme.modes.insert }, styles.signatureParameter),
		LspCodeLens = vim.tbl_extend("force", { fg = theme.syn.comment, bg = "None" }, styles.codeLens),
	}
end

return M
