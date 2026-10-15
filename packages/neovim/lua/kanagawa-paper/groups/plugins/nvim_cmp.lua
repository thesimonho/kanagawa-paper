local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		CmpCompletion = { link = "Pmenu" },
		CmpCompletionSel = { link = "PmenuSel" },
		CmpCompletionBorder = { fg = theme.ui.pmenu.fg_border, bg = theme.ui.pmenu.bg_border },
		CmpCompletionThumb = { bg = theme.ui.pmenu.bg_thumb },
		CmpCompletionSbar = { bg = theme.ui.fg },
		CmpDocumentation = { link = "NormalFloat" },
		CmpDocumentationBorder = { link = "FloatBorder" },
		CmpItemAbbr = { fg = theme.ui.pmenu.fg },
		CmpItemAbbrDeprecated = { fg = theme.syn.comment, strikethrough = true },
		CmpItemAbbrMatch = { fg = theme.syn.fun },
		CmpItemAbbrMatchFuzzy = { link = "CmpItemAbbrMatch" },
		CmpItemMenu = { fg = theme.ui.fg_dimmer },
		CmpGhostText = { fg = theme.syn.comment },

		CmpItemKindDefault = { fg = theme.ui.fg_dimmer },
		CmpItemKindText = { fg = theme.ui.fg },
		CmpItemKindMethod = { link = "@function.method" },
		CmpItemKindFunction = { link = "Function" },
		CmpItemKindConstructor = { link = "@constructor" },
		CmpItemKindField = { link = "@variable.member" },
		CmpItemKindVariable = { link = "@variable" },
		CmpItemKindClass = { link = "Type" },
		CmpItemKindInterface = { link = "Type" },
		CmpItemKindModule = { link = "@module" },
		CmpItemKindProperty = { link = "@property" },
		CmpItemKindUnit = { link = "Number" },
		CmpItemKindValue = { link = "String" },
		CmpItemKindEnum = { link = "Type" },
		CmpItemKindKeyword = { link = "Keyword" },
		CmpItemKindSnippet = { link = "Special" },
		CmpItemKindColor = { link = "Special" },
		CmpItemKindFile = { link = "Directory" },
		CmpItemKindReference = { link = "Special" },
		CmpItemKindFolder = { link = "Directory" },
		CmpItemKindEnumMember = { link = "Constant" },
		CmpItemKindConstant = { link = "Constant" },
		CmpItemKindStruct = { link = "Type" },
		CmpItemKindEvent = { link = "Type" },
		CmpItemKindOperator = { link = "Operator" },
		CmpItemKindTypeParameter = { link = "Type" },
		CmpItemKindCopilot = { link = "String" },
	}
end

return M
