local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		TelescopeTitle = vim.tbl_extend("force", { bg = theme.accent.accent1 }, styles.title),
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
		TelescopeResultsTitle = vim.tbl_extend("force", { bg = theme.accent.accent2 }, styles.title),

		TelescopePreviewTitle = vim.tbl_extend("force", { bg = theme.accent.accent3 }, styles.title),
		TelescopePreviewNormal = { link = "NormalFloat" },
		TelescopePreviewBorder = { link = "FloatBorder" },
	}
end

return M
