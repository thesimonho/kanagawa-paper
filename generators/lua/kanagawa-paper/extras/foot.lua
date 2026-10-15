local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local foot = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------
[colors-dark]
background = ${ui.bg}
foreground = ${ui.fg}
selection-background = ${ui.bg_visual}
selection-foreground = ${ui.fg_dim}
urls = ${syn.special3}

cursor = ${modes.insert} ${modes.normal}

search-box-no-match = ${term.black_bright} ${term.red_bright}
search-box-match = ${term.blue_bright} ${term.black_bright}

jump-labels = ${modes.normal} ${term.yellow_bright}

# Normal colors
regular0 = ${term.black}
regular1 = ${term.red}
regular2 = ${term.green}
regular3 = ${term.yellow}
regular4 = ${term.blue}
regular5 = ${term.magenta}
regular6 = ${term.cyan}
regular7 = ${term.white}

# Bright colors
bright0 = ${term.black_bright}
bright1 = ${term.red_bright}
bright2 = ${term.green_bright}
bright3 = ${term.yellow_bright}
bright4 = ${term.blue_bright}
bright5 = ${term.magenta_bright}
bright6 = ${term.cyan_bright}
bright7 = ${term.white_bright}

# Extended colors
16 = ${term.indexed1}
17 = ${term.indexed2}
]],
		colors
	)
	foot = foot:gsub("#(%x%x%x%x%x%x)", "%1")
	return foot
end

return M
