local cache = require("kanagawa-paper.lib.cache")
local util = require("kanagawa-paper.lib.util")

local M = {}

---@param opts? KanagawaConfig
function M.setup(opts)
	opts = require("kanagawa-paper.config").extend(opts)

	-- only needed to clear when not the default colorscheme
	if vim.g.colors_name then
		vim.cmd("hi clear")
	end

	vim.o.termguicolors = true
	local current_theme = util.get_current_theme(opts)
	if opts._theme == "auto" then
		vim.g.colors_name = "kanagawa-paper"
	else
		vim.g.colors_name = "kanagawa-paper-" .. current_theme
	end

	local cached = nil
	local cache_opts = cache.get_opts(opts)

	if opts.cache then
		cached = cache.read(current_theme)
	end

	if opts.cache and cached and cache.inputs_match(cached, cache_opts) then
		cache.apply(cached)
		if opts.terminal_colors then
			cache.apply_terminal(cached)
		end
		return cached.colors, cached.highlights, opts
	else
		local apply_saturation = require("kanagawa-paper.colors").apply_saturation
		local apply_brightness = require("kanagawa-paper.colors").apply_brightness
		local colors = require("kanagawa-paper.colors").setup(opts)
		local groups, _ = require("kanagawa-paper.highlights").setup(colors, opts)
		local term_colors = require("kanagawa-paper.colors").terminal(colors, opts)

		for hl, spec in pairs(groups) do
			spec = type(spec) == "string" and { link = spec } or spec
			for _, field in ipairs({ "bg", "fg", "sp" }) do
				if spec[field] then
					if opts.color_balance[current_theme].saturation ~= 0 then
						spec[field] = apply_saturation(spec[field], opts.color_balance[current_theme].saturation)
					end
					if opts.color_balance[current_theme].brightness ~= 0 then
						spec[field] = apply_brightness(spec[field], opts.color_balance[current_theme].brightness)
					end
				end
			end
			vim.api.nvim_set_hl(0, hl, spec)
		end

		if opts.cache then
			local container = cache.create_container(colors, groups, term_colors, cache_opts)
			cache.write(current_theme, container)
		end

		return colors, groups, opts
	end
end

return M
