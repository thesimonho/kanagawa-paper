local Config = require("kanagawa-paper.config")
local Groups = require("kanagawa-paper.groups")

before_each(function()
	Config.setup()
end)

describe("group is loadable", function()
	for name in vim.fs.dir("packages/neovim/lua/kanagawa-paper/groups/plugins") do
		name = name:match("(.+)%.lua$")
		it(name .. " has a plugin mapping", function()
			local mapping = false
			for _, v in pairs(Groups.get_all_plugins()) do
				if v == name then
					mapping = true
					break
				end
			end
			assert.is_true(mapping, name)
		end)
	end
end)

describe("group config", function()
	for _, variant in ipairs({ "ink", "canvas" }) do
		it(variant .. " shares indent scope overrides across plugins", function()
			local opts = Config.extend({
				_theme = variant,
				all_plugins = true,
				auto_plugins = false,
				colors = { theme = { [variant] = { ui = { indent_scope = "#123456", special = "#abcdef" } } } },
			})
			local colors = require("kanagawa-paper.colors").setup(opts)
			local groups = Groups.setup(colors, opts)
			assert.same("#123456", groups.SnacksIndentScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IblScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextChar.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextStart.sp)
			assert.same(true, groups.IndentBlanklineContextStart.underline)
			assert.same(groups.SnacksIndent.fg, groups.IblIndent.fg)
		end)
	end

	it("does all plugins", function()
		local opts = Config.extend({ all_plugins = true, auto_plugins = false })
		local all = {}
		for _, name in pairs(Groups.get_all_plugins()) do
			all[name] = true
		end
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same(all, plugins)
	end)

	it("does no plugins", function()
		local opts = Config.extend({ all_plugins = false, auto_plugins = false })
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same({}, plugins)
	end)

	it("does manual plugins", function()
		local opts = Config.extend({
			all_plugins = false,
			auto_plugins = false,
			plugins = {
				aerial = true,
				snacks = true,
			},
		})
		local all = {}
		all.aerial = true
		all.snacks = true
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same(all, plugins)
	end)

	it("does auto plugins", function()
		local opts = Config.extend({
			all_plugins = false,
			auto_plugins = true,
		})
		local all = {}
		all.lazy = true
		all.mini = true
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same(all, plugins)
	end)

	it("handle multi-word plugins", function()
		local opts = Config.extend({
			all_plugins = false,
			auto_plugins = false,
			plugins = {
				neo_tree = true,
				snacks = true,
			},
		})
		local all = {}
		all.neo_tree = true
		all.snacks = true
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same(all, plugins)
	end)

	it("handle disabled plugins", function()
		local opts = Config.extend({
			all_plugins = false,
			auto_plugins = false,
			plugins = {
				aerial = false,
				snacks = true,
			},
		})
		local all = {}
		all.aerial = false
		all.snacks = true
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Groups.setup(colors, opts)
		assert.same(all, plugins)
	end)
end)
