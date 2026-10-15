local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local lazygit = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------

gui:
  theme:
    activeBorderColor:
      - "${modes.normal}"
      - "bold"
    inactiveBorderColor:
      - "${ui.border}"
    searchingActiveBorderColor:
      - "${ui.bg_search}"
      - "bold"
    optionsTextColor:
      - "${ui.special}"
    selectedLineBgColor:
      - "${ui.bg_cursorline}"
    cherryPickedCommitFgColor:
      - "${ui.fg_dimmer}"
    cherryPickedCommitBgColor:
      - "${modes.replace}"
    markedBaseCommitFgColor:
      - "${ui.fg_dimmer}"
    markedBaseCommitBgColor:
      - "${modes.normal}"
    unstagedChangesColor:
      - "${vcs.changed}"
    defaultFgColor:
      - "${ui.fg}"
]],
		colors
	)
	return lazygit
end

return M
