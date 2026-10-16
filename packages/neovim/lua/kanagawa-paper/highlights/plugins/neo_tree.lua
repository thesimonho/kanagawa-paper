local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		NeoTreeNormal = { link = "NormalFloat" },
		NeoTreeNormalNC = { link = "NormalFloat" },
		NeoTreeFloatTitle = vim.tbl_extend(
			"force",
			{ fg = theme.ui.fg_reverse, bg = theme.accent.accent1 },
			styles.title
		),
		NeoTreeFloatBorder = { link = "FloatBorder" },
		NeoTreeCursorLine = { link = "CursorLineAlt" },
		NeoTreeWinSeparator = { link = "WinSeparator" },
		NeoTreeTabInactive = { link = "TabLine" },
		NeoTreeTabActive = { link = "TabLineSel" },
		NeoTreeTabSeparatorInactive = { link = "NeoTreeTabInactive" },
		NeoTreeTabSeparatorActive = { link = "NeoTreeTabActive" },
		NeoTreeRootName = vim.tbl_extend("force", { fg = theme.accent.accent5 }, styles.treeRoot),
		NeoTreeDirectoryName = { link = "Directory" },
		NeoTreeDirectoryIcon = { link = "Directory" },
		NeoTreeModified = { link = "NeoTreeGitModified" },
		NeoTreeGitModified = { fg = theme.vcs.changed },
		NeoTreeGitAdded = { fg = theme.vcs.added },
		NeoTreeGitDeleted = { fg = theme.vcs.removed },
		NeoTreeGitStaged = { fg = theme.vcs.added },
		NeoTreeGitConflict = { fg = theme.diag.error },
		NeoTreeGitUntracked = { link = "NeoTreeGitModified", default = true },
		NeoTreeGitUnstaged = { link = "NeoTreeGitModified", default = true },
		NeoTreeIndentMarker = { fg = theme.ui.indent },
		NeoTreeFileNameOpened = vim.tbl_extend("force", { fg = theme.ui.special }, styles.openedFile),
		NeoTreeSymbolicLinkTarget = { link = "Type" },
		NeoTreeDotfile = { fg = theme.syn.comment },
	}
end

return M
