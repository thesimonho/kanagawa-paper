local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
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
		NvimTreeExecFile = vim.tbl_extend("force", { fg = theme.syn.string }, styles.executableFile),
		NvimTreeRootFolder = vim.tbl_extend("force", { fg = theme.accent.accent5 }, styles.treeRoot),
		NvimTreeOpenedFile = vim.tbl_extend("force", { fg = theme.ui.special }, styles.openedFile),
		NvimTreeOpenedFolderName = { link = "Directory" },
		NvimTreeWinSeparator = { link = "WinSeparator" },
		NvimTreeWindowPicker = vim.tbl_extend("force", { bg = theme.ui.bg_m1, fg = theme.ui.picker }, styles.jumpLabel),
	}
end

return M
