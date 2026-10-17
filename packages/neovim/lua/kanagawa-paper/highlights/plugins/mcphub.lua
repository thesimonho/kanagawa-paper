local M = {}

---@param colors KanagawaColors
---@param opts KanagawaConfig
function M.get(colors, opts)
	local theme = colors.theme

	return {
		MCPHubText = { link = "NormalFloat" },
		MCPHubLink = { link = "Underlined" },
	}
end

return M
