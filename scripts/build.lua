-- Extras depend only on shared colors and their own templates.
local root = vim.uv.cwd()
for _, directory in ipairs({ "shared", "generators" }) do
	package.path = root
		.. "/"
		.. directory
		.. "/lua/?.lua;"
		.. root
		.. "/"
		.. directory
		.. "/lua/?/init.lua;"
		.. package.path
end
require("kanagawa-paper.extras").setup(assert(arg[1], "output directory required"))
