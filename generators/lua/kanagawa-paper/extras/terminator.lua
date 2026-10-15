local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local terminator = util.template(
		[=[
[[${_style_name}]]
  palette = "${term.black}:${term.red}:${term.green}:${term.yellow}:${term.blue}:${term.magenta}:${term.cyan}:${term.white}:${term.black_bright}:${term.red_bright}:${term.green_bright}:${term.yellow_bright}:${term.blue_bright}:${term.magenta_bright}:${term.cyan_bright}:${term.white_bright}"
  background_color = "${ui.bg}"
  foreground_color = "${ui.fg}"
  ]=],
		colors
	)
	return terminator
end

return M
