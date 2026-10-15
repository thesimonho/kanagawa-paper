dofile("scripts/bootstrap.lua").setup()

local native_assert = assert

package.preload["lazy.core.config"] = function()
	return {
		plugins = {
			["lazy.nvim"] = {},
			["mini.nvim"] = {},
		},
	}
end

local total_cases = 0
local failed_cases = {}
local context_stack = {
	{
		name = "",
		before_each = {},
		after_each = {},
	},
}

local function serialize(value)
	return vim.inspect(value)
end

local function fail(message, level)
	error(message, (level or 1) + 1)
end

local function same(expected, actual)
	if vim.deep_equal(expected, actual) then
		return
	end

	fail("expected " .. serialize(expected) .. ", got " .. serialize(actual), 2)
end

local function is_true(value, message)
	if value == true then
		return
	end

	fail(message or "expected true, got " .. serialize(value), 2)
end

local function is_false(value, message)
	if value == false then
		return
	end

	fail(message or "expected false, got " .. serialize(value), 2)
end

local function is_function(value, message)
	if type(value) == "function" then
		return
	end

	fail(message or "expected function, got " .. type(value), 2)
end

local assertions = {
	same = same,
	is_true = is_true,
	is_false = is_false,
	is_function = is_function,
}

assertions.is = {
	["true"] = is_true,
	["false"] = is_false,
	["function"] = is_function,
}

_G.assert = setmetatable(assertions, {
	__call = function(_, ...)
		return native_assert(...)
	end,
})

local function current_context()
	return context_stack[#context_stack]
end

local function collect_hooks(name)
	local hooks = {}

	for _, context in ipairs(context_stack) do
		for _, hook in ipairs(context[name]) do
			table.insert(hooks, hook)
		end
	end

	return hooks
end

local function test_name(name)
	local parts = {}

	for _, context in ipairs(context_stack) do
		if context.name ~= "" then
			table.insert(parts, context.name)
		end
	end
	table.insert(parts, name)

	return table.concat(parts, " > ")
end

function _G.describe(name, callback)
	table.insert(context_stack, {
		name = name,
		before_each = {},
		after_each = {},
	})

	local ok, err = pcall(callback)
	table.remove(context_stack)

	if not ok then
		table.insert(failed_cases, {
			name = name,
			err = err,
		})
	end
end

function _G.it(name, callback)
	total_cases = total_cases + 1
	local before_each_hooks = collect_hooks("before_each")
	local after_each_hooks = collect_hooks("after_each")
	local full_name = test_name(name)

	local ok, err = xpcall(function()
		for _, hook in ipairs(before_each_hooks) do
			hook()
		end
		callback()
	end, debug.traceback)

	for _, hook in ipairs(after_each_hooks) do
		local hook_ok, hook_err = xpcall(hook, debug.traceback)
		if ok and not hook_ok then
			ok = false
			err = hook_err
		end
	end

	if ok then
		io.write("o")
		return
	end

	io.write("x")
	table.insert(failed_cases, {
		name = full_name,
		err = err,
	})
end

function _G.before_each(callback)
	table.insert(current_context().before_each, callback)
end

function _G.after_each(callback)
	table.insert(current_context().after_each, callback)
end

local function test_files_from_args()
	local files = {}

	for _, value in ipairs(arg or {}) do
		if value:match("_spec%.lua$") then
			table.insert(files, value)
		end
	end

	if #files > 0 then
		return files
	end

	files = vim.fn.glob("tests/neovim/*_spec.lua", false, true)
	table.sort(files)
	return files
end

local function run()
	local files = test_files_from_args()

	for _, file in ipairs(files) do
		io.write("\n" .. file .. ": ")
		local ok, err = xpcall(function()
			dofile(file)
		end, debug.traceback)

		if not ok then
			table.insert(failed_cases, {
				name = file,
				err = err,
			})
		end
	end

	io.write("\n\nTotal number of cases: " .. total_cases .. "\n")
	io.write("Fails: " .. #failed_cases .. "\n")

	for _, failure in ipairs(failed_cases) do
		io.write("\n" .. failure.name .. "\n")
		io.write(failure.err .. "\n")
	end

	if #failed_cases > 0 then
		os.exit(1)
	end
end

run()
