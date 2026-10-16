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
for _, token in ipairs({ "class", "type", "struct", "enum", "interface", "typeParameter", "function", "method" }) do
	for _, modifier in ipairs({ "declaration", "definition" }) do
		bold_groups["@lsp.typemod." .. token .. "." .. modifier] = true
	end
end

for _, name in ipairs({
	"@markup.strong",
	"Bold",
	"CursorLineNr",
	"FloatTitle",
	"Title",
	"ModeMsg",
	"TabLineSel",
	"BufferCurrent",
	"BufferCurrentBtn",
	"BufferCurrentTarget",
	"BufferInactiveTarget",
	"BufferAlternateTarget",
	"BufferlineBufferSelected",
	"BufferlineCloseButtonSelected",
	"BufferlineTabSelected",
	"FlashLabel",
	"LeapLabel",
	"MiniFilesTitle",
	"MiniFilesTitleFocused",
	"MiniJump2dSpot",
	"MiniTablineCurrent",
	"MiniTablineModifiedCurrent",
	"NeoTreeFloatTitle",
	"NeotestFocused",
	"NeotestMarked",
	"NvimTreeWindowPicker",
	"OctoIssueTitle",
	"LspSignatureActiveParameter",
	"TelescopeTitle",
	"TelescopeResultsTitle",
	"TelescopePreviewTitle",
	"WhichKeyTitle",
}) do
	bold_groups[name] = true
end
for i = 1, 6 do
	bold_groups["@markup.heading." .. i] = true
	bold_groups["Headline" .. i] = true
	bold_groups["markdownH" .. i] = true
	bold_groups["RenderMarkdownH" .. i .. "Bg"] = true
end
bold_groups["@markup.heading"] = true
bold_groups.NeoTreeRootName = true
bold_groups.NvimTreeRootFolder = true
bold_groups.NeoTreeFileNameOpened = true
bold_groups.NvimTreeOpenedFile = true
bold_groups["@type.declaration"] = true
bold_groups.markdownBold = true
bold_groups.markdownBoldItalic = true
for _, mode in ipairs({ "Command", "Insert", "Normal", "Other", "Replace", "Visual" }) do
	bold_groups["MiniStatuslineMode" .. mode] = true
end
for name, highlight in pairs(defaults) do
	for _, attribute in ipairs({ "bold", "italic", "underline", "strikethrough" }) do
		local italic = attribute == "italic"
			and (
				name == "markdownItalic"
				or name == "markdownBoldItalic"
				or name == "Italic"
				or name == "@markup.italic"
				or name == "@markup.quote"
				or name == "LspCodeLens"
				or name == "LspInlayHint"
				or name == "OctoDetailsLabel"
				or name == "Comment"
				or name == "@comment"
				or name == "@comment.documentation"
				or name == "@string.documentation"
				or name == "@type"
				or name == "@type.builtin"
				or name == "@type.annotation"
				or name == "@attribute"
				or name == "@attribute.python"
				or name == "@attribute.builtin.python"
				or name == "@lsp.type.decorator"
				or name:match("^@lsp.typemod%..+%.typeHint$") ~= nil
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
assert(groups.Type.bold == nil)
assert(groups["@lsp.typemod.class.declaration"].bold == true)
assert(groups["@lsp.typemod.class.declaration"].fg == nil)
assert(groups["@lsp.type.keyword"].bold == nil)

assert(defaults["@constructor"].bold == true)
assert(defaults["@constructor"].italic == false)
assert(defaults["@variable.member"].italic == nil)
assert(defaults["@lsp.typemod.class.typeHint"].italic == true)
assert(defaults["@lsp.typemod.class.typeHint"].fg == nil)
assert(defaults["@lsp.type.class"].italic == nil)
assert(defaults["@lsp.type.class"].bold == nil)
assert(defaults["@lsp.type.decorator"].fg == defaults["@attribute"].fg)

assert(defaults["@lsp.type.typeParameter"].bold == nil)
assert(defaults["@lsp.typemod.typeParameter.declaration"].bold == true)

assert(defaults.TabLineSel.bold == true)
assert(defaults.TabLine.bold == false)
assert(defaults.MiniTablineVisible.bold == false)
assert(defaults.BufferInactive.bold == false)
assert(defaults.LspInlayHint.italic == true)
assert(defaults.LspSignatureActiveParameter.bold == true)
assert(defaults.NeoTreeFileNameOpened.bold == true)

assert(defaults.markdownBoldItalic.bold == true)
assert(defaults.markdownBoldItalic.italic == true)

for _, language in ipairs({ "typescript", "tsx", "python" }) do
	assert(defaults["@type." .. language].italic == nil)
	assert(defaults["@type.builtin." .. language].italic == nil)
	assert(defaults["@type." .. language].fg == defaults["@type"].fg)
	assert(defaults["@type.builtin." .. language].fg == defaults["@type.builtin"].fg)
end
assert(defaults["@type.annotation"].italic == true)
assert(defaults["@type.annotation"].fg == nil)

assert(defaults["@type.declaration"].fg == nil)
