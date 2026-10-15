local Config = require("kanagawa-paper.config")

describe("plugin loads", function()
	it("did proper init", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("default")
		Config.setup()
		assert.same("default", vim.g.colors_name)
		assert.same("dark", vim.o.background)
	end)
end)

describe("auto theme respects vim.o.background", function()
	before_each(function()
		Config.setup()
	end)

	it("defaults to dark", function()
		vim.o.background = nil
		vim.cmd.colorscheme("kanagawa-paper")
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("= dark", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("kanagawa-paper")
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("= light", function()
		vim.o.background = "light"
		vim.cmd.colorscheme("kanagawa-paper")
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("switches to light", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("kanagawa-paper")
		vim.o.background = "light"
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("switches to dark", function()
		vim.o.background = "light"
		vim.cmd.colorscheme("kanagawa-paper")
		vim.o.background = "dark"
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("remembers dark", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("kanagawa-paper")
		vim.o.background = "light"
		vim.o.background = "dark"
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)

	it("remembers light", function()
		vim.o.background = "light"
		vim.cmd.colorscheme("kanagawa-paper")
		vim.o.background = "dark"
		vim.o.background = "light"
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper", vim.g.colors_name)
	end)
end)

describe("specific themes respect vim.o.background", function()
	before_each(function()
		Config.setup()
	end)

	it("dark ink stays dark", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper-ink", vim.g.colors_name)
	end)

	it("light ink changes to dark", function()
		vim.o.background = "light"
		vim.cmd.colorscheme("kanagawa-paper-ink")
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper-ink", vim.g.colors_name)
	end)

	it("post light ink changes to light", function()
		vim.cmd.colorscheme("kanagawa-paper-ink")
		vim.o.background = "light"
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper-canvas", vim.g.colors_name)
	end)

	it("light canvas stays light", function()
		vim.o.background = "light"
		vim.cmd.colorscheme("kanagawa-paper-canvas")
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper-canvas", vim.g.colors_name)
	end)

	it("dark canvas changes to light", function()
		vim.o.background = "dark"
		vim.cmd.colorscheme("kanagawa-paper-canvas")
		assert.same("light", vim.o.background)
		assert.same("kanagawa-paper-canvas", vim.g.colors_name)
	end)

	it("post dark canvas stays light", function()
		vim.cmd.colorscheme("kanagawa-paper-canvas")
		vim.o.background = "dark"
		assert.same("dark", vim.o.background)
		assert.same("kanagawa-paper-ink", vim.g.colors_name)
	end)
end)
