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
		it(variant .. " shares comment, completion and line-number roles", function()
			local opts = Config.extend({
				_theme = variant,
				all_plugins = true,
				auto_plugins = false,
				colors = {
					theme = {
						[variant] = {
							ui = {
								line_numbers = { default = "#123456" },
								nontext = "#abcdef",
								pmenu = {
									fg_border = "#112233",
									bg_border = "#223344",
									bg_thumb = "#334455",
									bg_sbar = "#445566",
								},
								float = { fg_border = "#556677", bg_border = "#667788" },
							},
						},
					},
				},
			})
			local colors = require("kanagawa-paper.colors").setup(opts)
			local groups = Groups.setup(colors, opts)
			assert.same({ link = "Directory" }, groups.NeoTreeDirectoryName)
			assert.same({ link = "Directory" }, groups.NeoTreeDirectoryIcon)
			assert.same(groups.MiniFilesDirectory, groups.NeoTreeDirectoryName)
			assert.same(groups.NvimTreeFolderName, groups.NeoTreeDirectoryName)
			assert.same({ link = "Search" }, groups.MiniPickMatchRanges)
			assert.same(groups.SnacksPickerMatch, groups.MiniPickMatchRanges)
			assert.same({ link = "DiagnosticSignInfo" }, groups.ScrollViewKeywordsTodo)
			assert.same({ link = "DiagnosticSignHint" }, groups.ScrollViewKeywordsXxx)
			assert.same(groups["@comment.todo"].bg, groups.DiagnosticSignInfo.fg)
			assert.same(groups["@comment.note"].bg, groups.DiagnosticSignHint.fg)
			assert.same(groups["@comment.note"], groups.MiniHipatternsNote)
			assert.same(groups["@comment.todo"], groups.MiniHipatternsTodo)
			assert.same(groups.BlinkCmpMenuBorder, groups.CmpCompletionBorder)
			assert.same(groups.BlinkCmpScrollBarThumb, groups.CmpCompletionThumb)
			assert.same({ bg = "#445566" }, groups.BlinkCmpScrollBarGutter)
			assert.same(groups.PmenuSbar, groups.CmpCompletionSbar)
			assert.same({ link = "FloatBorder" }, groups.BlinkCmpSignatureHelpBorder)
			assert.same({ fg = "#556677", bg = "#667788" }, groups.FloatBorder)
			assert.same("#123456", groups.TreesitterContextLineNumber.fg)
			assert.same(colors.theme.ui.bg_p2, groups.TreesitterContextLineNumber.bg)
		end)
		it(variant .. " shares indent scope overrides across plugins", function()
			local opts = Config.extend({
				_theme = variant,
				all_plugins = true,
				auto_plugins = false,
				colors = {
					theme = {
						[variant] = { ui = { indent_scope = "#123456", indent = "#654321", special = "#abcdef" } },
					},
				},
			})
			local colors = require("kanagawa-paper.colors").setup(opts)
			local groups = Groups.setup(colors, opts)
			assert.same("#123456", groups.SnacksIndentScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.MiniIndentscopeSymbol.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IblScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextChar.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextStart.sp)
			assert.same(true, groups.IndentBlanklineContextStart.underline)
			assert.same("#654321", groups.SnacksIndent.fg)
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
