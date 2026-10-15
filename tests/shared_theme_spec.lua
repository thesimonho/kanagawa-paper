local source = require("kanagawa-paper.theme")
local colors = require("kanagawa-paper.colors")
local Config = require("kanagawa-paper.config")

describe("shared color preparation", function()
	before_each(function()
		Config.setup()
	end)

	for _, variant in ipairs({ "ink", "canvas" }) do
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
