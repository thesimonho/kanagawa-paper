local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		OctoDetailsLabel = vim.tbl_extend("force", { fg = theme.syn.statement }, styles.detailLabel),
		OctoDetailsValue = { link = "@variable.member" },
		OctoDirty = vim.tbl_extend("force", { fg = theme.syn.parameter }, styles.changedItem),
		OctoIssueTitle = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.title),
		OctoStateChangesRequested = { link = "DiagnosticVirtualTextWarn" },
		OctoStateClosed = { link = "DiagnosticVirtualTextError" },
		OctoStateOpen = { link = "DiagnosticVirtualTextHint" },
		OctoStatePending = { link = "DiagnosticVirtualTextWarn" },
		OctoStatusColumn = { fg = theme.syn.number },
		OctoPullAdditions = { bg = theme.diff.add_light },
		OctoPullDeletions = { bg = theme.diff.delete_light },
		OctoPullModifications = { bg = theme.diff.change_light },
	}
end

return M
