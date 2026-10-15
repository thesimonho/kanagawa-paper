local M = {}

local cwd = vim.uv.cwd()
local test_state_root = cwd .. "/.tests"

local function ensure_directory(path)
	vim.fn.mkdir(path, "p")
end

function M.setup()
	vim.env.XDG_CACHE_HOME = test_state_root .. "/cache"
	vim.env.XDG_CONFIG_HOME = test_state_root .. "/config"
	vim.env.XDG_DATA_HOME = test_state_root .. "/data"
	vim.env.XDG_STATE_HOME = test_state_root .. "/state"

	ensure_directory(vim.env.XDG_CACHE_HOME)
	ensure_directory(vim.env.XDG_CONFIG_HOME)
	ensure_directory(vim.env.XDG_DATA_HOME)
	ensure_directory(vim.env.XDG_STATE_HOME)

	for _, directory in ipairs({ "dist/neovim" }) do
		vim.opt.runtimepath:prepend(cwd .. "/" .. directory)
		package.path = cwd
			.. "/"
			.. directory
			.. "/lua/?.lua;"
			.. cwd
			.. "/"
			.. directory
			.. "/lua/?/init.lua;"
			.. package.path
	end
	vim.opt.packpath = vim.opt.runtimepath:get()
	vim.opt.loadplugins = false
	vim.opt.shadafile = "NONE"

	package.path = cwd .. "/lua/?.lua;" .. cwd .. "/lua/?/init.lua;" .. package.path
end

return M
