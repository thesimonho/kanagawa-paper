-- Read installed Neovim roles for cross-target compatibility checks.
vim.opt.runtimepath:prepend(assert(arg[1]))
local roles = {}
local highlights = {}
for _, variant in ipairs({ "ink", "canvas" }) do
	roles[variant] = require("kanagawa-paper.colors").setup({ _theme = variant }).theme
	vim.cmd.colorscheme("kanagawa-paper-" .. variant)
	highlights[variant] = {}
	for _, name in ipairs({
		"@module",
		"@type.builtin",
		"@variable.builtin",
		"@variable.member",
		"@lsp.type.property",
		"@lsp.mod.readonly",
		"@lsp.typemod.variable.static",
		"Boolean",
		"Type",
		"@keyword.function",
		"@keyword.import",
	}) do
		highlights[variant][name] = vim.api.nvim_get_hl(0, { name = name, link = false })
	end
end
vim.fn.writefile({ vim.json.encode(roles) }, assert(arg[2]))

if arg[3] then
	vim.fn.writefile({ vim.json.encode(highlights) }, arg[3])
end
