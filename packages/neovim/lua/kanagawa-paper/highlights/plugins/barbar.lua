local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		BufferInactive = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.fg_inactive, bg = theme.ui.tabline.bg_inactive },
			styles.inactiveTab
		),
		BufferInactiveSign = { fg = theme.ui.tabline.bg, bg = theme.ui.tabline.bg },
		BufferInactiveBtn = { bg = theme.ui.tabline.bg_inactive, fg = theme.ui.tabline.fg_inactive },
		BufferInactiveMod = { link = "BufferInactive" },
		BufferInactiveModBtn = { bg = theme.ui.tabline.bg_inactive, fg = theme.vcs.changed },
		BufferInactiveTarget = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_inactive, fg = theme.ui.picker },
			styles.jumpLabel
		),
		BufferInactiveIndex = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_inactive, fg = theme.ui.tabline.fg_inactive },
			styles.tabNumber
		),
		BufferInactiveNumber = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_inactive, fg = theme.ui.tabline.fg_inactive },
			styles.tabNumber
		),
		BufferCurrent = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.fg_selected, bg = theme.ui.tabline.bg_selected },
			styles.activeTab
		),
		BufferCurrentBtn = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_selected, fg = theme.ui.picker },
			styles.activeTab
		),
		BufferCurrentSign = { bg = theme.ui.tabline.indicator, fg = theme.ui.tabline.indicator },
		BufferCurrentMod = { link = "BufferCurrent" },
		BufferCurrentModBtn = { fg = theme.vcs.changed, bg = theme.ui.tabline.bg_selected },
		BufferCurrentTarget = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_selected, fg = theme.ui.picker },
			styles.jumpLabel
		),
		BufferCurrentIndex = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_selected, fg = theme.ui.tabline.fg_selected },
			styles.tabNumber
		),
		BufferCurrentNumber = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_selected, fg = theme.ui.tabline.fg_selected },
			styles.tabNumber
		),
		BufferCurrentHINT = { bg = theme.ui.tabline.bg_selected, fg = theme.diag.hint },
		BufferCurrentINFO = { bg = theme.ui.tabline.bg_selected, fg = theme.diag.info },
		BufferCurrentWARN = { bg = theme.ui.tabline.bg_selected, fg = theme.diag.warning },
		BufferCurrentERROR = { bg = theme.ui.tabline.bg_selected, fg = theme.diag.error },
		BufferCurrentADDED = { bg = theme.ui.tabline.bg_selected, fg = theme.vcs.added },
		BufferCurrentCHANGED = { bg = theme.ui.tabline.bg_selected, fg = theme.vcs.changed },
		BufferCurrentDELETED = { bg = theme.ui.tabline.bg_selected, fg = theme.vcs.removed },
		BufferAlternate = { bg = theme.ui.tabline.bg_alternate, fg = theme.ui.tabline.fg_alternate },
		BufferAlternateSign = { link = "BufferAlternate" },
		BufferAlternateBtn = { link = "BufferAlternate" },
		BufferAlternateMod = { link = "BufferAlternate" },
		BufferAlternateModBtn = { bg = theme.ui.tabline.bg_alternate, fg = theme.vcs.changed },
		BufferAlternateTarget = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_alternate, fg = theme.ui.picker },
			styles.jumpLabel
		),
		BufferAlternateIndex = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_alternate, fg = theme.ui.tabline.fg_alternate },
			styles.tabNumber
		),
		BufferAlternateNumber = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg_alternate, fg = theme.ui.tabline.fg_alternate },
			styles.tabNumber
		),
		BufferTabpages = vim.tbl_extend(
			"force",
			{ bg = theme.ui.tabline.bg, fg = theme.ui.tabline.fg_selected },
			styles.activeTab
		),
		BufferTabpageFill = { bg = theme.ui.tabline.bg },
		BufferTabpagesSep = { link = "BufferTabpages" },
	}
end

return M
