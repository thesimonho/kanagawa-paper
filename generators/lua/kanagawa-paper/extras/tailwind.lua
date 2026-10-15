local util = require("kanagawa-paper.generator_util")

local function build_palette_map(palette)
	-- sort keys for stable output
	local keys = {}
	for k in pairs(palette) do
		if k:sub(1, 1) ~= "_" then
			table.insert(keys, k)
		end
	end
	table.sort(keys, function(a, b)
		return a:lower() < b:lower()
	end)

	local pkg = palette["_package_name"]:lower():gsub("%s+", "-")
	local lines = {}
	for _, name in ipairs(keys) do
		local var = "--color-" .. pkg .. "-" .. util.to_kebab_case(name)
		table.insert(lines, string.format("  %s: oklch(from ${%s} l c h);", var, name))
	end

	return table.concat(lines, "\n")
end

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local tailwind = util.template(
		[[
/* ----------------------------------------------------------------------------- */
/* ${_style_name} */
/* Upstream: ${_upstream_url} */
/* URL: ${_url} */
/* ----------------------------------------------------------------------------- */

@theme inline {
  --color-${_name}-foreground: oklch(from ${ui.fg} l c h);
  --color-${_name}-background: oklch(from ${ui.bg} l c h);
  --color-${_name}-divider: oklch(from ${ui.border} l c h);
  --color-${_name}-focus: oklch(from ${ui.bg_search} l c h);
  --color-${_name}-highlight: oklch(from ${ui.bg_visual} l c h);
  --color-${_name}-comment: oklch(from ${syn.comment} l c h);

  --color-${_name}-primary: oklch(from ${modes.normal} l c h);
  --color-${_name}-secondary: oklch(from ${modes.insert} l c h);
  --color-${_name}-tertiary: oklch(from ${modes.visual} l c h);

  --color-${_name}-success: oklch(from ${diag.ok} l c h);
  --color-${_name}-warning: oklch(from ${diag.warning} l c h);
  --color-${_name}-danger: oklch(from ${diag.error} l c h);
  --color-${_name}-info: oklch(from ${diag.info} l c h);
  
  --color-${_name}-content1: oklch(from ${ui.bg} l c h);
  --color-${_name}-content2: oklch(from ${ui.bg_m1} l c h);
  --color-${_name}-content3: oklch(from ${ui.bg_m2} l c h);
  --color-${_name}-content4: oklch(from ${ui.bg_m3} l c h);
  --color-${_name}-content5: oklch(from ${ui.bg_m4} l c h);
  --color-${_name}-panel: oklch(from ${ui.float.bg} l c h);

  --color-${_name}-rainbow1: oklch(from ${rainbow.rainbow1} l c h);
  --color-${_name}-rainbow2: oklch(from ${rainbow.rainbow2} l c h);
  --color-${_name}-rainbow3: oklch(from ${rainbow.rainbow3} l c h);
  --color-${_name}-rainbow4: oklch(from ${rainbow.rainbow4} l c h);
  --color-${_name}-rainbow5: oklch(from ${rainbow.rainbow5} l c h);
  --color-${_name}-rainbow6: oklch(from ${rainbow.rainbow6} l c h);
  --color-${_name}-rainbow7: oklch(from ${rainbow.rainbow7} l c h);

  --color-${_name}-accent1: oklch(from ${accent.accent1} l c h);
  --color-${_name}-accent2: oklch(from ${accent.accent2} l c h);
  --color-${_name}-accent3: oklch(from ${accent.accent3} l c h);
  --color-${_name}-accent4: oklch(from ${accent.accent4} l c h);
  --color-${_name}-accent5: oklch(from ${accent.accent5} l c h);

  --color-${_name}-black: oklch(from ${term.black} l c h);
  --color-${_name}-black-bright: oklch(from ${term.black_bright} l c h);
  --color-${_name}-red: oklch(from ${term.red} l c h);
  --color-${_name}-red-bright: oklch(from ${term.red_bright} l c h);
  --color-${_name}-green: oklch(from ${term.green} l c h);
  --color-${_name}-green-bright: oklch(from ${term.green_bright} l c h);
  --color-${_name}-yellow: oklch(from ${term.yellow} l c h);
  --color-${_name}-yellow-bright: oklch(from ${term.yellow_bright} l c h);
  --color-${_name}-blue: oklch(from ${term.blue} l c h);
  --color-${_name}-blue-bright: oklch(from ${term.blue_bright} l c h);
  --color-${_name}-magenta: oklch(from ${term.magenta} l c h);
  --color-${_name}-magenta-bright: oklch(from ${term.magenta_bright} l c h);
  --color-${_name}-cyan: oklch(from ${term.cyan} l c h);
  --color-${_name}-cyan-bright: oklch(from ${term.cyan_bright} l c h);
  --color-${_name}-white: oklch(from ${term.white} l c h);
  --color-${_name}-white-bright: oklch(from ${term.white_bright} l c h);
}
]],
		colors
	)
	return tailwind
end

function M.generate_palette(colors)
	local template = string.format(
		[[
/* ----------------------------------------------------------------------------- */
/* ${_style_name} */
/* Upstream: ${_upstream_url} */
/* URL: ${_url} */
/* ----------------------------------------------------------------------------- */

@theme inline {
%s
}
]],
		build_palette_map(colors)
	)

	local tailwind = util.template(template, colors)
	return tailwind
end

return M
