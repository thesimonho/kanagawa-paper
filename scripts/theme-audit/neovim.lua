local M = {}
local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h")

-- Call inside the configured editor after its parser and language server attach.
function M.collect(theme)
  assert(type(theme) == "string" and theme ~= "", "Supply the common theme name used in both reports")
  local file = vim.api.nvim_buf_get_name(0)
  local manifest = vim.json.decode(table.concat(vim.fn.readfile(root .. "/fixtures/manifest.json"), "\n"))
  local fixture
  for _, item in ipairs(manifest) do
    if file == root .. "/fixtures/" .. item.file then fixture = item end
  end
  assert(fixture, "Open a file from the audit fixtures directory")
  assert(not vim.bo.modified, "Save the fixture before collecting")
  local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
  local source = table.concat(lines, "\n") .. (vim.bo.endofline and "\n" or "")
  assert(not source:find("[^%z\1-\127]"), "Audit fixtures must be ASCII for common column offsets")
  local observations = {}
  for _, probe in ipairs(fixture.probes) do
    local row, column
    for index, line in ipairs(lines) do
      if line:find(probe.line, 1, true) then
        assert(not row, "Ambiguous probe line: " .. probe.id)
        row = index
        column = line:find(probe.text, 1, true)
        assert(column and not line:find(probe.text, column + 1, true), "Ambiguous probe text: " .. probe.id)
      end
    end
    assert(row, "Missing probe: " .. probe.id)
    local inspection = vim.inspect_pos(0, row - 1, column - 1)
    local groups = {}
    for _, category in ipairs({ "treesitter", "semantic_tokens", "syntax", "extmarks" }) do
      for _, entry in ipairs(inspection[category] or {}) do
        local name = entry.hl_group
        if name then groups[name] = vim.api.nvim_get_hl(0, { name = name, link = false }) end
      end
    end
    observations[#observations + 1] = {
      id = probe.id, text = probe.text, row = row - 1, column = column - 1,
      classifications = inspection, candidateHighlights = groups, effective = vim.NIL,
    }
  end
  local clients = {}
  for _, client in ipairs(vim.lsp.get_clients({ bufnr = 0 })) do clients[#clients + 1] = client.name end
  local report = {
    schemaVersion = 1, editor = "neovim", version = tostring(vim.version()), theme = theme,
    fixture = fixture.file, sourceHash = vim.fn.sha256(source), observations = observations,
    collection = { languageServers = clients, colorscheme = vim.g.colors_name },
  }
  vim.fn.mkdir(root .. "/reports", "p")
  local output = root .. "/reports/neovim-" .. fixture.file .. ".json"
  vim.fn.writefile({ vim.json.encode(report) }, output)
  print(output)
  return report
end
return M
