-- Exercise public style overrides against the assembled plugin and integrations.
vim.opt.runtimepath:prepend(assert(arg[1]))
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
