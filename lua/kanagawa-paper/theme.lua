local M = {}

--- Resolve shared colors without loading any application package.
---@param variant "ink"|"canvas"
---@param opts? {palette?: table, theme?: table, gutter?: boolean}
---@return KanagawaColors
function M.prepare(variant, opts)
	assert(variant == "ink" or variant == "canvas", "Unknown theme variant: " .. tostring(variant))
	opts = opts or {}
	local palette = vim.deepcopy(opts.palette or require("kanagawa-paper.palette"))
	local theme = require("kanagawa-paper.themes." .. variant).get({ gutter = opts.gutter == true }, palette)
	return {
		palette = palette,
		theme = vim.tbl_deep_extend("force", theme, opts.theme or {}),
	}
end

return M
