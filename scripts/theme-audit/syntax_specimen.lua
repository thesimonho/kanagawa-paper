local samples = {
	{ "foreground", "plain", "Normal" },
	{ "attribute", "@property", "@attribute" },
	{ "comment", "#comment", "Comment" },
	{ "docstring", '"""docs"""', "@comment.documentation" },
	{ "constant", "CONSTANT", "Constant" },
	{ "deprecated", "deprecated", "SyntaxSpecimenDeprecated" },
	{ "function", "read_png()", "Function" },
	{ "identifier", "property", "Identifier" },
	{ "keyword", "if elif while", "Keyword" },
	{ "member", "field", "@variable.member" },
	{ "number", "123 0.5", "Number" },
	{ "operator", "+ == not", "Operator" },
	{ "parameter", "argument", "@variable.parameter" },
	{ "preprocessor", "import", "PreProc" },
	{ "punctuation", "()[]{},.:;", "Delimiter" },
	{ "regex", "/pattern/", "@string.regexp" },
	{ "statement", "statement", "Statement" },
	{ "string", '"green string"', "String" },
	{ "symbol", "symbol", "@string.special.symbol" },
	{ "type", "PixelImage", "Type" },
	{ "variable", "variable", "Normal" },
	{ "special1", "special1", "Special1" },
	{ "special2", "special2", "Special2" },
	{ "special3", "special3", "Special3" },
}

local buffer = vim.api.nvim_create_buf(false, true)
local namespace = vim.api.nvim_create_namespace("kanagawa-paper-syntax-specimen")
vim.api.nvim_buf_set_name(buffer, "Syntax specimen " .. buffer)
vim.api.nvim_set_current_buf(buffer)
vim.bo[buffer].buftype = "nofile"
vim.bo[buffer].bufhidden = "wipe"
vim.bo[buffer].swapfile = false
vim.bo[buffer].filetype = ""
vim.bo[buffer].syntax = ""
vim.wo.wrap = false
vim.wo.number = false
vim.wo.relativenumber = false
vim.wo.spell = false
vim.wo.conceallevel = 0
vim.wo.cursorline = true

local lines = { "Syntax colors: single spaces; move cursor to compare the current-line background." }
local marks = {}
local function append(parts)
	local line = ""
	for _, part in ipairs(parts) do
		if #line > 0 then
			line = line .. " "
		end
		local start = #line
		line = line .. part[1]
		if part[2] then
			table.insert(marks, { #lines, start, #line, part[2] })
		end
	end
	table.insert(lines, line)
end

local combined = {}
for _, sample in ipairs(samples) do
	append({ { "normal" }, { sample[2], sample[3] }, { "normal " .. sample[1] } })
	table.insert(combined, { sample[2], sample[3] })
end
-- Split the mixed strip into short rows so it remains visible in a narrow window.
for first = 1, #combined, 6 do
	local parts = { { "normal" } }
	for i = first, math.min(first + 5, #combined) do
		table.insert(parts, combined[i])
	end
	table.insert(parts, { "normal" })
	append(parts)
end
vim.api.nvim_buf_set_lines(buffer, 0, -1, false, lines)
for _, mark in ipairs(marks) do
	vim.api.nvim_buf_set_extmark(buffer, namespace, mark[1], mark[2], {
		end_col = mark[3],
		hl_group = mark[4],
		priority = 200,
	})
end
vim.bo[buffer].modifiable = false
vim.api.nvim_win_set_cursor(0, { 2, 0 })

-- Deprecated has no dedicated syntax highlight, so keep this one in sync ourselves.
local function refresh_deprecated()
	local colors = require("kanagawa-paper.colors").setup()
	vim.api.nvim_set_hl(0, "SyntaxSpecimenDeprecated", { fg = colors.theme.syn.deprecated })
end
refresh_deprecated()
local group = vim.api.nvim_create_augroup("SyntaxSpecimen" .. buffer, { clear = true })
vim.api.nvim_create_autocmd("ColorScheme", { group = group, callback = refresh_deprecated })
vim.api.nvim_create_autocmd("BufWipeout", {
	group = group,
	buffer = buffer,
	once = true,
	callback = function()
		vim.api.nvim_del_augroup_by_id(group)
	end,
})
