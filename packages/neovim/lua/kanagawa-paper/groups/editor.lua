local M = {}

---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		None = { bg = "NONE", fg = theme.ui.bg },
		DiagnosticDeprecated = vim.tbl_extend("force", {}, styles.deprecated),
		-- ColorColumn	Used for the columns set with 'colorcolumn'.
		ColorColumn = { bg = theme.ui.bg_p1 },
		-- Conceal		Placeholder characters substituted for concealed text (see 'conceallevel').
		Conceal = vim.tbl_extend("force", { fg = theme.ui.special }, styles.concealed),
		-- CurSearch	Used for highlighting a search pattern under the cursor (see 'hlsearch').
		CurSearch = vim.tbl_extend("force", { fg = theme.ui.fg_dark, bg = theme.ui.bg_search }, styles.searchMatch),
		-- Cursor		Character under the cursor.
		Cursor = { fg = theme.ui.bg, bg = theme.ui.fg },
		-- lCursor		Character under the cursor when |language-mapping| is used (see 'guicursor').
		lCursor = { link = "Cursor" },
		-- CursorIM	Like Cursor, but used when in IME mode.
		CursorIM = { link = "Cursor" },
		-- CursorColumn	Screen-column at the cursor, when 'cursorcolumn' is set.
		CursorColumn = { link = "CursorLine" },
		-- CursorLine	Screen-line at the cursor, when 'cursorline' is set. Low-priority if foreground (ctermfg OR guifg) is not set.
		CursorLine = { bg = theme.ui.bg_cursorline },
		CursorLineAlt = { bg = theme.ui.bg_cursorline_alt },
		-- Directory	Directory names (and other special names in listings).
		Directory = { fg = theme.syn.fun },
		-- DiffAdd		Diff mode: Added line. |diff.txt|
		DiffAdd = { bg = theme.diff.add_light },
		-- DiffChange	Diff mode: Changed line. |diff.txt|
		DiffChange = { bg = theme.diff.change_light },
		-- DiffDelete	Diff mode: Deleted line. |diff.txt|
		DiffDelete = vim.tbl_extend(
			"force",
			{ bg = theme.diff.delete_light, fg = theme.vcs.removed },
			styles.deletedText
		),
		-- DiffText	Diff mode: Changed text within a changed line. |diff.txt|
		DiffText = vim.tbl_extend("force", { bg = theme.diff.change_light, fg = theme.diff.change }, styles.diffText),
		-- EndOfBuffer	Filler lines (~) after the end of the buffer. By default, this is highlighted like |hl-NonText|.
		EndOfBuffer = { fg = theme.ui.bg },
		-- TermCursor	Cursor in a focused terminal.
		-- TermCursorNC	Cursor in an unfocused terminal.
		-- ErrorMsg	Error messages on the command line.
		ErrorMsg = { fg = theme.diag.error },
		-- WinSeparator	Separators between window splits.
		WinSeparator = { fg = theme.ui.win_separator, bg = "NONE" },
		VertSplit = { link = "WinSeparator" },
		-- Folded		Line used for closed folds.
		Folded = { fg = theme.ui.special, bg = theme.ui.bg_dim },
		-- FoldColumn	'foldcolumn'
		FoldColumn = { fg = theme.ui.nontext, bg = theme.ui.bg_gutter },
		-- SignColumn	Column where |signs| are displayed.
		SignColumn = { fg = theme.ui.special, bg = theme.ui.bg_gutter },
		-- IncSearch	'incsearch' highlighting; also used for the text replaced with ":s///c".
		IncSearch = { fg = theme.ui.fg_reverse, bg = theme.ui.bg_search },
		-- Substitute	|:substitute| replacement text highlighting.
		Substitute = { fg = theme.ui.fg, bg = theme.vcs.removed },
		-- LineNr		Line number for ":number" and ":#" commands, and when 'number' or 'relativenumber' option is set.
		LineNr = { fg = theme.ui.line_numbers.default, bg = theme.ui.bg_gutter },
		-- LineNrAbove	Line number for when the 'relativenumber' option is set, above the cursor line.
		-- LineNrBelow	Line number for when the 'relativenumber' option is set, below the cursor line.
		-- CursorLineNr	Like LineNr when 'cursorline' is set and 'cursorlineopt' contains "number" or is "both", for the cursor line.
		CursorLineNr = vim.tbl_extend(
			"force",
			{ fg = theme.ui.line_numbers.active, bg = theme.ui.bg_gutter },
			styles.activeLineNumber
		),
		-- CursorLineFold	Like FoldColumn when 'cursorline' is set for the cursor line.
		-- CursorLineSign	Like SignColumn when 'cursorline' is set for the cursor line.
		Mark = { fg = theme.ui.mark },
		-- MatchParen	Character under the cursor or just before it, if it is a paired bracket, and its match. |pi_paren.txt|
		MatchParen = vim.tbl_extend("force", { fg = theme.diag.warning }, styles.matchedBracket),
		-- ModeMsg		'showmode' message (e.g., "-- INSERT --").
		ModeMsg = vim.tbl_extend("force", { fg = theme.diag.warning }, styles.modeIndicator),
		-- MsgArea		Area for messages and cmdline.
		MsgArea = vim.o.cmdheight == 0 and { link = "StatusLine" }
			or { fg = theme.ui.fg_dim, bg = not opts.transparent and theme.ui.bg or "NONE" },
		-- MsgSeparator	Separator for scrolled messages |msgsep|.
		MsgSeparator = { bg = vim.o.cmdheight == 0 and theme.ui.bg or theme.ui.bg_m3 },
		-- MoreMsg		|more-prompt|
		MoreMsg = { fg = theme.diag.info },
		-- NonText		'@' at the end of the window, characters from 'showbreak' and other characters that do not really exist in the text (e.g., ">" displayed when a double-wide character doesn't fit at the end of the line). See also |hl-EndOfBuffer|.
		NonText = { fg = theme.ui.nontext },
		-- Normal		Normal text.
		Normal = { fg = theme.ui.fg, bg = not opts.transparent and theme.ui.bg or "NONE" },
		-- NormalNC	Normal text in non-current windows.
		NormalNC = opts.dim_inactive and { fg = theme.ui.fg, bg = not opts.transparent and theme.ui.bg_dim or "NONE" }
			or { link = "Normal" },
		-- NormalFloat	Normal text in floating windows.
		NormalFloat = { fg = theme.ui.float.fg, bg = theme.ui.float.bg },
		-- FloatBorder	Border of floating windows.
		FloatBorder = { fg = theme.ui.float.fg_border, bg = theme.ui.float.bg_border },
		-- FloatTitle	Title of floating windows.
		FloatTitle = vim.tbl_extend("force", { fg = theme.ui.special, bg = theme.ui.float.bg_border }, styles.title),
		-- FloatFooter	Footer of floating windows.
		FloatFooter = { fg = theme.ui.nontext, bg = theme.ui.float.bg_border },
		-- Pmenu		Popup menu: Normal item.
		Pmenu = { fg = theme.ui.pmenu.fg, bg = theme.ui.pmenu.bg },
		-- PmenuSel	Popup menu: Selected item.
		PmenuSel = { fg = theme.ui.pmenu.fg_sel, bg = theme.ui.pmenu.bg_sel },
		-- PmenuKind	Popup menu: Normal item "kind".
		PmenuKind = { fg = theme.ui.fg_dimmer, bg = theme.ui.pmenu.bg },
		-- PmenuKindSel	Popup menu: Selected item "kind".
		PmenuKindSel = { fg = theme.ui.fg_dimmer, bg = theme.ui.pmenu.bg_sel },
		-- PmenuExtra	Popup menu: Normal item "extra text".
		PmenuExtra = { fg = theme.ui.special, bg = theme.ui.pmenu.bg },
		-- PmenuExtraSel	Popup menu: Selected item "extra text".
		PmenuExtraSel = { fg = theme.ui.special, bg = theme.ui.pmenu.bg_sel },
		-- PmenuSbar	Popup menu: Scrollbar.
		PmenuSbar = { bg = theme.ui.pmenu.bg_sbar },
		-- PmenuThumb	Popup menu: Thumb of the scrollbar.
		PmenuThumb = { bg = theme.ui.pmenu.bg_thumb },
		-- Question	|hit-enter| prompt and yes/no questions.
		Question = { link = "MoreMsg" },
		-- QuickFixLine	Current |quickfix| item in the quickfix window. Combined with |hl-CursorLine| when the cursor is there.
		QuickFixLine = { bg = theme.ui.bg_p1 },
		-- Search		Last search pattern highlighting (see 'hlsearch'). Also used for similar items that need to stand out.
		Search = { fg = theme.ui.fg_reverse, bg = theme.ui.bg_search },
		-- SpecialKey	Unprintable characters: Text displayed differently from what it really is. But not 'listchars' whitespace. |hl-Whitespace|
		SpecialKey = { fg = theme.ui.special },
		-- SpellBad	Word that is not recognized by the spellchecker. |spell| Combined with the highlighting used otherwise.
		SpellBad = { undercurl = opts.undercurl, underline = not opts.undercurl, sp = theme.diag.error },
		-- SpellCap	Word that should start with a capital. |spell| Combined with the highlighting used otherwise.
		SpellCap = { undercurl = opts.undercurl, underline = not opts.undercurl, sp = theme.diag.warning },
		-- SpellLocal	Word that is recognized by the spellchecker as one that is used in another region. |spell| Combined with the highlighting used otherwise.
		SpellLocal = { undercurl = opts.undercurl, underline = not opts.undercurl, sp = theme.diag.warning },
		-- SpellRare	Word that is recognized by the spellchecker as one that is hardly ever used. |spell| Combined with the highlighting used otherwise.
		SpellRare = { undercurl = opts.undercurl, underline = not opts.undercurl, sp = theme.diag.warning },
		-- StatusLine	Status line of current window.
		StatusLine = { fg = theme.ui.fg_dim, bg = theme.ui.bg_statusline },
		-- StatusLineNC	Status lines of not-current windows. Note: If this is equal to "StatusLine", Vim will use "^^^" in the status line of the current window.
		StatusLineNC = { fg = theme.ui.nontext, bg = theme.ui.bg_m2 },
		-- TabLine		Tab pages line, not active tab page label.
		TabLine = { fg = theme.ui.tabline.fg_inactive, bg = theme.ui.tabline.bg_inactive },
		-- TabLineFill	Tab pages line, where there are no labels.
		TabLineFill = { bg = theme.ui.tabline.bg },
		-- TabLineSel	Tab pages line, active tab page label.
		TabLineSel = { fg = theme.ui.tabline.fg_selected, bg = theme.ui.tabline.bg_selected },
		-- Title		Titles for output from ":set all", ":autocmd" etc.
		Title = vim.tbl_extend("force", { fg = theme.ui.special }, styles.title),
		-- Visual		Visual mode selection.
		Visual = { bg = theme.ui.bg_visual },
		-- VisualNOS	Visual mode selection when vim is "Not Owning the Selection".
		VisualNOS = { link = "Visual" },
		-- WarningMsg	Warning messages.
		WarningMsg = { fg = theme.diag.warning },
		-- Whitespace	"nbsp", "space", "tab", "multispace", "lead" and "trail" in 'listchars'.
		Whitespace = { fg = theme.ui.whitespace },
		-- WildMenu	Current match in 'wildmenu' completion.
		WildMenu = { link = "Pmenu" },
		-- WinBar		Window bar of current window.
		WinBar = { fg = theme.ui.fg_dimmer, bg = "NONE" },
		-- WinBarNC	Window bar of not-current windows.
		WinBarNC = { fg = theme.ui.fg_dimmer, bg = opts.dim_inactive and theme.ui.bg_dim or "NONE" },

		DiagnosticError = { fg = theme.diag.error },
		DiagnosticWarn = { fg = theme.diag.warning },
		DiagnosticInfo = { fg = theme.diag.info },
		DiagnosticHint = { fg = theme.diag.hint },
		DiagnosticOk = { fg = theme.diag.ok },

		DiagnosticFloatingError = { fg = theme.diag.error },
		DiagnosticFloatingWarn = { fg = theme.diag.warning },
		DiagnosticFloatingInfo = { fg = theme.diag.info },
		DiagnosticFloatingHint = { fg = theme.diag.hint },
		DiagnosticFloatingOk = { fg = theme.diag.ok },

		DiagnosticSignError = { fg = theme.diag.error, bg = theme.ui.bg_gutter },
		DiagnosticSignWarn = { fg = theme.diag.warning, bg = theme.ui.bg_gutter },
		DiagnosticSignInfo = { fg = theme.diag.info, bg = theme.ui.bg_gutter },
		DiagnosticSignHint = { fg = theme.diag.hint, bg = theme.ui.bg_gutter },

		DiagnosticVirtualTextError = {
			fg = theme.diag.error,
			bg = opts.diag_background and theme.diag.error_light or "none",
		},
		DiagnosticVirtualTextWarn = {
			fg = theme.diag.warning,
			bg = opts.diag_background and theme.diag.warning_light or "none",
		},
		DiagnosticVirtualTextInfo = {
			fg = theme.diag.info,
			bg = opts.diag_background and theme.diag.info_light or "none",
		},
		DiagnosticVirtualTextHint = {
			fg = theme.diag.hint,
			bg = opts.diag_background and theme.diag.hint_light or "none",
		},

		DiagnosticUnderlineError = {
			undercurl = opts.undercurl,
			underline = not opts.undercurl,
			sp = theme.diag.error,
		},
		DiagnosticUnderlineWarn = {
			undercurl = opts.undercurl,
			underline = not opts.undercurl,
			sp = theme.diag.warning,
		},
		DiagnosticUnderlineInfo = {
			undercurl = opts.undercurl,
			underline = not opts.undercurl,
			sp = theme.diag.info,
		},
		DiagnosticUnderlineHint = {
			undercurl = opts.undercurl,
			underline = not opts.undercurl,
			sp = theme.diag.hint,
		},

		-- vcs
		Added = { fg = theme.vcs.added },
		Removed = { fg = theme.vcs.removed },
		Changed = { fg = theme.vcs.changed },
		diffAdded = { fg = theme.diff.add },
		diffRemoved = { fg = theme.diff.delete },
		diffDeleted = { fg = theme.diff.delete },
		diffChanged = { fg = theme.diff.change },
		diffOldFile = { fg = theme.diff.delete },
		diffNewFile = { fg = theme.diff.add },

		-- health
		healthError = { fg = theme.diag.error },
		healthSuccess = { fg = theme.diag.ok },
		healthWarning = { fg = theme.diag.warning },

		helpExample = { fg = theme.ui.fg_dim },

		qfLineNr = { link = "lineNr" },
		qfFileName = { link = "Directory" },
	}
end

return M
