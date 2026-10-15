local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		TelescopeTitle = { bg = theme.accent.accent1, bold = true },
		TelescopeBorder = { link = "FloatBorder" },

		TelescopeSelection = { link = "CursorLineAlt" },
		TelescopeSelectionCaret = { link = "CursorLineNr" },

		TelescopePromptNormal = { link = "NormalFloat" },
		TelescopePromptBorder = { link = "FloatBorder" },
		TelescopePromptPrefix = { link = "CursorLineNr" },

		TelescopeResultsNormal = { link = "NormalFloat" },
		TelescopeResultsBorder = { link = "FloatBorder" },
		TelescopeResultsClass = { link = "Structure" },
		TelescopeResultsStruct = { link = "Structure" },
		TelescopeResultsField = { link = "@variable.member" },
		TelescopeResultsMethod = { link = "Function" },
		TelescopeResultsVariable = { link = "@variable" },
		TelescopeResultsTitle = { bg = theme.accent.accent2, bold = true },

		TelescopePreviewTitle = { bg = theme.accent.accent3, bold = true },
		TelescopePreviewNormal = { link = "NormalFloat" },
		TelescopePreviewBorder = { link = "FloatBorder" },
	}
end

return M
