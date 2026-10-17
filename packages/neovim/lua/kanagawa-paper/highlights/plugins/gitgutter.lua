local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		GitGutterAdd = { fg = theme.vcs.added, bg = theme.ui.bg_gutter },
		GitGutterChange = { fg = theme.vcs.changed, bg = theme.ui.bg_gutter },
		GitGutterDelete = { fg = theme.vcs.removed, bg = theme.ui.bg_gutter },
		GitGutterAddLineNr = { fg = theme.vcs.added, bg = theme.ui.bg_gutter },
		GitGutterChangeLineNr = { fg = theme.vcs.changed, bg = theme.ui.bg_gutter },
		GitGutterDeleteLineNr = { fg = theme.vcs.removed, bg = theme.ui.bg_gutter },
	}
end

return M
