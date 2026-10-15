local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		Headline1 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow1, bold = true },
		Headline2 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow2, bold = true },
		Headline3 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow3, bold = true },
		Headline4 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow4, bold = true },
		Headline5 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow5, bold = true },
		Headline6 = { bg = theme.ui.bg_p1, fg = theme.rainbow.rainbow6, bold = true },
	}
end

return M
