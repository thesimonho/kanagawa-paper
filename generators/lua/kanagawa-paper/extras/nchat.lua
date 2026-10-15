local util = require("kanagawa-paper.generator_util")
local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local hex_colors = vim.deepcopy(colors)

	local function replaceHash(input)
		if type(input) == "table" then
			for key, val in pairs(input) do
				input[key] = replaceHash(val)
			end
		elseif type(input) == "string" and input:sub(1, 1) == "#" then
			return "0x" .. input:sub(2)
		end

		return input
	end

	hex_colors = replaceHash(hex_colors)

	return {
		["color"] = util.template(
			[[
default_color_bg=${ui.bg}
default_color_fg=${ui.fg}
dialog_attr=
dialog_attr_selected=reverse
dialog_color_bg=
dialog_color_fg=${ui.fg_dim}
dialog_shaded_color_bg=
dialog_shaded_color_fg=gray
entry_attr=
entry_color_bg=
entry_color_fg=
help_attr=
help_color_bg=${ui.bg_p2}
help_color_fg=${ui.fg_dim}
history_name_attr=bold
history_name_attr_selected=reverse
history_name_recv_color_bg=
history_name_recv_color_fg=${term.blue}
history_name_recv_group_color_bg=
history_name_recv_group_color_fg=usercolor
history_name_sent_color_bg=
history_name_sent_color_fg=${term.magenta}
history_text_attachment_color_bg=
history_text_attachment_color_fg=${ui.fg_dim}
history_text_attr=
history_text_attr_selected=reverse
history_text_quoted_color_bg=
history_text_quoted_color_fg=${ui.fg_dim}
history_text_reaction_color_bg=${accent.accent1}
history_text_reaction_color_fg=${ui.fg_dim}
history_text_recv_color_bg=
history_text_recv_color_fg=
history_text_recv_group_color_bg=
history_text_recv_group_color_fg=
history_text_sent_color_bg=
history_text_sent_color_fg=
list_attr=
list_attr_selected=reverse
list_color_bg=
list_color_fg=${ui.fg_dim}
list_color_unread_bg=
list_color_unread_fg=${ui.fg_dim}
listborder_attr=
listborder_color_bg=
listborder_color_fg=${ui.fg_dim}
status_attr=
status_color_bg=${ui.bg_p2}
status_color_fg=0x7aa2f7
top_attr=
top_color_bg=${ui.bg_p2}
top_color_fg=${ui.fg_dim}
  ]],
			hex_colors
		),
		["usercolor"] = util.template(
			[[
${term.red}
${term.green}
${term.yellow}
${term.blue}
${term.cyan}
${term.red}
${term.green}
${term.yellow}
${term.blue}
${term.magenta}
${term.cyan}
${ui.fg}
  ]],
			hex_colors
		),
	}
end

return M
