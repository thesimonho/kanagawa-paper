-- Resolve application mappings against shared data without loading Neovim's theme.
local root = vim.uv.cwd()
package.path = root .. "/shared/lua/?.lua;" .. root .. "/shared/lua/?/init.lua;" .. package.path
local source = require("kanagawa-paper.theme")
local output = assert(arg[1], "output directory required")
for _, variant in ipairs({ "ink", "canvas" }) do
	local inputs = source.prepare(variant)
	local function resolve(value)
		if type(value) == "table" then
			for key, item in pairs(value) do
				value[key] = resolve(item)
			end
		elseif type(value) == "string" and value:sub(1, 1) == "@" then
			local reference, alpha = value:match("^@([^:]+):?(%x*)$")
			assert(reference, "Invalid color reference: " .. value)
			local color = vim.tbl_get(inputs, unpack(vim.split(reference, ".", { plain = true })))
			assert(type(color) == "string" and color:match("^#%x%x%x%x%x%x$"), "Unknown color: " .. value)
			assert(#alpha == 0 or #alpha == 2, "Invalid alpha: " .. value)
			return color .. alpha
		elseif type(value) == "string" and value:sub(1, 1) == "#" then
			assert(
				value:match("^#%x%x%x%x%x%x$") or value:match("^#%x%x%x%x%x%x%x%x$"),
				"Invalid color literal: " .. value
			)
			assert(value == "#00000000", "Use a shared color reference instead of literal: " .. value)
		end
		return value
	end
	local filename = "kanagawa-paper-" .. variant .. "-color-theme.json"
	local source = table.concat(vim.fn.readfile("packages/vscode/mappings/" .. filename), "\n")
	local rendered = resolve(vim.json.decode(source))
	for _, key in ipairs({ "editor.selectionHighlightBackground", "editor.inactiveSelectionBackground" }) do
		local color = rendered.colors[key]
		assert(type(color) == "string" and color:match("^#%x%x%x%x%x%x%x%x$"), "Selection color requires RGBA: " .. key)
		assert(tonumber(color:sub(-2), 16) < 255, "Selection color must be nonopaque: " .. key)
	end
	vim.fn.mkdir(output, "p")
	vim.fn.writefile({ vim.json.encode(rendered) }, output .. "/" .. filename)
end
