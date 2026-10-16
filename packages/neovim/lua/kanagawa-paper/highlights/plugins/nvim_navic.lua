local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		NavicIconsFile = { link = "Directory" },
		NavicIconsModule = { link = "@module" },
		NavicIconsNamespace = { link = "@lsp.type.namespace" },
		NavicIconsPackage = { link = "@module" },
		NavicIconsClass = { link = "Type" },
		NavicIconsMethod = { link = "@function.method" },
		NavicIconsProperty = { link = "@property" },
		NavicIconsField = { link = "@variable.member" },
		NavicIconsConstructor = { link = "@constructor" },
		NavicIconsEnum = { link = "Type" },
		NavicIconsInterface = { link = "Type" },
		NavicIconsFunction = { link = "Function" },
		NavicIconsVariable = { link = "@variable" },
		NavicIconsConstant = { link = "Constant" },
		NavicIconsString = { link = "String" },
		NavicIconsNumber = { link = "Number" },
		NavicIconsBoolean = { link = "Boolean" },
		NavicIconsArray = { link = "Type" },
		NavicIconsObject = { link = "Type" },
		NavicIconsKey = { link = "Identifier" },
		NavicIconsNull = { link = "Type" },
		NavicIconsEnumMember = { link = "Constant" },
		NavicIconsStruct = { link = "Structure" },
		NavicIconsEvent = { link = "Structure" },
		NavicIconsOperator = { link = "Operator" },
		NavicIconsTypeParameter = { link = "Type" },
		NavicText = { fg = theme.ui.fg },
		NavicSeparator = { fg = theme.ui.win_separator },
	}
end

return M
