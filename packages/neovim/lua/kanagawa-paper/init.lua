local util = require("kanagawa-paper.lib.util")
local cache = require("kanagawa-paper.lib.cache")
local config = require("kanagawa-paper.config")

local M = {}

---@param opts? KanagawaConfig
---@return KanagawaColors, KanagawaGroups, KanagawaConfig
function M.load(opts)
	opts = require("kanagawa-paper.config").extend(opts)

	local bg = vim.o.background
	local theme_bg

	if opts._theme == "ink" then
		theme_bg = "dark"
	elseif opts._theme == "canvas" then
		theme_bg = "light"
	else -- auto
		theme_bg = vim.o.background
	end

	if bg ~= theme_bg then
		if vim.g.colors_name == "kanagawa-paper-" .. opts._theme then
			opts._theme = bg == "light" and "canvas" or "ink"
		else
			vim.o.background = theme_bg
		end
	end

	if opts.cache then
		vim.api.nvim_create_user_command("KanagawaPaperCache", function()
			for name, _ in pairs(package.loaded) do
				if name:match("^kanagawa-paper.") then
					package.loaded[name] = nil
				end
			end

			local colors = require("kanagawa-paper.colors").setup(opts)
			local groups, _ = require("kanagawa-paper.highlights").setup(colors, opts)
			local term_colors = require("kanagawa-paper.colors").terminal(colors, opts)
			local cache_opts = cache.get_opts(opts)
			local current_theme = util.get_current_theme(opts)

			local container = cache.create_container(colors, groups, term_colors, cache_opts)
			cache.write(current_theme, container)
			vim.cmd.colorscheme("kanagawa-paper")
		end, { desc = "Rebuild the cache for the current Kanagawa Paper theme" })
	else
		if vim.fn.filereadable(cache.file("ink")) == 1 then
			cache.delete("ink")
		end
		if vim.fn.filereadable(cache.file("canvas")) == 1 then
			cache.delete("canvas")
		end
	end

	return require("kanagawa-paper.themes").setup(opts)
end

M.setup = config.setup

return M
