local cache = require("kanagawa-paper.lib.cache")

local M = {}
M.plugins = nil

local function has_lazy()
	return pcall(require, "lazy.core.config")
end

-- Get and store all available plugins
function M.get_all_plugins()
	if M.plugins then
		return M.plugins
	end

	local runtime_files = vim.api.nvim_get_runtime_file("**/kanagawa-paper/highlights/plugins", false)
	if #runtime_files == 0 then
		return {}
	end

	local plugin_root = runtime_files[1]
	local cache_data = cache.read("plugins")
	if cache_data and cache_data.plugin_root == plugin_root then
		local stat = vim.uv.fs_stat(plugin_root)
		if stat and stat.mtime.sec <= cache_data.mtime then
			M.plugins = cache_data.plugins
			return cache_data.plugins
		end
	end

	-- cache is missing or stale
	local stat = vim.uv.fs_stat(plugin_root)
	local current_mtime = stat and stat.mtime.sec or 0

	local plugins = {}
	for name, type in vim.fs.dir(plugin_root) do
		if type == "file" then
			local basename = name:match("(.+)%.lua$")
			if basename then
				table.insert(plugins, basename)
			end
		end
	end

	local new_data = {
		plugin_root = plugin_root,
		mtime = current_mtime,
		plugins = plugins,
	}
	cache.write("plugins", new_data)
	return plugins
end

---@param colors KanagawaColors
---@param opts? KanagawaConfig
---@return KanagawaGroups, table
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	opts.plugins = opts.plugins or {}
	opts.overrides = opts.overrides or function()
		return {}
	end

	---@type KanagawaGroups
	local groups = {}

	-- add base groups
	for _, group in ipairs({ "editor", "syntax", "treesitter", "semantic", "lsp", "ft" }) do
		local mod = require("kanagawa-paper.highlights." .. group)
		for hl, spec in pairs(mod.setup(colors, opts)) do
			groups[hl] = spec
		end
	end

	-- determine plugin groups based on user config
	M.plugins = M.get_all_plugins()
	local enabled_plugins = {}
	if opts.all_plugins then
		for _, plugin in ipairs(M.plugins) do
			enabled_plugins[plugin] = true
		end
	elseif opts.auto_plugins and has_lazy() then
		local installed = {}
		for plugin, _ in pairs(require("lazy.core.config").plugins) do
			table.insert(installed, plugin)
		end
		local installed_string = table.concat(installed, "|")

		for _, plugin in ipairs(M.plugins) do
			local renamed = plugin:gsub("_", "-")
			if string.find(installed_string, renamed, 1, true) then
				enabled_plugins[plugin] = true
			end
		end
	end

	enabled_plugins = vim.tbl_extend("force", enabled_plugins, opts.plugins)

	-- add groups
	for plugin, enabled in pairs(enabled_plugins) do
		if enabled then
			-- use pcall to avoid error if plugin doesnt exist
			local ok, res = pcall(require, "kanagawa-paper.highlights.plugins." .. plugin)
			if not ok then
				vim.notify(
					"Error loading plugin: " .. plugin .. "\n" .. res,
					vim.log.levels.ERROR,
					{ title = "kanagawa-paper.nvim" }
				)
			else
				for hl, spec in pairs(res.get(colors, opts)) do
					groups[hl] = spec
				end
			end
		end
	end

	-- apply user overrides
	for hl, spec in pairs(opts.overrides(colors)) do
		if groups[hl] and next(spec) then
			groups[hl].link = nil
		end
		groups[hl] = vim.tbl_extend("force", groups[hl] or {}, spec)
	end
	return groups, enabled_plugins
end

return M
