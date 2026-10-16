-- Exercise public style overrides against the assembled plugin and integrations.
vim.opt.runtimepath:prepend(assert(arg[1]))
require("kanagawa-paper").setup({ _theme = "canvas", cache = false, all_plugins = true })
local _, defaults = require("kanagawa-paper").load()
for name, highlight in pairs(defaults) do
	for _, attribute in ipairs({ "bold", "italic", "underline", "strikethrough" }) do
		local italic = attribute == "italic"
			and (
				name == "Comment"
				or name == "@comment"
				or name == "@comment.documentation"
				or name == "@string.documentation"
			)
		local deprecated = attribute == "strikethrough"
			and (
				name == "DiagnosticDeprecated"
				or name == "@lsp.mod.deprecated"
				or name == "CmpItemAbbrDeprecated"
				or name == "BlinkCmpLabelDeprecated"
			)
		assert((highlight[attribute] == true) == (italic or deprecated), name .. "." .. attribute)
	end
end

require("kanagawa-paper").setup({
	_theme = "canvas",
	cache = false,
	all_plugins = true,
	styles = {
		functions = { bold = false, italic = true },
		boolean = { bold = false },
		openedFile = { italic = false },
		activeLineNumber = { bold = false },
		markupUnderline = { underline = false },
		jumpLabel = { bold = false },
		tabNumber = { bold = true },
		inactiveStatusline = { bold = true, italic = true },
	},
})
local _, groups = require("kanagawa-paper").load()
for _, name in ipairs({ "Function", "@function.builtin", "@lsp.type.function", "@lsp.typemod.function.builtin" }) do
	assert(groups[name].bold == false, name)
	assert(groups[name].italic == true, name)
end
for _, name in ipairs({ "BufferInactiveTarget", "BufferCurrentTarget", "BufferAlternateTarget" }) do
	assert(groups[name].bold == false, name)
end
assert(groups.BufferCurrentNumber.bold == true)
assert(groups.Boolean.bold == false)
assert(groups.NeoTreeFileNameOpened.italic == false)
assert(groups.NvimTreeOpenedFile.italic == false)
assert(groups.CursorLineNr.bold == false)
assert(groups["@markup.underline"].underline == false)
-- A color-only semantic modifier must not acquire a style reset.
assert(groups["@lsp.mod.readonly"].bold == nil)
assert(groups["@lsp.mod.readonly"].italic == nil)
assert(groups["@variable"].bold == nil)
assert(groups["@variable"].italic == nil)

local gui = require("kanagawa-paper.lib.lualine_style").gui
assert(gui({}) == nil)
assert(gui({ bold = false }) == "")
assert(gui({ bold = true, italic = true }) == "bold,italic")
assert(require("lualine.themes.kanagawa-paper-canvas").inactive.b.gui == "bold,italic")
assert(require("lualine.themes.kanagawa-paper-ink").inactive.b.gui == "bold,italic")
