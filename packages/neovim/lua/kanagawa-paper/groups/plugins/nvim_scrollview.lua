local color = require("kanagawa-paper.lib.color")
local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		ScrollView = { bg = theme.ui.scrollbar },
		ScrollViewHover = { bg = color(theme.ui.scrollbar):brighten(0.1):to_hex() },

		ScrollViewCursor = { fg = theme.ui.fg },
		ScrollViewMarks = { fg = theme.ui.mark },
		ScrollViewFolds = { fg = theme.ui.nontext },
		ScrollViewSearch = { fg = theme.ui.bg_search, bold = true },

		ScrollViewConflictsTop = { fg = theme.diff.conflict_ours, bold = true },
		ScrollViewConflictsMiddle = { fg = theme.diff.conflict_ancestor, bold = true },
		ScrollViewConflictsBottom = { fg = theme.diff.conflict_theirs, bold = true },

		ScrollViewKeywordsFix = { link = "DiagnosticSignError" },
		ScrollViewKeywordsHack = { link = "DiagnosticSignWarn" },
		ScrollViewKeywordsTodo = { link = "DiagnosticSignInfo" },
		ScrollViewKeywordsWarn = { link = "DiagnosticSignWarn" },
		ScrollViewKeywordsXxx = { link = "DiagnosticSignHint" },
	}
end

return M
