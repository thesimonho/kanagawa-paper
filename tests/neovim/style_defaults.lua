vim.opt.runtimepath:prepend(assert(arg[1]))
vim.fn.writefile({ vim.json.encode(require("kanagawa-paper.config").defaults.styles) }, assert(arg[2]))
