local M = {}

function M.get(colors, opts)
	local theme = colors.theme

	return {
		NvimTreeIndentMarker = { fg = theme.ui.indent },
		NvimTreeNormal = { link = "Normal" },
		NvimTreeNormalNC = { link = "NvimTreeNormal" },
		NvimTreeCursorLine = { link = "CursorLineAlt" },
		NvimTreeGitDirty = { fg = theme.vcs.changed },
		NvimTreeGitNew = { fg = theme.vcs.added },
		NvimTreeGitDeleted = { fg = theme.vcs.removed },
		NvimTreeGitStaged = { fg = theme.vcs.added },
		NvimTreeSpecialFile = { fg = theme.syn.special1 },
		NvimTreeImageFile = { fg = theme.syn.special2 },
		NvimTreeSymlink = { link = "Type" },
		NvimTreeFolderName = { link = "Directory" },
		NvimTreeExecFile = { fg = theme.syn.string, bold = true },
		NvimTreeRootFolder = { fg = theme.accent.accent5, bold = true },
		NvimTreeOpenedFile = { fg = theme.ui.special, italic = true },
		NvimTreeOpenedFolderName = { link = "Directory" },
		NvimTreeWinSeparator = { link = "WinSeparator" },
		NvimTreeWindowPicker = { bg = theme.ui.bg_m1, fg = theme.ui.picker, bold = true },
	}
end

return M
