-- Run with an assembled theme, installed parser-query runtime, and parser runtime.
vim.opt.runtimepath:prepend(assert(arg[1]))
vim.opt.runtimepath:append(assert(arg[2]))
vim.opt.runtimepath:append(assert(arg[3]))

local lines = {
	"type StylePolicy = Record<string, object>",
	"const result = Object.values(style)",
	"const typed: Record<string, object> = value",
	"function convert(value: TextStyle): TextStyle { return value }",
	"class Box<T> { item: T }",
	"const made = new Box<string>()",
	"const supplied = consume(Object)",
	"const asserted = value as TextStyle",
	"const checked = value satisfies TextStyle",
	"const constrained = <T extends TextStyle>(value: T) => value",
}
local source = table.concat(lines, "\n")

for _, variant in ipairs({ "ink", "canvas" }) do
	require("kanagawa-paper").setup({ _theme = variant, cache = false })
	local _, groups = require("kanagawa-paper").load()
	for _, language in ipairs({ "typescript", "tsx" }) do
		local parser = vim.treesitter.get_string_parser(source, language)
		local root = parser:parse()[1]:root()
		assert(not root:has_error(), language .. " fixture parse error")
		local query = assert(vim.treesitter.query.get(language, "highlights"))
		local function style_at(line, text)
			local column = assert(lines[line]:find(text, 1, true)) - 1
			local captures = {}
			for id, node, metadata in query:iter_captures(root, source, line - 1, line) do
				local sr, sc, er, ec = node:range()
				if
					(sr < line - 1 or (sr == line - 1 and sc <= column))
					and (er > line - 1 or (er == line - 1 and ec > column))
				then
					local name = "@" .. query.captures[id]
					captures[#captures + 1] = {
						priority = tonumber(metadata.priority) or 100,
						order = #captures + 1,
						style = groups[name .. "." .. language] or groups[name] or {},
					}
				end
			end
			table.sort(captures, function(a, b)
				return a.priority < b.priority or (a.priority == b.priority and a.order < b.order)
			end)
			local style = {}
			for _, capture in ipairs(captures) do
				style = vim.tbl_extend("force", style, capture.style)
			end
			-- The reported LSP class/default-library groups add colors, not style resets.
			return vim.tbl_extend("force", style, groups["@lsp.type.class"], groups["@lsp.mod.defaultLibrary"])
		end
		for _, example in ipairs({
			{ 1, "Record", "italic" },
			{ 1, "string", "italic" },
			{ 1, "object", "italic" },
			{ 1, "StylePolicy", "bold" },
			{ 3, "Record", "italic" },
			{ 4, "TextStyle", "italic" },
			{ 5, "Box", "bold" },
			{ 6, "Box", "bold" },
			{ 8, "TextStyle", "italic" },
			{ 9, "TextStyle", "italic" },
			{ 10, "TextStyle", "italic" },
		}) do
			local style = style_at(example[1], example[2])
			assert(style[example[3]] == true, language .. " " .. example[2] .. " " .. example[3])
			assert(style[example[3] == "bold" and "italic" or "bold"] ~= true, language .. " unexpected emphasis")
		end
		for _, line in ipairs({ 2, 7 }) do
			local style = style_at(line, "Object")
			assert(style.italic ~= true and style.bold ~= true, language .. " runtime Object must be regular")
		end
		assert(style_at(2, "values").bold == true, language .. " method call must remain bold")
		print(variant .. " " .. language .. ": annotation, runtime, declaration, and call checks passed")
	end
end
