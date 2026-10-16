local color = require("kanagawa-paper.lib.color")

local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		ResolveOursMarker = vim.tbl_extend(
			"force",
			{ bg = theme.diff.conflict_ours, fg = theme.ui.bg },
			styles.conflictMarker
		),
		ResolveTheirsMarker = vim.tbl_extend(
			"force",
			{ bg = theme.diff.conflict_theirs, fg = theme.ui.bg },
			styles.conflictMarker
		),
		ResolveAncestorMarker = vim.tbl_extend(
			"force",
			{ bg = theme.diff.conflict_ancestor, fg = theme.ui.bg },
			styles.conflictMarker
		),
		ResolveSeparatorMarker = { bg = theme.ui.bg_dim, fg = theme.ui.fg },
		ResolveOursSection = { bg = color(theme.diff.conflict_ours):blend(theme.ui.bg, 0.6):to_hex() },
		ResolveTheirsSection = { bg = color(theme.diff.conflict_theirs):blend(theme.ui.bg, 0.6):to_hex() },
		ResolveAncestorSection = { bg = color(theme.diff.conflict_ancestor):blend(theme.ui.bg, 0.6):to_hex() },
	}
end

return M
