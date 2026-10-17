local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		Headline1 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow1 },
			styles.renderedHeading
		),
		Headline2 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow2 },
			styles.renderedHeading
		),
		Headline3 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow3 },
			styles.renderedHeading
		),
		Headline4 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow4 },
			styles.renderedHeading
		),
		Headline5 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow5 },
			styles.renderedHeading
		),
		Headline6 = vim.tbl_extend(
			"force",
			{ bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow6 },
			styles.renderedHeading
		),
	}
end

return M
