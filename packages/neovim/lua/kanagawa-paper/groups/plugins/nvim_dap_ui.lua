local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		DapUIScope = { link = "Special" },
		DapUIType = { link = "Type" },
		DapUIModifiedValue = { fg = theme.vcs.changed, bold = true },
		DapUIDecoration = { fg = theme.ui.float.fg_border },
		DapUIThread = { fg = theme.syn.identifier },
		DapUIStoppedThread = { fg = theme.syn.special1 },
		DapUISource = { fg = theme.syn.special2 },
		DapUILineNumber = { fg = theme.ui.line_numbers.default },
		DapUIFloatBorder = { fg = theme.ui.float.fg_border },
		DapUIWatchesEmpty = { fg = theme.diag.warning },
		DapUIWatchesValue = { fg = theme.syn.identifier },
		DapUIWatchesError = { fg = theme.diag.error },
		DapUIBreakpointsPath = { link = "Directory" },
		DapUIBreakpointsInfo = { fg = theme.diag.info },
		DapUIBreakpointsWarn = { fg = theme.diag.warning },
		DapUIBreakpointsCurrentLine = { fg = theme.diag.error, bold = true },
		DapUIBreakpointsDisabledLine = { link = "Comment" },
		DapUIStepOver = { fg = theme.syn.special1 },
		DapUIStepInto = { fg = theme.syn.special1 },
		DapUIStepBack = { fg = theme.syn.special1 },
		DapUIStepOut = { fg = theme.syn.special1 },
		DapUIStop = { fg = theme.syn.special2 },
		DapUIPlayPause = { fg = theme.syn.string },
		DapUIRestart = { fg = theme.syn.string },
		DapUIUnavailable = { fg = theme.syn.comment },
	}
end

return M
