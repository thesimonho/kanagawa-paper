local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local fzf = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# Note: You can either export the following as an environment variable (export FZF_DEFAULT_OPTS='...') or
#       add the following to an opts file and point FZF_DEFAULT_OPTS_FILE to it.
#       See the URL above for more information.
# -----------------------------------------------------------------------------

--color=bg:-1,bg+:${ui.bg_cursorline},fg:-1,fg+:${ui.fg},hl:${modes.visual},hl+:${syn.symbol}
--color=header:${ui.header2},info:${diag.info},pointer:${ui.mark}
--color=marker:${ui.mark},prompt:${ui.picker},spinner:${ui.special}
]],
		colors
	)
	return fzf
end

return M
