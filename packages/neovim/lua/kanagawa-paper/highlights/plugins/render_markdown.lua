local M = {}

function M.get(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		RenderMarkdownH1 = { fg = theme.rainbow.rainbow1 },
		RenderMarkdownH2 = { fg = theme.rainbow.rainbow2 },
		RenderMarkdownH3 = { fg = theme.rainbow.rainbow3 },
		RenderMarkdownH4 = { fg = theme.rainbow.rainbow4 },
		RenderMarkdownH5 = { fg = theme.rainbow.rainbow5 },
		RenderMarkdownH6 = { fg = theme.rainbow.rainbow6 },

		RenderMarkdownH1Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow1,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
		RenderMarkdownH2Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow2,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
		RenderMarkdownH3Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow3,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
		RenderMarkdownH4Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow4,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
		RenderMarkdownH5Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow5,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
		RenderMarkdownH6Bg = vim.tbl_extend("force", {
			fg = theme.rainbow.rainbow6,
			bg = theme.ui.bg_p1,
		}, styles.renderedHeading),
	}
end

return M
