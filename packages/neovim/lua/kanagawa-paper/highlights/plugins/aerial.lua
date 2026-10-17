local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		AerialFileIcon = { link = "Directory" },
		AerialModuleIcon = { link = "@module" },
		AerialNamespaceIcon = { link = "@lsp.type.namespace" },
		AerialPackageIcon = { link = "@module" },
		AerialClassIcon = { link = "Type" },
		AerialMethodIcon = { link = "@function.method" },
		AerialPropertyIcon = { link = "@property" },
		AerialFieldIcon = { link = "@variable.member" },
		AerialConstructorIcon = { link = "@constructor" },
		AerialEnumIcon = { link = "Type" },
		AerialInterfaceIcon = { link = "Type" },
		AerialFunctionIcon = { link = "Function" },
		AerialVariableIcon = { link = "@variable" },
		AerialConstantIcon = { link = "Constant" },
		AerialStringIcon = { link = "String" },
		AerialNumberIcon = { link = "Number" },
		AerialBooleanIcon = { link = "Boolean" },
		AerialArrayIcon = { link = "Type" },
		AerialObjectIcon = { link = "Type" },
		AerialKeyIcon = { link = "Identifier" },
		AerialNullIcon = { link = "Type" },
		AerialEnumMemberIcon = { link = "Constant" },
		AerialStructIcon = { link = "Structure" },
		AerialEventIcon = { link = "Structure" },
		AerialOperatorIcon = { link = "Operator" },
		AerialTypeParameterIcon = { link = "Type" },
	}
end

return M
