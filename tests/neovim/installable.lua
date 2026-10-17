-- Exercise the generated distribution as an installed Neovim plugin.
vim.opt.runtimepath:prepend(assert(arg[1]))
require("kanagawa-paper").setup({ cache = false })
for _, name in ipairs({ "ink", "canvas" }) do
	vim.cmd.colorscheme("kanagawa-paper-" .. name)
	assert(vim.api.nvim_get_hl(0, { name = "Normal" }).fg)
end
vim.cmd.helptags(arg[1] .. "/doc")
vim.cmd("help kanagawa-paper.nvim")
assert(vim.api.nvim_buf_get_name(0):match("kanagawa%-paper.nvim.txt$"))
