local M = {}

---@param colors KanagawaColors
---@param opts KanagawaConfig
function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		MiniAnimateCursor = { reverse = true, nocombine = true },
		MiniAnimateNormalFloat = { link = "NormalFloat" },

		MiniClueBorder = { link = "FloatBorder" },
		MiniClueDescGroup = { link = "DiagnosticFloatingWarn" },
		MiniClueDescSingle = { link = "NormalFloat" },
		MiniClueNextKey = { fg = theme.ui.picker },
		MiniClueNextKeyWithPostkeys = { link = "DiagnosticFloatingError" },
		MiniClueSeparator = { link = "DiagnosticFloatingInfo" },
		MiniClueTitle = { link = "FloatTitle" },

		MiniCompletionActiveParameter = { link = "LspSignatureActiveParameter" },

		MiniCursorword = vim.tbl_extend("force", {}, styles.cursorWord),
		MiniCursorwordCurrent = vim.tbl_extend("force", {}, styles.cursorWord),

		MiniDepsChangeAdded = { link = "diffAdded" },
		MiniDepsChangeRemoved = { link = "diffRemoved" },
		MiniDepsHint = { fg = theme.diag.hint },
		MiniDepsInfo = { fg = theme.diag.info },
		MiniDepsMsgBreaking = { fg = theme.diag.warning },
		MiniDepsPlaceholder = { link = "Comment" },
		MiniDepsTitle = { link = "Title" },
		MiniDepsTitleError = { link = "DiffDelete" },
		MiniDepsTitleSame = { link = "DiffText" },
		MiniDepsTitleUpdate = { link = "DiffAdd" },

		MiniDiffSignAdd = { fg = theme.vcs.added, bg = theme.ui.bg_gutter },
		MiniDiffSignChange = { fg = theme.vcs.changed, bg = theme.ui.bg_gutter },
		MiniDiffSignDelete = { fg = theme.vcs.removed, bg = theme.ui.bg_gutter },
		MiniDiffOverAdd = { link = "DiffAdd" },
		MiniDiffOverChange = { link = "DiffText" },
		MiniDiffOverContext = { link = "DiffChange" },
		MiniDiffOverDelete = { link = "DiffDelete" },

		MiniFilesBorder = { link = "FloatBorder" },
		MiniFilesBorderModified = { link = "DiagnosticFloatingWarn" },
		MiniFilesCursorLine = { bg = theme.ui.bg_cursorline_alt },
		MiniFilesDirectory = { link = "Directory" },
		MiniFilesFile = { fg = theme.ui.fg },
		MiniFilesNormal = { link = "NormalFloat" },
		MiniFilesTitle = vim.tbl_extend(
			"force",
			{ fg = theme.ui.special, bg = theme.ui.float.bg_border },
			styles.title
		),
		MiniFilesTitleFocused = vim.tbl_extend(
			"force",
			{ fg = theme.ui.fg, bg = theme.ui.float.bg_border },
			styles.title
		),

		MiniHipatternsFixme = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.diag.error },
			styles.commentMarker
		),
		MiniHipatternsHack = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.diag.warning },
			styles.commentMarker
		),
		MiniHipatternsNote = vim.tbl_extend("force", { fg = theme.ui.bg, bg = theme.diag.hint }, styles.commentMarker),
		MiniHipatternsTodo = vim.tbl_extend("force", { fg = theme.ui.bg, bg = theme.diag.info }, styles.commentMarker),

		MiniIconsAzure = { fg = theme.syn.special1 },
		MiniIconsBlue = { fg = theme.syn.fun },
		MiniIconsCyan = { fg = theme.syn.type },
		MiniIconsGreen = { fg = theme.syn.string },
		MiniIconsGrey = { fg = theme.ui.fg },
		MiniIconsOrange = { fg = theme.syn.constant },
		MiniIconsPurple = { fg = theme.term.magenta },
		MiniIconsRed = { fg = theme.diag.error },
		MiniIconsYellow = { fg = theme.diag.warning },

		MiniIndentscopeSymbol = { fg = theme.ui.indent_scope },
		MiniIndentscopePrefix = { nocombine = true }, -- Make it invisible

		MiniJump = { link = "SpellRare" },

		MiniJump2dDim = { fg = theme.syn.comment },
		MiniJump2dSpot = vim.tbl_extend("force", { fg = theme.ui.picker, nocombine = true }, styles.jumpLabel),
		MiniJump2dSpotUnique = { link = "MiniJump2dSpot" },
		MiniJump2dSpotAhead = vim.tbl_extend("force", { fg = theme.ui.picker, nocombine = true }, styles.jumpPreview),

		MiniMapNormal = { link = "NormalFloat" },
		MiniMapSymbolCount = { link = "Special" },
		MiniMapSymbolLine = { link = "Title" },
		MiniMapSymbolView = { link = "Delimiter" },

		MiniNotifyBorder = { link = "FloatBorder" },
		MiniNotifyNormal = { link = "NormalFloat" },
		MiniNotifyTitle = { link = "FloatTitle" },

		MiniOperatorsExchangeFrom = { link = "IncSearch" },

		MiniPickBorder = { link = "FloatBorder" },
		MiniPickBorderBusy = { link = "DiagnosticFloatingWarn" },
		MiniPickBorderText = { link = "FloatTitle" },
		MiniPickIconDirectory = { link = "Directory" },
		MiniPickIconFile = { link = "MiniPickNormal" },
		MiniPickHeader = { link = "DiagnosticFloatingHint" },
		MiniPickMatchCurrent = { link = "CursorLineAlt" },
		MiniPickMatchMarked = { link = "Visual" },
		MiniPickMatchRanges = { link = "Search" },
		MiniPickNormal = { link = "NormalFloat" },
		MiniPickPreviewLine = { link = "CursorLineAlt" },
		MiniPickPreviewRegion = { link = "IncSearch" },
		MiniPickPrompt = { fg = theme.syn.fun, bg = theme.ui.float.bg_border },

		MiniStarterCurrent = { nocombine = true },
		MiniStarterFooter = { fg = theme.syn.deprecated },
		MiniStarterHeader = { link = "Title" },
		MiniStarterInactive = { link = "Comment" },
		MiniStarterItem = { link = "Normal" },
		MiniStarterItemBullet = { link = "Delimiter" },
		MiniStarterItemPrefix = { fg = theme.diag.warning },
		MiniStarterSection = { fg = theme.ui.header1 },
		MiniStarterQuery = { fg = theme.diag.info },

		MiniStatuslineModeCommand = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.modes.command },
			styles.modeIndicator
		),
		MiniStatuslineModeInsert = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.modes.insert },
			styles.modeIndicator
		),
		MiniStatuslineModeNormal = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg_p2, bg = theme.modes.normal },
			styles.modeIndicator
		),
		MiniStatuslineModeOther = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg_p2, bg = theme.modes.normal },
			styles.modeIndicator
		),
		MiniStatuslineModeReplace = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.modes.replace },
			styles.modeIndicator
		),
		MiniStatuslineModeVisual = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.modes.visual },
			styles.modeIndicator
		),
		MiniStatuslineDevinfo = { fg = theme.ui.fg, bg = theme.ui.bg_p2 },
		MiniStatuslineFileinfo = { fg = theme.ui.fg_dim, bg = theme.ui.bg_statusline },
		MiniStatuslineFilename = { link = "MiniStatuslineFileinfo" },
		MiniStatuslineInactive = { fg = theme.ui.fg_dim, bg = theme.ui.bg_m4 },

		MiniSurround = { link = "IncSearch" },

		MiniTablineCurrent = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.fg_selected, bg = theme.ui.tabline.bg_selected },
			styles.activeTab
		),
		MiniTablineFill = { link = "TabLineFill" },
		MiniTablineHidden = { fg = theme.ui.special, bg = theme.ui.tabline.bg },
		MiniTablineModifiedCurrent = vim.tbl_extend("force", {
			fg = theme.ui.tabline.bg_selected,
			bg = theme.ui.tabline.fg_selected,
		}, styles.activeTab),
		MiniTablineModifiedHidden = { fg = theme.ui.tabline.bg, bg = theme.ui.special },
		MiniTablineModifiedVisible = vim.tbl_extend(
			"force",
			{ fg = theme.ui.tabline.bg, bg = theme.ui.special },
			styles.inactiveTab
		),
		MiniTablineTabpagesection = vim.tbl_extend(
			"force",
			{ fg = theme.ui.fg, bg = theme.ui.bg_search },
			styles.inactiveTab
		),
		MiniTablineVisible = vim.tbl_extend(
			"force",
			{ fg = theme.ui.special, bg = theme.ui.tabline.bg },
			styles.inactiveTab
		),

		MiniTestEmphasis = vim.tbl_extend("force", {}, styles.testEmphasis),
		MiniTestFail = vim.tbl_extend("force", { fg = theme.diag.error }, styles.testEmphasis),
		MiniTestPass = vim.tbl_extend("force", { fg = theme.diag.ok }, styles.testEmphasis),

		MiniTrailspace = { bg = theme.vcs.removed },
	}
end

return M
