local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local tilix = util.template(
		[[
// -----------------------------------------------------------------------------
// ${_style_name}
// Upstream: ${_upstream_url}
// URL: ${_url}
// -----------------------------------------------------------------------------
{
  "name": "${_style_name}",
  "comment": "",
  "use-theme-colors": false,
  "foreground-color": "${ui.fg}",
  "background-color": "${ui.bg}",
  "palette": [
      "${term.black}",
      "${term.red}",
      "${term.green}",
      "${term.yellow}",
      "${term.blue}",
      "${term.magenta}",
      "${term.cyan}",
      "${term.white}",
      "${term.black_bright}",
      "${term.red_bright}",
      "${term.green_bright}",
      "${term.yellow_bright}",
      "${term.blue_bright}",
      "${term.magenta_bright}",
      "${term.cyan_bright}",
      "${term.white_bright}"
  ]
}
]],
		colors
	)
	return tilix
end

return M
