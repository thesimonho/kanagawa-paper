local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		NeotestAdapterName = { fg = theme.syn.special3 },
		NeotestDir = { fg = theme.syn.fun },
		NeotestExpandMarker = vim.tbl_extend("force", { fg = theme.syn.punct }, styles.testStructure),
		NeotestFailed = { fg = theme.diag.error },
		NeotestFile = { fg = theme.syn.fun },
		NeotestFocused = vim.tbl_extend("force", {}, styles.testFocused),
		NeotestIndent = vim.tbl_extend("force", { fg = theme.ui.indent }, styles.testStructure),
		NeotestMarked = vim.tbl_extend("force", { fg = theme.diag.warning }, styles.testMarked),
		NeotestNamespace = { fg = theme.syn.fun },
		NeotestPassed = { fg = theme.diag.ok },
		NeotestRunning = { fg = theme.vcs.changed },
		NeotestWinSelect = { fg = theme.ui.picker },
		NeotestSkipped = { fg = theme.syn.special1 },
		NeotestTarget = { fg = theme.syn.special3 },
		NeotestTest = { fg = theme.ui.float.fg },
		NeotestUnknown = { fg = theme.syn.deprecated },
		NeotestWatching = { fg = theme.vcs.changed },
	}
end

return M
