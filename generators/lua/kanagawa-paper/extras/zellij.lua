local util = require("kanagawa-paper.generator_util")
local hex_to_rgb = require("kanagawa-paper.lib.hsluv").hex_to_rgb_full

local function format_colors(tbl)
	local output = {}
	for k, v in pairs(tbl) do
		if type(v) == "string" and v ~= "none" then
			output[k] = hex_to_rgb(v, true)
		elseif type(v) == "table" then
			format_colors(v)
		end
	end
	return output
end

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local formatted = {}
	formatted._name = colors._name
	formatted.modes = format_colors(colors.modes)
	formatted.ui = format_colors(colors.ui)
	formatted.accent = format_colors(colors.accent)
	formatted.rainbow = format_colors(colors.rainbow)
	formatted.diag = format_colors(colors.diag)

	local zellij = util.template(
		[[
// -----------------------------------------------------------------------------
// ${_style_name}
// Upstream: ${_upstream_url}
// URL: ${_url}
// -----------------------------------------------------------------------------

themes {
    ${_name} {
        text_unselected {
            base ${ui.fg}
            background 0
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        text_selected {
            base ${ui.fg}
            background ${ui.bg_cursorline}
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        ribbon_selected {
            base ${ui.bg}
            background ${modes.normal}
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        ribbon_unselected {
            base ${ui.bg}
            background ${modes.visual}
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        table_title {
            base ${ui.fg}
            background 0
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        table_cell_selected {
            base ${ui.fg}
            background ${ui.bg_cursorline}
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        table_cell_unselected {
            base ${ui.fg}
            background 0
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        list_selected {
            base ${ui.fg}
            background ${ui.bg_cursorline}
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        list_unselected {
            base ${ui.fg}
            background 0
            emphasis_0 ${rainbow.rainbow1}
            emphasis_1 ${rainbow.rainbow2}
            emphasis_2 ${rainbow.rainbow3}
            emphasis_3 ${rainbow.rainbow4}
        }
        frame_selected {
            base ${modes.visual}
            background 0
            emphasis_0 0
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        frame_highlight {
            base ${modes.insert}
            background 0
            emphasis_0 0
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        exit_code_success {
            base ${diag.ok}
            background 0
            emphasis_0 ${diag.ok_light}
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        exit_code_error {
            base ${diag.error}
            background 0
            emphasis_0 ${diag.error_light}
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        multiplayer_user_colors {
            player_1 ${rainbow.rainbow1}
            player_2 ${rainbow.rainbow2}
            player_3 ${rainbow.rainbow3}
            player_4 ${rainbow.rainbow4}
            player_5 ${rainbow.rainbow5}
            player_6 ${rainbow.rainbow6}
            player_7 ${rainbow.rainbow7}
            player_8 ${accent.accent1}
            player_9 ${accent.accent2}
            player_10 ${accent.accent3}
        }
    }
}

]],
		formatted
	)
	return zellij
end

return M
