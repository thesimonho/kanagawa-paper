local Util = require("kanagawa-paper.lib.util")

local M = {}

-- map of plugin name to plugin extension
--- @type table<string, {ext:string, url:string, label?:string, subdir?: string, sep?:string, palette?:boolean}>
-- stylua: ignore
M.mapping = {
  alacritty        = { ext = "toml", url = "https://github.com/alacritty/alacritty", label = "Alacritty" },
  foot             = { ext = "ini", url= "https://codeberg.org/dnkl/foot", label = "Foot" },
  fzf              = { ext = "rc", url = "https://github.com/junegunn/fzf/tree/master#environment-variables", label = "Fzf" },
  ghostty          = { ext = "", url = "https://github.com/ghostty-org/ghostty", label = "Ghostty" },
  kitty            = { ext = "conf", url = "https://sw.kovidgoyal.net/kitty/conf.html", label = "Kitty" },
  lazygit          = { ext = "yml", url = "https://github.com/jesseduffield/lazygit", label = "lazygit" },
  nchat            = { ext = "conf", url = "https://github.com/d99kris/nchat", label = "nchat"},
  nushell          = { ext = "nu", url = "https://www.nushell.sh/", label = "Nushell" },
  tailwind         = { ext = "css", url = "https://tailwindcss.com/", label = "tailwind", palette = true },
  terminator       = { ext = "conf", url = "https://gnome-terminator.readthedocs.io/en/latest/config.html", label = "Terminator" },
  termux           = { ext = "properties", url = "https://termux.dev/", label = "Termux" },
  tilix            = { ext = "jsonc", url = "https://github.com/gnunn1/tilix", label = "Tilix" },
  wezterm          = { ext = "toml", url = "https://wezterm.org/config/appearance.html", label = "Wezterm" },
  wezterm_tabline  = { ext = "lua", url = "https://github.com/michaelbrusegard/tabline.wez", label = "Wezterm Tabline" },
  windows_terminal = { ext = "jsonc", url = "https://learn.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes", label = "Windows Terminal" },
  vscode_terminal  = { ext = "jsonc", url = "https://code.visualstudio.com/api/references/theme-color", label = "VSCode Terminal" },
  vivid            = { ext = "yml", url= "https://github.com/sharkdp/vivid", label = "Vivid" },
  zellij           = { ext = "kdl", url= "https://zellij.dev/", label = "Zellij" },
}

local function load_colors(opts)
	local kanagawa = require("kanagawa-paper")
	opts = vim.tbl_deep_extend("force", { all_plugins = true }, opts or {})
	local ok, colors, groups, kopts = pcall(function()
		return kanagawa.load(opts)
	end)
	if not ok then
		return nil, nil, nil, colors
	end
	return colors, groups, kopts, nil
end

function M.setup(output)
	output = output or (vim.uv.cwd() .. "/extras")
	vim.o.background = "dark"

	local themes = {
		ink = "Ink",
		canvas = "Canvas",
	}

	---@type string[]
	local names = vim.tbl_keys(M.mapping)
	table.sort(names)

	for _, extra in ipairs(names) do
		local info = M.mapping[extra]
		local ok_plugin, plugin = pcall(require, "kanagawa-paper.extras." .. extra)
		assert(ok_plugin, plugin)

		-- colors for each theme
		for theme, theme_name in pairs(themes) do
			local colors, groups, kopts, err = load_colors({ _theme = theme })
			assert(not err, err)

			if colors and colors.theme then
				local filename = extra
					.. (info.subdir and "/" .. info.subdir .. "/" or "")
					.. "/kanagawa-paper"
					.. (info.sep or "-")
					.. theme
					.. "."
					.. info.ext
				filename = string.gsub(filename, "%.$", "") -- remove trailing dot when no extension
				local path = output .. "/" .. filename

				local t = vim.deepcopy(colors.theme)
				t["_url"] = info.url
				t["_upstream_url"] = "https://github.com/thesimonho/kanagawa-paper/tree/main/extras/" .. filename
				t["_package_name"] = "Kanagawa Paper"
				t["_style_name"] = "Kanagawa Paper " .. theme_name
				t["_name"] = "kanagawa-paper-" .. theme
				t["_theme"] = theme

				local ok_gen, out = pcall(plugin.generate, t, groups, kopts)
				assert(ok_gen, out)
				assert(type(out) == "string" or type(out) == "table", "Invalid extra output: " .. extra)
				if ok_gen and out then
					if type(out) == "table" then
						-- Handle multiple files returned as a table: { ["suffix"] = "content" }
						for suffix, content in pairs(out) do
							local multi_filename = extra
								.. (info.subdir and "/" .. info.subdir .. "/" or "")
								.. "/kanagawa-paper"
								.. (info.sep or "-")
								.. theme
								.. (info.sep or "-")
								.. suffix
								.. "."
								.. info.ext
							multi_filename = string.gsub(multi_filename, "%.$", "")
							local multi_path = output .. "/" .. multi_filename

							print("[write] " .. multi_filename)
							Util.write(multi_path, content)
						end
					elseif type(out) == "string" then
						-- Fallback for single files
						print("[write] " .. filename)
						Util.write(path, out)
					end
				end
			end
		end

		-- palette colors, if applicable
		if info.palette == true then
			local colors, groups, kopts, err = load_colors({ _theme = "auto" })
			assert(not err, err)

			if colors and colors.palette then
				local filename = extra
					.. (info.subdir and "/" .. info.subdir .. "/" or "")
					.. "/kanagawa-paper"
					.. (info.sep or "-")
					.. "palette"
					.. "."
					.. info.ext
				filename = string.gsub(filename, "%.$", "") -- remove trailing dot when no extension
				local path = output .. "/" .. filename

				local p = vim.deepcopy(colors.palette)
				p["_url"] = info.url
				p["_upstream_url"] = "https://github.com/thesimonho/kanagawa-paper/tree/main/extras/" .. filename
				p["_package_name"] = "Kanagawa Paper"
				p["_style_name"] = "Kanagawa Paper Palette"
				p["_name"] = "kanagawa-paper-palette"
				print("[write] " .. filename)

				local ok_genp, outp = pcall(plugin.generate_palette, p, groups, kopts)
				assert(ok_genp, outp)
				assert(type(outp) == "string" or type(outp) == "table", "Invalid palette output: " .. extra)
				if ok_genp and outp then
					if type(outp) == "table" then
						for suffix, content in pairs(outp) do
							local multi_filename = extra
								.. (info.subdir and "/" .. info.subdir .. "/" or "")
								.. "/kanagawa-paper"
								.. (info.sep or "-")
								.. "palette"
								.. (info.sep or "-")
								.. suffix
								.. "."
								.. info.ext
							multi_filename = string.gsub(multi_filename, "%.$", "")
							local multi_path = output .. "/" .. multi_filename

							print("[write] " .. multi_filename)
							Util.write(multi_path, content)
						end
					elseif type(outp) == "string" then
						print("[write] " .. filename)
						Util.write(path, outp)
					end
				end
			end
		end
	end
end

return M
