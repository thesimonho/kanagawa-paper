local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		RainbowDelimiterRed = { fg = theme.rainbow.rainbow1 },
		RainbowDelimiterYellow = { fg = theme.rainbow.rainbow2 },
		RainbowDelimiterBlue = { fg = theme.rainbow.rainbow3 },
		RainbowDelimiterOrange = { fg = theme.rainbow.rainbow4 },
		RainbowDelimiterGreen = { fg = theme.rainbow.rainbow5 },
		RainbowDelimiterViolet = { fg = theme.rainbow.rainbow6 },
		RainbowDelimiterCyan = { fg = theme.rainbow.rainbow7 },
	}
end

return M
