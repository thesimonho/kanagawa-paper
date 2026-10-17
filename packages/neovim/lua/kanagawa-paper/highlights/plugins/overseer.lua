local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		OverseerPENDING = { fg = theme.diag.hint },
		OverseerRUNNING = { fg = theme.diag.info },
		OverseerSUCCESS = { fg = theme.diag.ok },
		OverseerCANCELED = { fg = theme.diag.warning },
		OverseerFAILURE = { fg = theme.diag.error },
		OverseerTaskBorder = { fg = theme.ui.win_separator },
	}
end

return M
