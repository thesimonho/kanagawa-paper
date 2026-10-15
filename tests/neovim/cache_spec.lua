local Config = require("kanagawa-paper.config")
local Cache = require("kanagawa-paper.lib.cache")

describe("no cache on disabled", function()
	before_each(function()
		vim.cmd.colorscheme("default")
		Config.setup({ cache = false })
	end)

	it("on initial load", function()
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same(0, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-ink.json"))
	end)

	it("on theme change", function()
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same(0, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-ink.json"))

		vim.cmd.colorscheme("kanagawa-paper-canvas")
		assert.same(0, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-canvas.json"))
	end)
end)

describe("cache builds", function()
	before_each(function()
		vim.cmd.colorscheme("default")
		Config.setup({ cache = true })
	end)

	after_each(function()
		Cache.delete("ink")
		Cache.delete("canvas")
	end)

	it("on initial load", function()
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same(1, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-ink.json"))
	end)

	it("on theme change", function()
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same(1, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-ink.json"))

		vim.cmd.colorscheme("kanagawa-paper-canvas")
		assert.same(1, vim.fn.filereadable(vim.fn.stdpath("cache") .. "/kanagawa-paper-canvas.json"))
	end)
end)
