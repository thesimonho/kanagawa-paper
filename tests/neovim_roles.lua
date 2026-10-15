-- Read installed Neovim roles for cross-target compatibility checks.
vim.opt.runtimepath:prepend(assert(arg[1]))
local roles = {}
for _, variant in ipairs({ "ink", "canvas" }) do
	roles[variant] = require("kanagawa-paper.colors").setup({ _theme = variant }).theme
end
vim.fn.writefile({ vim.json.encode(roles) }, assert(arg[2]))
