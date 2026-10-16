local M = {}

-- Lualine uses a comma-separated gui string rather than highlight attributes.
function M.gui(style)
	local enabled = {}
	for _, name in ipairs({ "bold", "italic", "underline", "strikethrough" }) do
		if style[name] then
			table.insert(enabled, name)
		end
	end
	return next(style) and table.concat(enabled, ",") or nil
end

return M
