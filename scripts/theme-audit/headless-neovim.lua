vim.schedule(function()
  local ok, err = pcall(function()
    local root = vim.env.THEME_AUDIT_ROOT
    local variant = vim.env.THEME_AUDIT_VARIANT
    local build = vim.fn.resolve(vim.fn.fnamemodify(root .. "/../../dist/neovim", ":p"))
    vim.opt.runtimepath:prepend(build)
    for name in pairs(package.loaded) do
      if name == "kanagawa-paper" or name:match("^kanagawa%-paper%.") then package.loaded[name] = nil end
    end
    local theme_source = debug.getinfo(require("kanagawa-paper").load, "S").source:sub(2)
    assert(vim.fn.resolve(theme_source):sub(1, #build) == build, "Theme module did not load from local build")
    vim.cmd.colorscheme("kanagawa-paper-" .. variant)
    vim.cmd.edit(vim.fn.fnameescape(root .. "/fixtures/" .. vim.env.THEME_AUDIT_FIXTURE))
    local parser = vim.treesitter.get_parser(0)
    assert(parser, "No Tree-sitter parser for this fixture")
    parser:parse()
    vim.treesitter.start(0)
    vim.cmd.redraw()
    local timeout = tonumber(vim.env.THEME_AUDIT_TIMEOUT)
    local ready = vim.wait(timeout, function()
      for row = 0, vim.api.nvim_buf_line_count(0) - 1 do
        local line = vim.api.nvim_buf_get_lines(0, row, row + 1, false)[1]
        for col = 0, #line - 1 do
          if #vim.inspect_pos(0, row, col).treesitter > 0 then return true end
        end
      end
      return false
    end, 100)
    assert(ready, "No Tree-sitter highlights within readiness timeout")
    local report = dofile(root .. "/neovim.lua").collect(
      "Kanagawa Paper " .. (variant == "ink" and "Ink" or "Canvas"), vim.env.THEME_AUDIT_OUTPUT)
    report.collection.mode = "headless"
    report.collection.themeSource = theme_source
    report.collection.treeSitterReady = true
    -- Syntax collection can succeed without LSP semantic support. Keep that limit explicit.
    report.collection.semanticTokensObserved = false
    for _, observation in ipairs(report.observations) do
      if #(observation.classifications.semantic_tokens or {}) > 0 then report.collection.semanticTokensObserved = true end
    end
    local output = vim.env.THEME_AUDIT_OUTPUT .. "/neovim-" .. report.fixture .. ".json"
    vim.fn.writefile({ vim.json.encode(report) }, output)
  end)
  if not ok then
    vim.api.nvim_err_writeln(tostring(err))
    vim.cmd("cquit 1")
  else vim.cmd("qa!") end
end)
