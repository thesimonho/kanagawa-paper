local M = {}

-- Convert snake/pascal case to kebab
---@param str string string to convert
function M.to_kebab_case(str)
	local t = str:gsub("(%l)(%u)", "%1-%2"):gsub("[%s_]+", "-"):lower()
	t = t:gsub("%-+", "-")
	return t
end

-- Simple string interpolation.
-- Example template: "${name} is ${value}"
---@param str string template string
---@param table table key value pairs to replace in the string
function M.template(str, table)
	return (
		str:gsub("($%b{})", function(w)
			return vim.tbl_get(table, unpack(vim.split(w:sub(3, -2), ".", { plain = true }))) or w
		end)
	)
end

M.write = require("kanagawa-paper.lib.io").write

return M
