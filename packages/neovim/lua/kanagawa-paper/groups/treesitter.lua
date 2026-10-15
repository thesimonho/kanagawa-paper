local M = {}

---@param colors KanagawaColors
---@param opts? KanagawaConfig
function M.setup(colors, opts)
	opts = opts or require("kanagawa-paper.config").options
	local theme = colors.theme

	return {
		-- @variable                       various variable names
		["@variable"] = { fg = theme.syn.variable },
		-- @variable.builtin (Special)     built-in variable names (e.g. `this`, `self`)
		["@variable.builtin"] = { fg = theme.syn.constant, italic = true },
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
		-- @string.regexp          regular expressions
		["@string.regexp"] = { fg = theme.syn.regex },
		-- @string.escape          escape sequences
		["@string.escape"] = vim.tbl_extend("force", { fg = theme.syn.regex }, opts.styles.escape),
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
		-- @type                   type or class definitions and annotations
		-- @type.builtin           built-in types
		-- @type.definition        identifiers in type definitions (e.g. `typedef <type> <identifier>` in C)
		--
		-- @attribute              attribute annotations (e.g. Python decorators, Rust lifetimes)
		["@attribute"] = { fg = theme.syn.attribute },
		-- @attribute.builtin      builtin annotations (e.g. `@property` in Python)
		-- @property               the key in key/value pairs
		--
		-- @function               function definitions
		-- @function.builtin       built-in functions
		["@function.builtin"] = vim.tbl_extend("force", { fg = theme.syn.fun_builtin }, opts.styles.functions),
		-- @function.call          function calls
		-- @function.macro         preprocessor macros
		--
		-- @function.method        method definitions
		-- @function.method.call   method calls
		--
		-- @constructor            constructor calls and type instantiations
		["@constructor"] = { fg = theme.syn.type },
		-- @operator               symbolic operators (e.g. `+`, `*`)
		["@operator"] = { fg = theme.syn.operator },
		--
		-- @keyword                keywords not fitting into specific categories
		-- @keyword.coroutine      keywords related to coroutines (e.g. `go` in Go, `async/await` in Python)
		-- @keyword.function       keywords that define a function (e.g. `func` in Go, `def` in Python)
		-- @keyword.operator       operators that are English words (e.g. `and`, `or`)
		["@keyword.operator"] = { fg = theme.syn.operator, bold = true },
		-- @keyword.import         keywords for including modules (e.g. `import`, `from` in Python)
		["@keyword.import"] = { fg = theme.syn.preproc },
		-- @keyword.type           keywords defining composite types (e.g. `struct`, `enum`)
		-- @keyword.modifier       keywords defining type modifiers (e.g. `const`, `static`, `public`)
		-- @keyword.repeat         keywords related to loops (e.g. `for`, `while`)
		-- @keyword.return         keywords like `return` and `yield`
		["@keyword.return"] = vim.tbl_extend("force", { fg = theme.syn.keyword }, opts.styles.keyword),
		-- @keyword.debug          keywords related to debugging
		-- @keyword.exception      keywords related to exceptions (e.g. `throw`, `catch`)
		["@keyword.exception"] = vim.tbl_extend("force", { fg = theme.syn.keyword }, opts.styles.statement),

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
		["@comment"] = vim.tbl_extend("force", { fg = theme.syn.comment }, opts.styles.comment),
		-- @comment.documentation  comments documenting code
		["@comment.documentation"] = { fg = theme.syn.docstring, italic = true },
		-- @comment.error          error-type comments (e.g. `ERROR`, `FIXME`)
		["@comment.error"] = { fg = theme.ui.bg, bg = theme.diag.error, bold = true },
		-- @comment.warning        warning-type comments (e.g. `WARNING`, `FIX`, `HACK`)
		["@comment.warning"] = { fg = theme.ui.bg, bg = theme.diag.warning, bold = true },
		-- @comment.note           note-type comments (e.g. `NOTE`, `INFO`, `XXX`)
		["@comment.note"] = { fg = theme.ui.bg, bg = theme.diag.hint, bold = true },
		-- @comment.todo           todo-type comments (e.g. `TODO`)
		["@comment.todo"] = { fg = theme.ui.bg, bg = theme.diag.info, bold = true },

		-- @markup.strong          bold text
		["@markup.strong"] = { bold = true },
		-- @markup.italic          italic text
		["@markup.italic"] = { italic = true },
		-- @markup.strikethrough   struck-through text
		["@markup.strikethrough"] = { strikethrough = true },
		-- @markup.underline       underlined text (only for literal underline markup!)
		["@markup.underline"] = { underline = true },
		--
		-- @markup.heading         headings, titles (including markers)
		["@markup.heading"] = { fg = theme.rainbow.rainbow1 },
		["@markup.heading.1"] = { fg = theme.rainbow.rainbow1 },
		["@markup.heading.2"] = { fg = theme.rainbow.rainbow2 },
		["@markup.heading.3"] = { fg = theme.rainbow.rainbow3 },
		["@markup.heading.4"] = { fg = theme.rainbow.rainbow4 },
		["@markup.heading.5"] = { fg = theme.rainbow.rainbow5 },
		["@markup.heading.6"] = { fg = theme.rainbow.rainbow6 },

		-- @markup.quote           block quotes
		["@markup.quote"] = { fg = theme.syn.punct },
		-- @markup.math            math environments (e.g. `$ ... $` in LaTeX)
		["@markup.math"] = { fg = theme.syn.constant },
		-- @markup.environment     environments (e.g. in LaTeX)
		["@markup.environment"] = { fg = theme.syn.keyword },
		--
		["@markup.link"] = { link = "Underlined" },
		["@markup.link.url"] = { link = "Underlined" },
		-- @markup.link.label      links in reference descriptions
		["@markup.link.label"] = { fg = theme.syn.special3, underline = false },
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
