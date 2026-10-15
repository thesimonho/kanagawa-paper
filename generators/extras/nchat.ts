import type { Theme } from "../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    color: `default_color_bg=${theme.ui.surface.editor.background}
default_color_fg=${theme.ui.text.primary}
dialog_attr=
dialog_attr_selected=reverse
dialog_color_bg=
dialog_color_fg=${theme.ui.text.secondary}
dialog_shaded_color_bg=
dialog_shaded_color_fg=gray
entry_attr=
entry_color_bg=
entry_color_fg=
help_attr=
help_color_bg=${theme.ui.surface.tones.p2}
help_color_fg=${theme.ui.text.secondary}
history_name_attr=bold
history_name_attr_selected=reverse
history_name_recv_color_bg=
history_name_recv_color_fg=${theme.terminal.normal.blue}
history_name_recv_group_color_bg=
history_name_recv_group_color_fg=usercolor
history_name_sent_color_bg=
history_name_sent_color_fg=${theme.terminal.normal.magenta}
history_text_attachment_color_bg=
history_text_attachment_color_fg=${theme.ui.text.secondary}
history_text_attr=
history_text_attr_selected=reverse
history_text_quoted_color_bg=
history_text_quoted_color_fg=${theme.ui.text.secondary}
history_text_reaction_color_bg=${theme.accents.primary}
history_text_reaction_color_fg=${theme.ui.text.secondary}
history_text_recv_color_bg=
history_text_recv_color_fg=
history_text_recv_group_color_bg=
history_text_recv_group_color_fg=
history_text_sent_color_bg=
history_text_sent_color_fg=
list_attr=
list_attr_selected=reverse
list_color_bg=
list_color_fg=${theme.ui.text.secondary}
list_color_unread_bg=
list_color_unread_fg=${theme.ui.text.secondary}
listborder_attr=
listborder_color_bg=
listborder_color_fg=${theme.ui.text.secondary}
status_attr=
status_color_bg=${theme.ui.surface.tones.p2}
status_color_fg=0x7aa2f7
top_attr=
top_color_bg=${theme.ui.surface.tones.p2}
top_color_fg=${theme.ui.text.secondary}
  `.replace(/#([0-9a-f]{6})/gi, "0x$1"),
    usercolor: `${theme.terminal.normal.red}
${theme.terminal.normal.green}
${theme.terminal.normal.yellow}
${theme.terminal.normal.blue}
${theme.terminal.normal.cyan}
${theme.terminal.normal.red}
${theme.terminal.normal.green}
${theme.terminal.normal.yellow}
${theme.terminal.normal.blue}
${theme.terminal.normal.magenta}
${theme.terminal.normal.cyan}
${theme.ui.text.primary}
  `.replace(/#([0-9a-f]{6})/gi, "0x$1"),
  };
}
