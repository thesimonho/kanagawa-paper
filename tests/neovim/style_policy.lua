-- Exercise public style overrides against the assembled plugin and integrations.
vim.opt.runtimepath:prepend(assert(arg[1]))
require("kanagawa-paper").setup({ _theme = "canvas", cache = false, all_plugins = true })
local _, defaults = require("kanagawa-paper").load()
local bold_groups = {
	Function = true,
	Conditional = true,
	Repeat = true,
	Label = true,
	Exception = true,
	["@function"] = true,
	["@function.method"] = true,
	["@function.call"] = true,
	["@function.method.call"] = true,
	["@function.builtin"] = true,
	["@constructor"] = true,
	["@type.definition"] = true,
	["@keyword.return"] = true,
	["@keyword.exception"] = true,
	["@keyword.conditional"] = true,
	["@keyword.repeat"] = true,
	["@lsp.type.function"] = true,
	["@lsp.type.method"] = true,
	["@lsp.typemod.function.builtin"] = true,
	["@lsp.typemod.function.defaultLibrary"] = true,
	["@lsp.typemod.function.readonly"] = true,
	["@lsp.typemod.method.defaultLibrary"] = true,
}
for _, token in ipairs({ "class", "type", "struct", "enum", "interface", "function", "method" }) do
	for _, modifier in ipairs({ "declaration", "definition" }) do
		bold_groups["@lsp.typemod." .. token .. "." .. modifier] = true
	end
end
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
		assert(
			(highlight[attribute] == true)
				== (italic or deprecated or (attribute == "bold" and bold_groups[name] == true)),
			name .. "." .. attribute
		)
	end
end

require("kanagawa-paper").setup({
	_theme = "canvas",
	cache = false,
	all_plugins = true,
	styles = {
		functions = { bold = false, italic = true },
		functionDeclaration = { bold = false, italic = true },
		functionCall = { bold = false },
		typeDeclaration = { bold = true },
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

assert(groups["@function"].bold == false)
assert(groups["@function"].italic == true)
assert(groups["@function.call"].bold == false)
assert(groups.Type.bold == false)
assert(groups["@lsp.typemod.class.declaration"].bold == true)
assert(groups["@lsp.typemod.class.declaration"].fg == nil)
assert(groups["@lsp.type.keyword"].bold == nil)
