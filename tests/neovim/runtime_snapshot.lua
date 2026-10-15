-- Compare installed runtime behavior, including palette and role override order.
vim.opt.runtimepath:prepend(assert(arg[1]))
local snapshots = {}
for _, variant in ipairs({ "ink", "canvas" }) do
	for _, scenario in ipairs({ "default", "custom", "balanced" }) do
		local opts = { _theme = variant, all_plugins = true, cache = false }
		if scenario == "custom" then
			opts.gutter = true
			opts.transparent = true
			opts.dim_inactive = true
			opts.colors = {
				palette = {
					dragonRed = "#b24b65",
					canvasRed1 = "#b24b65",
					sumiInk3 = "#222733",
					canvasWhite4 = "#e5ded1",
				},
				theme = {
					[variant] = { ui = { fg = "#123456", pmenu = { fg_sel = "#abcdef" } }, diff = { add = "#345678" } },
				},
			}
			opts.overrides = function(colors)
				return { Normal = { fg = colors.theme.ui.fg }, DiagnosticError = { bold = true } }
			end
		elseif scenario == "balanced" then
			opts.color_balance = { [variant] = { brightness = 0.17, saturation = -0.12 } }
		end
		require("kanagawa-paper").setup(opts)
		local colors, groups = require("kanagawa-paper").load()
		snapshots[variant .. "-" .. scenario] = { colors = colors, groups = groups }
	end
end
vim.fn.writefile({ vim.json.encode(snapshots) }, assert(arg[2]))
