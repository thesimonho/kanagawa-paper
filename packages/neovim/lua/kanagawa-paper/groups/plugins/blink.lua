local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		BlinkCmpMenu = { link = "Pmenu" },
		BlinkCmpMenuBorder = { fg = theme.ui.pmenu.fg_border, bg = theme.ui.pmenu.bg_border },
		BlinkCmpMenuSelection = { link = "PmenuSel" },
		BlinkCmpScrollBarThumb = { bg = theme.ui.pmenu.bg_thumb },
		BlinkCmpScrollBarGutter = { bg = theme.ui.pmenu.bg_sbar },
		BlinkCmpLabel = { fg = theme.ui.pmenu.fg },
		BlinkCmpLabelMatch = { fg = theme.syn.fun },
		BlinkCmpLabelDetail = { link = "NonText" },
		BlinkCmpLabelDescription = { link = "NonText" },
		BlinkCmpLabelDeprecated = vim.tbl_extend("force", { fg = theme.syn.comment }, styles.deprecated),
		BlinkCmpSource = { link = "String" },
		BlinkCmpGhostText = { fg = theme.syn.comment },
		BlinkCmpDoc = { link = "NormalFloat" },
		BlinkCmpDocBorder = { link = "FloatBorder" },
		BlinkCmpDocSeparator = { fg = theme.ui.win_separator },
		BlinkCmpDocCursorLine = { link = "CursorLine" },
		BlinkCmpSignatureHelp = { link = "NormalFloat" },
		BlinkCmpSignatureHelpBorder = { link = "FloatBorder" },
		BlinkCmpSignatureHelpActiveParameter = { link = "LspSignatureActiveParameter" },

		BlinkCmpKind = { fg = theme.accent.accent4 },
		BlinkCmpKindText = { fg = theme.ui.fg },
		BlinkCmpKindMethod = { link = "@function.method" },
		BlinkCmpKindFunction = { link = "Function" },
		BlinkCmpKindConstructor = { link = "@constructor" },
		BlinkCmpKindField = { link = "@variable.member" },
		BlinkCmpKindVariable = { link = "@variable" },
		BlinkCmpKindClass = { link = "Type" },
		BlinkCmpKindInterface = { link = "Type" },
		BlinkCmpKindModule = { link = "@module" },
		BlinkCmpKindProperty = { link = "@property" },
		BlinkCmpKindUnit = { link = "Number" },
		BlinkCmpKindValue = { link = "String" },
		BlinkCmpKindEnum = { link = "Type" },
		BlinkCmpKindKeyword = { link = "Keyword" },
		BlinkCmpKindSnippet = { link = "Special" },
		BlinkCmpKindColor = { link = "Special" },
		BlinkCmpKindFile = { link = "Directory" },
		BlinkCmpKindReference = { link = "Special" },
		BlinkCmpKindFolder = { link = "Directory" },
		BlinkCmpKindEnumMember = { link = "Constant" },
		BlinkCmpKindConstant = { link = "Constant" },
		BlinkCmpKindStruct = { link = "Type" },
		BlinkCmpKindEvent = { link = "Type" },
		BlinkCmpKindOperator = { link = "Operator" },
		BlinkCmpKindTypeParameter = { link = "Type" },
		BlinkCmpKindCopilot = { link = "String" },
	}
end

return M
