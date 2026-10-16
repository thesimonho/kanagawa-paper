local M = {}

---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local styles = opts.styles or require("kanagawa-paper.config").options.styles
	local theme = colors.theme

	return {
		-- @variable                       various variable names
		["@variable"] = { fg = theme.syn.variable },
		-- @variable.builtin (Special)     built-in variable names (e.g. `this`, `self`)
		["@variable.builtin"] = vim.tbl_extend("force", { fg = theme.syn.constant }, styles.builtinVariable),
		-- @variable.parameter             parameters of a function
		["@variable.parameter"] = { fg = theme.syn.parameter },
		-- @variable.parameter.builtin     special parameters (e.g. `_`, `it`)
		-- @variable.member                object and struct fields
		["@variable.member"] = { fg = theme.syn.member },
		--
		-- @constant (Constant)              constant identifiers
		-- @constant.builtin       built-in constant values
		-- @constant.macro         constants defined by the preprocessor
		--
		-- @module (Structure)      modules or namespaces
		-- @module.builtin         built-in modules or namespaces
		-- @label                  `GOTO` and other labels (e.g. `label:` in C), including heredoc labels
		--
		-- @string                 string literals
		-- @string.documentation   string documenting code (e.g. Python docstrings)
		["@string.documentation"] = vim.tbl_extend("force", { fg = theme.syn.string }, styles.documentation),
		-- @string.regexp          regular expressions
		["@string.regexp"] = { fg = theme.syn.regex },
		-- @string.escape          escape sequences
		["@string.escape"] = vim.tbl_extend("force", { fg = theme.syn.regex }, styles.escape),
		-- @string.special         other special strings (e.g. dates)
		-- @string.special.symbol  symbols or atoms
		["@string.special.symbol"] = { fg = theme.syn.symbol },
		-- @string.special.path    filenames
		-- @string.special.url (Underlined)     URIs (e.g. hyperlinks)
		["@string.special.url"] = { link = "Underlined" },
		-- @character              character literals
		-- @character.special      special characters (e.g. wildcards)
		--
		-- @boolean                boolean literals
		-- @number                 numeric literals
		-- @number.float           floating-point number literals
		--
		["@type"] = vim.tbl_extend("force", { fg = theme.syn.type }, styles.typeAnnotation),
		["@type.builtin"] = vim.tbl_extend("force", { fg = theme.syn.special1 }, styles.typeAnnotation),
		-- TypeScript query nodes distinguish type expressions from runtime class values.
		["@type.typescript"] = vim.tbl_extend("force", { fg = theme.syn.type }, styles.type),
		["@type.builtin.typescript"] = vim.tbl_extend("force", { fg = theme.syn.special1 }, styles.type),
		["@type.tsx"] = vim.tbl_extend("force", { fg = theme.syn.type }, styles.type),
		["@type.builtin.tsx"] = vim.tbl_extend("force", { fg = theme.syn.special1 }, styles.type),
		["@type.annotation"] = vim.tbl_extend("force", {}, styles.typeAnnotation),
		-- @type                   type or class definitions and annotations
		-- @type.builtin           built-in types
		["@type.definition"] = vim.tbl_extend("force", { fg = theme.syn.type }, styles.typeDeclaration),
		-- @type.definition        identifiers in type definitions (e.g. `typedef <type> <identifier>` in C)
		--
		-- @attribute              attribute annotations (e.g. Python decorators, Rust lifetimes)
		["@attribute"] = vim.tbl_extend("force", { fg = theme.syn.attribute }, styles.annotation),
		-- @attribute.builtin      builtin annotations (e.g. `@property` in Python)
		-- @property               the key in key/value pairs
		--
		["@function"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functionDeclaration),
		["@function.method"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functionDeclaration),
		["@function.call"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functionCall),
		["@function.method.call"] = vim.tbl_extend("force", { fg = theme.syn.fun }, styles.functionCall),
		-- @function               function definitions
		-- @function.builtin       built-in functions
		["@function.builtin"] = vim.tbl_extend("force", { fg = theme.syn.fun_builtin }, styles.functions),
		-- @function.call          function calls
		-- @function.macro         preprocessor macros
		--
		-- @function.method        method definitions
		-- @function.method.call   method calls
		--
		-- @constructor            constructor calls and type instantiations
		["@constructor"] = vim.tbl_extend("force", { fg = theme.syn.type }, styles.functionCall),
		-- @operator               symbolic operators (e.g. `+`, `*`)
		["@operator"] = { fg = theme.syn.operator },
		--
		-- @keyword                keywords not fitting into specific categories
		-- @keyword.coroutine      keywords related to coroutines (e.g. `go` in Go, `async/await` in Python)
		-- @keyword.function       keywords that define a function (e.g. `func` in Go, `def` in Python)
		-- @keyword.operator       operators that are English words (e.g. `and`, `or`)
		["@keyword.operator"] = vim.tbl_extend("force", { fg = theme.syn.operator }, styles.keywordOperator),
		-- @keyword.import         keywords for including modules (e.g. `import`, `from` in Python)
		["@keyword.import"] = { fg = theme.syn.preproc },
		-- @keyword.type           keywords defining composite types (e.g. `struct`, `enum`)
		-- @keyword.modifier       keywords defining type modifiers (e.g. `const`, `static`, `public`)
		-- @keyword.repeat         keywords related to loops (e.g. `for`, `while`)
		-- @keyword.return         keywords like `return` and `yield`
		["@keyword.return"] = vim.tbl_extend("force", { fg = theme.syn.keyword }, styles.controlFlow),
		-- @keyword.debug          keywords related to debugging
		-- @keyword.exception      keywords related to exceptions (e.g. `throw`, `catch`)
		["@keyword.exception"] = vim.tbl_extend("force", { fg = theme.syn.keyword }, styles.controlFlow),
		["@keyword.conditional"] = vim.tbl_extend("force", { fg = theme.syn.statement }, styles.controlFlow),
		["@keyword.repeat"] = vim.tbl_extend("force", { fg = theme.syn.statement }, styles.controlFlow),

		-- @keyword.conditional         keywords related to conditionals (e.g. `if`, `else`)
		-- @keyword.conditional.ternary ternary operator (e.g. `?`, `:`)
		--
		-- @keyword.directive           various preprocessor directives and shebangs
		-- @keyword.directive.define    preprocessor definition directives
		--
		-- @punctuation.delimiter  delimiters (e.g. `;`, `.`, `,`)
		["@punctuation.delimiter"] = { fg = theme.syn.punct },
		-- @punctuation.bracket    brackets (e.g. `()`, `{}`, `[]`)
		["@punctuation.bracket"] = { fg = theme.syn.punct },
		-- @punctuation.special    special symbols (e.g. `{}` in string interpolation)
		["@punctuation.special"] = { fg = theme.syn.symbol },
		-- @comment                line and block comments
		["@comment"] = vim.tbl_extend("force", { fg = theme.syn.comment }, styles.comment),
		-- @comment.documentation  comments documenting code
		["@comment.documentation"] = vim.tbl_extend("force", { fg = theme.syn.docstring }, styles.documentation),
		-- @comment.error          error-type comments (e.g. `ERROR`, `FIXME`)
		["@comment.error"] = vim.tbl_extend("force", { fg = theme.ui.bg, bg = theme.diag.error }, styles.commentMarker),
		-- @comment.warning        warning-type comments (e.g. `WARNING`, `FIX`, `HACK`)
		["@comment.warning"] = vim.tbl_extend(
			"force",
			{ fg = theme.ui.bg, bg = theme.diag.warning },
			styles.commentMarker
		),
		-- @comment.note           note-type comments (e.g. `NOTE`, `INFO`, `XXX`)
		["@comment.note"] = vim.tbl_extend("force", { fg = theme.ui.bg, bg = theme.diag.hint }, styles.commentMarker),
		-- @comment.todo           todo-type comments (e.g. `TODO`)
		["@comment.todo"] = vim.tbl_extend("force", { fg = theme.ui.bg, bg = theme.diag.info }, styles.commentMarker),

		-- @markup.strong          bold text
		["@markup.strong"] = vim.tbl_extend("force", {}, styles.markupStrong),
		-- @markup.italic          italic text
		["@markup.italic"] = vim.tbl_extend("force", {}, styles.markupItalic),
		-- @markup.strikethrough   struck-through text
		["@markup.strikethrough"] = vim.tbl_extend("force", {}, styles.markupStrike),
		-- @markup.underline       underlined text (only for literal underline markup!)
		["@markup.underline"] = vim.tbl_extend("force", {}, styles.markupUnderline),
		--
		-- @markup.heading         headings, titles (including markers)
		["@markup.heading"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow1 }, styles.renderedHeading),
		["@markup.heading.1"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow1 }, styles.renderedHeading),
		["@markup.heading.2"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow2 }, styles.renderedHeading),
		["@markup.heading.3"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow3 }, styles.renderedHeading),
		["@markup.heading.4"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow4 }, styles.renderedHeading),
		["@markup.heading.5"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow5 }, styles.renderedHeading),
		["@markup.heading.6"] = vim.tbl_extend("force", { fg = theme.rainbow.rainbow6 }, styles.renderedHeading),

		-- @markup.quote           block quotes
		["@markup.quote"] = vim.tbl_extend("force", { fg = theme.syn.punct }, styles.markupQuote),
		-- @markup.math            math environments (e.g. `$ ... $` in LaTeX)
		["@markup.math"] = { fg = theme.syn.constant },
		-- @markup.environment     environments (e.g. in LaTeX)
		["@markup.environment"] = { fg = theme.syn.keyword },
		--
		["@markup.link"] = { link = "Underlined" },
		["@markup.link.url"] = { link = "Underlined" },
		-- @markup.link.label      links in reference descriptions
		["@markup.link.label"] = vim.tbl_extend("force", { fg = theme.syn.special3 }, styles.linkLabel),
		-- @markup.raw             literal or verbatim text (e.g. inline code)
		["@markup.raw"] = { fg = theme.syn.string },
		-- @markup.raw.block       literal or verbatim text as a stand-alone block
		--
		-- @markup.list            list markers
		-- @markup.list.checked    checked todo-style list markers
		-- @markup.list.unchecked  unchecked todo-style list markers
		--
		-- @diff.plus              added text (for diff files)
		["@diff.plus"] = { fg = theme.vcs.added },
		-- @diff.minus             deleted text (for diff files)
		["@diff.minus"] = { fg = theme.vcs.removed },
		-- @diff.delta             changed text (for diff files)
		["@diff.delta"] = { fg = theme.vcs.changed },
		--
		-- @tag                    XML-style tag names (e.g. in XML, HTML, etc.)
		["@tag"] = { fg = theme.syn.tag },
		-- @tag.builtin            XML-style tag names (e.g. HTML5 tags)
		-- @tag.attribute          XML-style tag attributes
		["@tag.attribute"] = { fg = theme.syn.attribute },
		-- @tag.delimiter          XML-style tag delimiters
		["@tag.delimiter"] = { fg = theme.syn.punct },
	}
end

return M
