local Config = require("kanagawa-paper.config")
local Highlights = require("kanagawa-paper.highlights")

before_each(function()
	Config.setup()
end)

describe("plugin discovery cache", function()
	local Cache = require("kanagawa-paper.lib.cache")
	local old_root

	before_each(function()
		Highlights.plugins = nil
		Cache.delete("plugins")
		old_root = vim.fn.tempname() .. "/kanagawa-paper/groups/plugins"
	end)

	after_each(function()
		Highlights.plugins = nil
		Cache.delete("plugins")
		vim.fn.delete(old_root:match("^(.*)/kanagawa%-paper/groups/plugins$"), "rf")
	end)

	it("discovers plugins without a cache and reuses the current directory", function()
		local plugins = Highlights.get_all_plugins()
		assert.is_true(vim.list_contains(plugins, "neo_tree"))
		local cached = Cache.read("plugins")
		assert.is_true(cached.plugin_root:match("/highlights/plugins$") ~= nil)
		Highlights.plugins = nil
		assert.same(plugins, Highlights.get_all_plugins())
	end)

	for _, exists in ipairs({ true, false }) do
		it("replaces the previous directory cache when it " .. (exists and "exists" or "is missing"), function()
			if exists then
				vim.fn.mkdir(old_root, "p")
			end
			Cache.write("plugins", {
				plugin_root = old_root,
				mtime = os.time() + 3600,
				plugins = { "obsolete_plugin" },
			})
			local plugins = Highlights.get_all_plugins()
			assert.is_true(vim.list_contains(plugins, "neo_tree"))
			assert.is_false(vim.list_contains(plugins, "obsolete_plugin"))
			assert.is_true(Cache.read("plugins").plugin_root:match("/highlights/plugins$") ~= nil)
		end)
	end
end)

describe("group is loadable", function()
	for name in vim.fs.dir("packages/neovim/lua/kanagawa-paper/highlights/plugins") do
		name = name:match("(.+)%.lua$")
		it(name .. " has a plugin mapping", function()
			local mapping = false
			for _, v in pairs(Highlights.get_all_plugins()) do
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
			local groups = Highlights.setup(colors, opts)
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
			assert.same(groups.FloatBorder, groups.FloatermBorder)
			assert.same({ link = "LspSignatureActiveParameter" }, groups.MiniCompletionActiveParameter)
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
		it(variant .. " shares selected widget and syntax treatments", function()
			local opts = Config.extend({
				_theme = variant,
				all_plugins = true,
				auto_plugins = false,
				colors = {
					theme = {
						[variant] = {
							syn = { fun_builtin = "#123456", tag = "#234567", selector = "#345678" },
							ui = { bg_p1 = "#456789", line_numbers = { default = "#56789a" } },
						},
					},
				},
				styles = {
					functions = { bold = false, italic = true },
					type = { bold = false },
					comment = { italic = false },
					escape = { bold = false },
				},
			})
			local colors = require("kanagawa-paper.colors").setup(opts)
			local groups = Highlights.setup(colors, opts)
			assert.same({ link = "NonText" }, groups.CmpItemMenu)
			assert.same(groups.BlinkCmpKind, groups.CmpItemKindDefault)
			assert.same(groups.NeoTreeFileNameOpened, groups.NvimTreeOpenedFile)
			assert.same(groups.NvimTreeFolderName, groups.NvimTreeOpenedFolderName)
			assert.same("#56789a", groups.DapUILineNumber.fg)
			assert.same({ link = "@lsp.type.namespace" }, groups.AerialNamespaceIcon)
			assert.same(groups.AerialNamespaceIcon, groups.NavicIconsNamespace)
			assert.same("#123456", groups["@function.builtin"].fg)
			assert.same(groups["@function.builtin"], groups["@lsp.typemod.function.defaultLibrary"])
			assert.same("#234567", groups["@tag"].fg)
			assert.same(false, groups.Function.bold)
			assert.same(true, groups.Function.italic)
			assert.same(false, groups.Type.bold)
			assert.same(false, groups["@comment"].italic)
			assert.same(false, groups["@string.escape"].bold)
			assert.same(groups["@comment.todo"], groups.Todo)
			assert.same(colors.theme.diag.error, groups.MiniIconsRed.fg)
			assert.same(colors.theme.diag.warning, groups.MiniIconsYellow.fg)
			assert.same(colors.theme.term.magenta, groups.MiniIconsPurple.fg)
			for index = 1, 6 do
				assert.same("#456789", groups["Headline" .. index].bg)
				assert.same(groups["Headline" .. index], groups["RenderMarkdownH" .. index .. "Bg"])
				assert.same(groups["RenderMarkdownH" .. index].fg, groups["Headline" .. index].fg)
			end
		end)
		it(variant .. " resolves plugin captures through current highlight groups", function()
			require("kanagawa-paper").setup({
				_theme = variant,
				all_plugins = true,
				auto_plugins = false,
				cache = false,
			})
			require("kanagawa-paper").load()
			for name, target in pairs({
				TelescopeResultsField = "@variable.member",
				GrugFarResultsRgCmdHeader = "@markup.link.url",
			}) do
				local expected = vim.api.nvim_get_hl(0, { name = target, link = false })
				assert.is_true(expected.fg ~= nil)
				assert.same(expected, vim.api.nvim_get_hl(0, { name = name, link = false }))
			end
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
			local groups = Highlights.setup(colors, opts)
			assert.same("#123456", groups.SnacksIndentScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.MiniIndentscopeSymbol.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IblScope.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextChar.fg)
			assert.same(groups.SnacksIndentScope.fg, groups.IndentBlanklineContextStart.sp)
			assert.same(false, groups.IndentBlanklineContextStart.underline)
			assert.same("#654321", groups.SnacksIndent.fg)
			assert.same(groups.SnacksIndent.fg, groups.IblIndent.fg)
		end)
	end

	it("does all plugins", function()
		local opts = Config.extend({ all_plugins = true, auto_plugins = false })
		local all = {}
		for _, name in pairs(Highlights.get_all_plugins()) do
			all[name] = true
		end
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Highlights.setup(colors, opts)
		assert.same(all, plugins)
	end)

	it("does no plugins", function()
		local opts = Config.extend({ all_plugins = false, auto_plugins = false })
		local colors = require("kanagawa-paper.colors").setup(opts)
		local _, plugins = Highlights.setup(colors, opts)
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
		local _, plugins = Highlights.setup(colors, opts)
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
		local _, plugins = Highlights.setup(colors, opts)
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
		local _, plugins = Highlights.setup(colors, opts)
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
		local _, plugins = Highlights.setup(colors, opts)
		assert.same(all, plugins)
	end)
end)
