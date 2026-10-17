-- Verify the actual headless rendered grid with installed parser dependencies.
local theme = assert(arg[1], "assembled theme runtime required")
local query_runtime = assert(arg[2], "parser query runtime required")
local parser_runtime = assert(arg[3], "parser runtime required")
local responses = {}
local unpacker = vim.mpack.Unpacker()
local child = vim.fn.jobstart({ vim.v.progpath, "--embed", "--clean", "-i", "NONE", "-n" }, {
	env = { NVIM_LOG_FILE = "/dev/null" },
	on_stdout = function(_, data)
		for i, s in ipairs(data) do
			data[i] = s:gsub("\n", "\0")
		end
		local bytes, position = table.concat(data, "\n"), 1
		while position <= #bytes do
			local value, next_position = unpacker(bytes, position)
			position = next_position
			if value and value[1] == 1 then
				responses[value[2]] = value
			end
		end
	end,
})
assert(child > 0, "could not start embedded Neovim")
local sequence = 0
local function rpc(method, arguments)
	sequence = sequence + 1
	vim.fn.chansend(child, vim.mpack.encode({ 0, sequence, method, arguments }))
	assert(
		vim.wait(3000, function()
			return responses[sequence] ~= nil
		end, 10),
		method .. " timed out"
	)
	local result = responses[sequence]
	responses[sequence] = nil
	assert(result[3] == vim.NIL, vim.inspect(result))
	return result[4]
end
local function lua(code, arguments)
	return rpc("nvim_exec_lua", { code, arguments or {} })
end
local ok, failure = pcall(function()
	rpc("nvim_ui_attach", { 140, 50, { ext_linegrid = true, rgb = true, ext_messages = true } })
	vim.wait(100)
	lua(
		[[local theme, query_runtime, parser_runtime = ...
    vim.opt.runtimepath:prepend(theme)
    vim.opt.runtimepath:append(query_runtime)
    vim.opt.runtimepath:append(parser_runtime)
    vim.o.number = false; vim.o.relativenumber = false
    vim.o.signcolumn = 'no'; vim.o.foldcolumn = '0'; vim.o.wrap = false
  ]],
		{ theme, query_runtime, parser_runtime }
	)
	local fixtures = {
		python = {
			lines = {
				"@decorate(factory())",
				"class Box[T]: pass",
				"def f(x: Annotated[Tensor, validate()]): pass",
				"@staticmethod",
				"def static(): pass",
				"type Generic[T] = list[T]",
				"runtime = consume(Tensor)",
				"indexed = Tensor[index]",
				"def h(value: list[Tensor]) -> Tensor: pass",
				"def literal(value: Literal[True, False]): pass",
				'def formatted(value: f"{validate()}"): pass',
				"def member(x: factory().Type): pass",
				"def metadata(x: Annotated[Tensor, factory().metadata]): pass",
				"def qualified(x: package.module.Type): pass",
				"def method(x: Annotated[Tensor, obj.validate()]): pass",
				'def forward(x: "Tensor"): pass',
				'T = TypeVar("T")',
				'UserId = NewType("UserId", int)',
				"Alias: TypeAlias = list[Tensor]",
				"ALL_CAPS: TypeAlias = list[Tensor]",
			},
			checks = {
				{ 1, "decorate", "italic" },
				{ 1, "factory", "bold" },
				{ 2, "Box", "bold" },
				{ 2, "T", "bold" },
				{ 3, "Annotated", "italic" },
				{ 3, "Tensor", "italic" },
				{ 3, "validate", "bold" },
				{ 4, "staticmethod", "italic" },
				{ 5, "static", "bold" },
				{ 6, "Generic", "bold" },
				{ 6, "T] =", "bold" },
				{ 6, "list", "italic" },
				{ 6, "list[T]", "italic", 5 },
				{ 7, "Tensor", "plain" },
				{ 8, "Tensor", "plain" },
				{ 8, "[", "plain" },
				{ 9, "list", "italic" },
				{ 9, "[", "italic" },
				{ 9, "]", "italic" },
				{ 10, "True", "plain" },
				{ 10, "False", "plain" },
				{ 11, "validate", "bold" },
				{ 12, "factory", "bold" },
				{ 13, "factory", "bold" },
				{ 12, "Type", "italic" },
				{ 13, "factory().metadata", "italic", 10 },
				{ 14, "package", "plain" },
				{ 14, "module", "plain" },
				{ 14, ".", "plain" },
				{ 14, "Type", "italic" },
				{ 15, "validate", "bold" },
				{ 15, "obj", "plain" },
				{ 16, '"Tensor"', "italic" },
				{ 17, "T", "bold", 0, "@type.definition" },
				{ 18, "UserId", "bold", 0, "@type.definition" },
				{ 19, "Alias", "bold", 0, "@type.definition" },
				{ 20, "ALL_CAPS", "bold", 0, "@type.definition" },
			},
		},
		typescript = {
			lines = {
				"type StylePolicy = Record<string, object>",
				"class Box<T> { item: T }",
				"const made = new Box<string>()",
				"const result = Object.values(style)",
				"interface Face { value: string }",
				"function convert<T>(value: T): T { return value }",
			},
			checks = {
				{ 1, "StylePolicy", "bold" },
				{ 1, "Record", "italic" },
				{ 1, "string", "italic" },
				{ 2, "Box", "bold" },
				{ 2, "T>", "bold" },
				{ 2, "item: T", "italic", 6 },
				{ 3, "Box", "bold" },
				{ 4, "Object", "plain" },
				{ 4, "values", "bold" },
				{ 5, "Face", "bold" },
				{ 5, "string", "italic" },
				{ 6, "T>", "bold" },
			},
		},
	}
	fixtures.tsx = fixtures.typescript
	for _, variant in ipairs({ "ink", "canvas" }) do
		lua(
			[[local variant = ...; require('kanagawa-paper').setup({_theme=variant,cache=false});require('kanagawa-paper').load()]],
			{ variant }
		)
		for _, language in ipairs({ "python", "typescript", "tsx" }) do
			local fixture = fixtures[language]
			lua(
				[[local language, lines = ...
        local buffer = vim.api.nvim_create_buf(false,true)
        vim.api.nvim_set_current_buf(buffer)
        vim.api.nvim_buf_set_lines(buffer,0,-1,false,lines)
        vim.treesitter.start(buffer,language)
      ]],
				{ language, fixture.lines }
			)
			rpc("nvim_command", { "redraw!" })
			vim.wait(50)
			for _, check in ipairs(fixture.checks) do
				local row, token, expected, offset, foreground_group = unpack(check)
				local column = assert(fixture.lines[row]:find(token, 1, true)) - 1 + (offset or 0)
				local cell = rpc("nvim__inspect_cell", { 1, row - 1, column })
				local attributes = cell[2]
				if foreground_group then
					local original = rpc("nvim_get_hl", { 0, { name = foreground_group, link = false } })
					assert(
						attributes.foreground == original.fg,
						variant .. " " .. token .. " definition foreground changed"
					)
				end
				assert(
					(attributes.bold == true) == (expected == "bold")
						and (attributes.italic == true) == (expected == "italic"),
					variant .. " " .. language .. " " .. token .. " expected " .. expected .. ": " .. vim.inspect(cell)
				)
			end
			print(variant .. " " .. language .. ": " .. #fixture.checks .. " rendered-grid checks passed")
		end
	end
end)
vim.fn.jobstop(child)
assert(ok, failure)
