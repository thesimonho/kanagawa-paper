local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		GitSignsAdd = { fg = theme.vcs.added, bg = theme.ui.bg_gutter },
		GitSignsChange = { fg = theme.vcs.changed, bg = theme.ui.bg_gutter },
		GitSignsDelete = { fg = theme.vcs.removed, bg = theme.ui.bg_gutter },
	}
end

return M
