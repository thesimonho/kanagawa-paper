local M = {}

---@param file string
function M.read(file)
	local fd = assert(io.open(file, "r"))
	---@type string
	local data = fd:read("*a")
	fd:close()
	return data
end

---@param file string
---@param contents string
function M.write(file, contents)
	vim.fn.mkdir(vim.fn.fnamemodify(file, ":h"), "p")
	local fd = assert(io.open(file, "w+"))
	fd:write(contents)
	fd:close()
end

return M
