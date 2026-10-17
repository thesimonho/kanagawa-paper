local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		NoiceCmdline = { fg = theme.ui.fg },
		NoiceVirtualText = { fg = theme.syn.comment },
		NoicePopupBorder = { fg = theme.ui.float.fg_border, bg = theme.ui.float.bg_border },
		NoiceLspProgressTitle = { fg = theme.ui.fg_dim },
	}
end

return M
