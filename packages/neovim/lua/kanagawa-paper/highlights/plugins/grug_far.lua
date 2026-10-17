local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		GrugFarHelpHeader = { fg = theme.ui.header1 },
		GrugFarHelpHeaderKey = { fg = theme.ui.picker },
		GrugFarHelpWinHeader = { fg = theme.ui.header2 },
		GrugFarHelpWinActionPrefix = { link = "GrugFarHelpWinHeader" },
		GrugFarHelpWinActionText = { link = "GrugFarHelpHeader" },
		GrugFarHelpWinActionKey = { fg = theme.ui.picker },
		GrugFarHelpWinActionDescription = { link = "NormalFloat" },

		GrugFarInputLabel = { link = "Identifier" },
		GrugFarInputPlaceholder = { link = "Comment" },

		GrugFarResultsHeader = { fg = theme.ui.fg_dim },
		GrugFarResultsStats = { link = "Comment" },
		GrugFarResultsActionMessage = { link = "ModeMsg" },

		GrugFarResultsMatch = { link = "Substitute" },
		GrugFarResultsPath = { link = "@string.special.path" },
		GrugFarResultsLineNo = { link = "LineNr" },
		GrugFarResultsLineColumn = { link = "LineNr" },
		GrugFarResultsChangeIndicator = { link = "@diff.delta" },
		GrugFarResultsRgCmdHeader = { link = "@markup.link.url" },
	}
end

return M
