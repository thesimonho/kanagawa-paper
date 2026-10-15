local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local windows_terminal = util.template(
		[[
// -----------------------------------------------------------------------------
// ${_style_name}
// Upstream: ${_upstream_url}
// URL: ${_url}
// -----------------------------------------------------------------------------
{
  "name": "${_style_name}",
  "cursorColor": "${modes.normal}",
  "selectionBackground": "${ui.bg_visual}",
  "background": "${ui.bg}",
  "foreground": "${ui.fg}",
  "black": "${term.black}",
  "blue": "${term.blue}",
  "green": "${term.green}",
  "purple": "${term.magenta}",
  "red": "${term.red}",
  "white": "${term.white}",
  "yellow": "${term.yellow}",
  "cyan": "${term.cyan}",
  "brightBlack": "${term.black_bright}",
  "brightBlue": "${term.blue_bright}",
  "brightGreen": "${term.green_bright}",
  "brightPurple": "${term.magenta_bright}",
  "brightRed": "${term.red_bright}",
  "brightWhite": "${term.white_bright}",
  "brightYellow": "${term.yellow_bright}",
  "brightCyan": "${term.cyan_bright}",
}
]],
		colors
	)
	return windows_terminal
end

return M
