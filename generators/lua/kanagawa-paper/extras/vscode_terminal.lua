local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local vscode_terminal = util.template(
		[[
// -----------------------------------------------------------------------------
// ${_style_name}
// Upstream: ${_upstream_url}
// URL: ${_url}
// -----------------------------------------------------------------------------
{
  "terminal.background": "${ui.bg}",
  "terminal.foreground": "${ui.fg}",
  "terminalCursor.background": "${modes.normal}",
  "terminalCursor.foreground": "${ui.bg}",
  "terminal.ansiBlack": "${term.black}",
  "terminal.ansiBlue": "${term.blue}",
  "terminal.ansiCyan": "${term.cyan}",
  "terminal.ansiGreen": "${term.green}",
  "terminal.ansiMagenta": "${term.magenta}",
  "terminal.ansiRed": "${term.red}",
  "terminal.ansiWhite": "${term.white}",
  "terminal.ansiYellow": "${term.yellow}",
  "terminal.ansiBrightBlack": "${term.black_bright}",
  "terminal.ansiBrightBlue": "${term.blue_bright}",
  "terminal.ansiBrightCyan": "${term.cyan_bright}",
  "terminal.ansiBrightGreen": "${term.green_bright}",
  "terminal.ansiBrightMagenta": "${term.magenta_bright}",
  "terminal.ansiBrightRed": "${term.red_bright}",
  "terminal.ansiBrightWhite": "${term.white_bright}",
  "terminal.ansiBrightYellow": "${term.yellow_bright}"
}
]],
		colors
	)
	return vscode_terminal
end

return M
