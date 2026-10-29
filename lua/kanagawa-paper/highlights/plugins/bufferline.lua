local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		BufferlineFill = { bg = theme.ui.tabline.bg },
		BufferlineNumbers = vim.tbl_extend("force", {
			bg = not opts.transparent and theme.ui.tabline.bg or "NONE",
			fg = theme.ui.fg_dimmer,
		}, styles.tabNumber),
		BufferlineNumbersSelected = vim.tbl_extend("force", { fg = theme.ui.tabline.indicator }, styles.tabNumber),
		BufferlineBuffer = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.fg_inactive, bg = theme.ui.tabline.bg_inactive },
			styles.inactiveTab
		),
		BufferlineBufferSelected = vim.tbl_extend("force", {
			fg = theme.ui.tabline.fg_selected,
			bg = theme.ui.tabline.bg_selected,
		}, styles.activeTab),
		BufferlineIndicatorSelected = { fg = theme.ui.tabline.indicator },
		BufferlineModified = {
			bg = not opts.transparent and theme.ui.tabline.bg or "NONE",
			fg = theme.vcs.changed,
		},
		BufferlineModifiedSelected = { fg = theme.vcs.changed, bg = theme.ui.tabline.bg_selected },
		BufferlineCloseButton = vim.tbl_extend("force", {
			bg = not opts.transparent and theme.ui.tabline.bg or "NONE",
			fg = theme.ui.fg_dimmer,
		}, styles.inactiveTab),
		BufferlineCloseButtonSelected = vim.tbl_extend("force", { fg = theme.ui.picker }, styles.activeTab),
		BufferlineTab = { fg = theme.ui.tabline.fg_inactive, bg = theme.ui.tabline.bg },
		BufferlineTabClose = { fg = theme.ui.picker, bg = theme.ui.tabline.bg },
		BufferlineTabSelected = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.fg_selected, bg = theme.ui.tabline.bg_selected },
			styles.activeTab
		),
		BufferlineTabSeparator = { fg = theme.ui.tabline.bg, bg = theme.ui.tabline.bg },
		BufferlineTabSeparatorSelected = { fg = theme.ui.tabline.bg, bg = theme.ui.tabline.bg },
		BufferlineSeparator = { fg = theme.ui.tabline.bg, bg = theme.ui.tabline.bg },
		BufferlineSeparatorSelected = { fg = theme.ui.tabline.bg, bg = theme.ui.tabline.bg },
	}
end

return M
