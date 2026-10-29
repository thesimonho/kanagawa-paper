local M = {}

---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local theme = colors.theme

	return {
		-- zsh
		zshVariable = { link = "@variable" },
		zshFunction = { link = "@function" },
		zshOperator = { link = "@operator" },

		-- terraform
		tfQuotes = { link = "String" },
	}
end

return M
