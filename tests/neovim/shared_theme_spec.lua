local source = require("kanagawa-paper.theme")
local colors = require("kanagawa-paper.colors")
local Config = require("kanagawa-paper.config")

describe("shared color preparation", function()
	before_each(function()
		Config.setup()
	end)

	for _, variant in ipairs({ "ink", "canvas" }) do
		it(variant .. " rebuilds caches without dedicated line-number roles", function()
			local cache = require("kanagawa-paper.lib.cache")
			local opts = Config.extend({ _theme = variant, cache = true, all_plugins = false, auto_plugins = false })
			local expected = source.prepare(variant).theme.ui.line_numbers
			local legacy = source.prepare(variant)
			legacy.theme.ui.line_numbers = nil
			local entry = cache.create_container(legacy, {}, {}, cache.get_opts(opts))
			entry.version = 1.0
			cache.write(variant, entry)
			local ok, result = pcall(require("kanagawa-paper.themes").setup, opts)
			cache.delete(variant)
			assert.is_true(ok)
			assert.same(expected, result.theme.ui.line_numbers)
		end)

		it(variant .. " keeps line numbers independent of nontext and diagnostics", function()
			local defaults = source.prepare(variant).theme
			assert.same(defaults.ui.nontext, defaults.ui.line_numbers.default)
			assert.same(defaults.diag.warning, defaults.ui.line_numbers.active)
			local result = colors.setup({
				_theme = variant,
				gutter = true,
				colors = {
					theme = {
						[variant] = {
							ui = { nontext = "#123456" },
							diag = { warning = "#abcdef" },
						},
					},
				},
			})
			local groups = require("kanagawa-paper.groups.editor").setup(result, {})
			assert.same(defaults.ui.line_numbers.default, groups.LineNr.fg)
			assert.same(defaults.ui.line_numbers.active, groups.CursorLineNr.fg)
			assert.same(true, groups.CursorLineNr.bold)
			assert.same(result.theme.ui.bg_gutter, groups.LineNr.bg)
			assert.same(result.theme.ui.bg_gutter, groups.CursorLineNr.bg)
		end)

		it(variant .. " uses dedicated line-number and palette overrides", function()
			local name = variant == "ink" and "sumiInk6" or "canvasGray1"
			local result = colors.setup({
				_theme = variant,
				colors = {
					palette = { [name] = "#123456" },
					theme = { [variant] = { ui = { line_numbers = { active = "#abcdef" } } } },
				},
			})
			local groups = require("kanagawa-paper.groups.editor").setup(result, {})
			assert.same("#123456", groups.LineNr.fg)
			assert.same("#abcdef", groups.CursorLineNr.fg)
		end)

		it(variant .. " keeps emphasis and primary overrides independent", function()
			local defaults = source.prepare(variant).theme
			assert.same(defaults.accent.accent1, defaults.ui.special)
			for _, override in ipairs({
				{ ui = { special = "#123456" } },
				{ accent = { accent1 = "#abcdef" } },
			}) do
				local result = colors.setup({ _theme = variant, colors = { theme = { [variant] = override } } }).theme
				assert.same(override.ui and "#123456" or defaults.ui.special, result.ui.special)
				assert.same(override.accent and "#abcdef" or defaults.accent.accent1, result.accent.accent1)
			end
		end)

		it(variant .. " preserves Neovim palette and role overrides", function()
			local palette_name = variant == "ink" and "fujiWhite" or "canvasGray3"
			local result = colors.setup({
				_theme = variant,
				gutter = true,
				colors = {
					palette = { [palette_name] = "#123456" },
					theme = { [variant] = { syn = { string = "#abcdef" } } },
				},
			})
			assert.same("#123456", result.palette[palette_name])
			assert.same("#123456", result.theme.ui.fg)
			assert.same("#abcdef", result.theme.syn.string)
			assert.is_true(result.theme.ui.bg_gutter ~= "none")
		end)

		it(variant .. " preparations cannot mutate later target colors", function()
			local expected = source.prepare(variant)
			local changed = source.prepare(variant)
			changed.palette.dragonWhite = "#000000"
			changed.theme.ui.fg = "#000000"
			assert.same(expected, source.prepare(variant))
			assert.same(expected, colors.setup({ _theme = variant }))
		end)
	end
end)
