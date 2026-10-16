local color = require("kanagawa-paper.lib.color")
local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		ScrollView = { bg = theme.ui.scrollbar },
		ScrollViewHover = { bg = color(theme.ui.scrollbar):brighten(0.1):to_hex() },

		ScrollViewCursor = { fg = theme.ui.fg },
		ScrollViewMarks = { fg = theme.ui.mark },
		ScrollViewFolds = { fg = theme.ui.nontext },
		ScrollViewSearch = vim.tbl_extend("force", { fg = theme.ui.bg_search }, styles.searchMatch),

		ScrollViewConflictsTop = vim.tbl_extend("force", { fg = theme.diff.conflict_ours }, styles.conflictMarker),
		ScrollViewConflictsMiddle = vim.tbl_extend(
			"force",
			{ fg = theme.diff.conflict_ancestor },
			styles.conflictMarker
		),
		ScrollViewConflictsBottom = vim.tbl_extend("force", { fg = theme.diff.conflict_theirs }, styles.conflictMarker),

		ScrollViewKeywordsFix = { link = "DiagnosticSignError" },
		ScrollViewKeywordsHack = { link = "DiagnosticSignWarn" },
		ScrollViewKeywordsTodo = { link = "DiagnosticSignInfo" },
		ScrollViewKeywordsWarn = { link = "DiagnosticSignWarn" },
		ScrollViewKeywordsXxx = { link = "DiagnosticSignHint" },
	}
end

return M
