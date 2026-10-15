describe("extra is loadable", function()
	local extras = require("kanagawa-paper.extras")

	for name in vim.fs.dir("generators/lua/kanagawa-paper/extras") do
		name = name:match("(.+)%.lua$")
		if name ~= "init" then
			it(name .. " has a generate function", function()
				local extra = require("kanagawa-paper.extras." .. name)
				assert.is_function(extra.generate)
			end)

			it(name .. " has a generate palette function if applicable", function()
				local extra = require("kanagawa-paper.extras." .. name)
				if extras.mapping[name].palette then
					assert.is_function(extra.generate_palette)
				end
			end)

			it(name .. " has a mapping", function()
				assert.is_true(extras.mapping[name] ~= nil)
			end)

			it(name .. " has an extension", function()
				assert.is_true(extras.mapping[name].ext ~= nil)
			end)

			it(name .. " has a url", function()
				assert.is_true(extras.mapping[name].url ~= nil)
			end)
		end
	end
end)

describe("extra generation failures", function()
	local extras = require("kanagawa-paper.extras")
	local kanagawa = require("kanagawa-paper")

	it("reports theme loading errors", function()
		local original = kanagawa.load
		kanagawa.load = function()
			error("theme load failed")
		end
		local ok, err = pcall(extras.setup, vim.fn.tempname())
		kanagawa.load = original
		assert.is_false(ok)
		assert.is_true(tostring(err):find("theme load failed", 1, true) ~= nil)
	end)

	it("reports generator errors instead of leaving stale output", function()
		local extra = require("kanagawa-paper.extras.alacritty")
		local original = extra.generate
		extra.generate = function()
			error("template failed")
		end
		local ok, err = pcall(extras.setup, vim.fn.tempname())
		extra.generate = original
		assert.is_false(ok)
		assert.is_true(tostring(err):find("template failed", 1, true) ~= nil)
	end)
end)
