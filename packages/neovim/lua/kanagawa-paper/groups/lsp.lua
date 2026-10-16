local M = {}
---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme
	return {
		LspReferenceText = vim.tbl_extend("force", { bg = "none" }, styles.reference),
		LspReferenceRead = vim.tbl_extend("force", { bg = theme.ui.bg_visual }, styles.reference),
		LspReferenceWrite = vim.tbl_extend("force", { bg = theme.ui.bg_visual }, styles.reference),
		LspInlayHint = vim.tbl_extend("force", { fg = theme.ui.fg_dim, bg = theme.accent.invert }, styles.inlayHint),
		LspSignatureActiveParameter = vim.tbl_extend("force", { fg = theme.modes.insert }, styles.signatureParameter),
		LspCodeLens = vim.tbl_extend("force", { fg = theme.syn.comment, bg = "None" }, styles.codeLens),

		-- ["@lsp.type.class"] = { link = "Structure" },
		-- ["@lsp.type.decorator"] = { link = "Function" },
		-- ["@lsp.type.enum"] = { link = "Structure" },
		-- ["@lsp.type.enumMember"] = { link = "Constant" },
		-- ["@lsp.type.interface"] = { link = "Structure" },
		["@lsp.type.function"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functions),
		["@lsp.type.macro"] = { fg = theme.syn.preproc },
		["@lsp.type.method"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functions), -- Function
		["@lsp.type.namespace"] = { fg = theme.syn.keyword }, -- Structure
		["@lsp.type.parameter"] = { fg = theme.syn.parameter }, -- Identifier
		-- ["@lsp.type.property"] = { link = "Identifier" },
		-- ["@lsp.type.struct"] = { link = "Structure" },
		-- ["@lsp.type.type"] = { link = "Type" },
		-- ["@lsp.type.typeParameter"] = { link = "TypeDef" },
		["@lsp.type.variable"] = { fg = theme.syn.variable }, -- Identifier
		["@lsp.type.comment"] = { fg = "none" }, -- Allow TODO notes to be shown in comments
		["@lsp.type.const"] = { fg = theme.syn.constant },
		["@lsp.type.punctuation"] = { fg = theme.syn.punct },
		["@lsp.type.comparison"] = { fg = theme.syn.operator },
		["@lsp.type.bitwise"] = { fg = theme.syn.operator },
		["@lsp.type.lifetime"] = { fg = theme.syn.operator },

		["@lsp.type.selfParameter"] = { fg = theme.syn.constant },
		["@lsp.type.builtinConstant"] = { fg = theme.syn.constant },
		["@lsp.type.magicFunction"] = { fg = theme.syn.special1 },

		["@lsp.mod.readonly"] = { fg = theme.syn.constant },
		["@lsp.mod.typeHint"] = { fg = theme.syn.type },
		["@lsp.mod.defaultLibrary"] = { fg = theme.syn.keyword },
		["@lsp.mod.builtin"] = { fg = theme.syn.constant },

		["@lsp.typemod.operator.controlFlow"] = { fg = theme.syn.operator },
		["@lsp.typemod.keyword.documentation"] = { fg = theme.syn.keyword },

		["@lsp.typemod.variable.global"] = { fg = theme.syn.constant },
		["@lsp.typemod.variable.static"] = { fg = theme.syn.constant },
		["@lsp.typemod.variable.defaultLibrary"] = { fg = theme.syn.keyword },

		["@lsp.typemod.function.builtin"] = vim.tbl_extend("force", { fg = theme.syn.fun_builtin }, styles.functions),
		["@lsp.typemod.function.defaultLibrary"] = vim.tbl_extend(
			"force",
			{ fg = theme.syn.fun_builtin },
			styles.functions
		),
		["@lsp.typemod.method.defaultLibrary"] = { fg = theme.syn.keyword },

		["@lsp.typemod.operator.injected"] = { fg = theme.syn.operator },
		["@lsp.typemod.string.injected"] = { fg = theme.syn.string },
		["@lsp.typemod.variable.injected"] = { fg = theme.syn.variable },

		["@lsp.typemod.function.readonly"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.readonlyFunction),
	}
end

return M
