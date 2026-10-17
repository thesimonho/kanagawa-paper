local color = require("kanagawa-paper.lib.color")
local util = require("kanagawa-paper.lib.util")
local clamp = util.clamp
local scale_log = util.scale_log
local scale_log_asymmetric = util.scale_log_asymmetric

local M = {}

---@param opts? KanagawaConfig
---@return KanagawaColors
function M.setup(opts)
	opts = require("kanagawa-paper.config").extend(opts)

	local current_theme = util.get_current_theme(opts)
	return require("kanagawa-paper.theme").prepare(current_theme, {
		palette = vim.tbl_extend("force", M.palette, opts.colors.palette or {}),
		theme = opts.colors.theme[current_theme],
		gutter = opts.gutter,
	})
end

---@param hex ColorSpec
---@param offset number
---@return ColorSpec
function M.apply_brightness(hex, offset)
	local clamped_offset = clamp(offset, -1, 1)
	local rescaled_offset = scale_log(clamped_offset, 3, 0.2)
	return color(hex):brighten(rescaled_offset):to_hex()
end

---@param hex ColorSpec
---@param offset number
---@return ColorSpec
function M.apply_saturation(hex, offset)
	local clamped_offset = clamp(offset, -1, 1)
	local rescaled_offset = scale_log_asymmetric(clamped_offset, 3, 0.2, 0.5)
	return color(hex):saturate(rescaled_offset):to_hex()
end

---@param colors KanagawaColors
---@param opts KanagawaConfig
---@return table<number, ColorSpec>
function M.terminal(colors, opts)
	local current_theme = util.get_current_theme(opts)
	for hl, _ in pairs(colors.theme.term) do
		if opts.color_balance[current_theme].saturation ~= 0 then
			colors.theme.term[hl] =
				M.apply_saturation(colors.theme.term[hl], opts.color_balance[current_theme].saturation)
		end
		if opts.color_balance[current_theme].brightness ~= 0 then
			colors.theme.term[hl] =
				M.apply_brightness(colors.theme.term[hl], opts.color_balance[current_theme].brightness)
		end
	end

	return {
		[0] = colors.theme.term.black,
		[1] = colors.theme.term.red,
		[2] = colors.theme.term.green,
		[3] = colors.theme.term.yellow,
		[4] = colors.theme.term.blue,
		[5] = colors.theme.term.magenta,
		[6] = colors.theme.term.cyan,
		[7] = colors.theme.term.white,
		[8] = colors.theme.term.black_bright,
		[9] = colors.theme.term.red_bright,
		[10] = colors.theme.term.green_bright,
		[11] = colors.theme.term.yellow_bright,
		[12] = colors.theme.term.blue_bright,
		[13] = colors.theme.term.magenta_bright,
		[14] = colors.theme.term.cyan_bright,
		[15] = colors.theme.term.white_bright,
		[16] = colors.theme.term.indexed1,
		[17] = colors.theme.term.indexed2,
	}
end

---@type PaletteColors
M.palette = require("kanagawa-paper.palette")

return M
