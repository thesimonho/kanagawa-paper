local cache_version = 7.0 -- Bump when cached colors or highlights change.
local util = require("kanagawa-paper.lib.util")

local M = {}

--- Get the cache file path for a given key
---@param key string
---@return string
function M.file(key)
	return vim.fn.stdpath("cache") .. "/kanagawa-paper-" .. key .. ".json"
end

--- Read data from the cache file for a given key
---@param key string
---@return table|nil
function M.read(key)
	if vim.fn.filereadable(M.file(key)) == 0 then
		return nil
	end

	local ok, ret = pcall(function()
		return vim.json.decode(util.read(M.file(key)), { luanil = {
			object = true,
			array = true,
		} })
	end)
	if not ok then
		vim.notify("Error loading cached colorscheme: " .. ret, vim.log.levels.ERROR, { title = "kanagawa-paper.nvim" })
	end
	return ok and ret or nil
end

--- Write data to the cache file for a given key
---@param key string
---@param data table
function M.write(key, data)
	local ok = pcall(util.write, M.file(key), vim.json.encode(data))
	if ok then
		vim.notify(
			"Cache updated: kanagawa-paper-" .. key .. ".json",
			vim.log.levels.INFO,
			{ title = "kanagawa-paper.nvim" }
		)
	end
end

--- Delete the cache file for a given key
---@param key string
function M.delete(key)
	local ok, ret = pcall(vim.uv.fs_unlink, M.file(key))
	if not ok then
		print(ret)
	end
end

-- Apply main highlights.
---@param data KanagawaCache
function M.apply(data)
	for group, spec in pairs(data.highlights) do
		vim.api.nvim_set_hl(0, group, spec)
	end
end

-- Apply terminal colors.
---@param data KanagawaCache
function M.apply_terminal(data)
	for idx, color in pairs(data.termcolors) do
		vim.g["terminal_color_" .. idx] = color
	end
end

--- Get the options that will be used to validate the cache.
---@param opts KanagawaConfig
---@return KanagawaConfig
function M.get_opts(opts)
	return {
		transparent = opts.transparent,
		gutter = opts.gutter,
		diag_background = opts.diag_background,
		dim_inactive = opts.dim_inactive,
		styles = opts.styles,
		colors = opts.colors,
		color_balance = opts.color_balance,
		plugins = opts.plugins,
	}
end

-- Cache structure.
---@param colors KanagawaColors
---@param highlights table<string, vim.api.keyset.highlight>
---@param termcolors table<number, ColorSpec>
---@param opts KanagawaConfig
---@return KanagawaCache
function M.create_container(colors, highlights, termcolors, opts)
	return {
		colors = colors,
		highlights = highlights,
		termcolors = termcolors,
		opts = opts,
		version = cache_version,
	}
end

--- Check if the cache contents match the current configuration.
---@param cache KanagawaCache
---@param opts KanagawaConfig | nil
---@return boolean
function M.inputs_match(cache, opts)
	if not cache or not opts then
		return false
	end
	if cache_version > cache.version then
		return false
	end
	return vim.deep_equal(cache.opts, opts)
end

return M
