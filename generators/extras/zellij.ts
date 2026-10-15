import type { Theme } from "../../shared/theme.ts";
import type { Metadata } from "../registry.ts";
const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `// -----------------------------------------------------------------------------
// \${_style_name}
// Upstream: \${_upstream_url}
// URL: \${_url}
// -----------------------------------------------------------------------------

themes {
    ${meta.name} {
        text_unselected {
            base ${rgb(theme.ui.text.primary)}
            background 0
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        text_selected {
            base ${rgb(theme.ui.text.primary)}
            background ${rgb(theme.ui.editor.currentLine.background)}
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        ribbon_selected {
            base ${rgb(theme.ui.surface.editor.background)}
            background ${rgb(theme.modes.normal)}
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        ribbon_unselected {
            base ${rgb(theme.ui.surface.editor.background)}
            background ${rgb(theme.modes.visual)}
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        table_title {
            base ${rgb(theme.ui.text.primary)}
            background 0
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        table_cell_selected {
            base ${rgb(theme.ui.text.primary)}
            background ${rgb(theme.ui.editor.currentLine.background)}
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        table_cell_unselected {
            base ${rgb(theme.ui.text.primary)}
            background 0
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        list_selected {
            base ${rgb(theme.ui.text.primary)}
            background ${rgb(theme.ui.editor.currentLine.background)}
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        list_unselected {
            base ${rgb(theme.ui.text.primary)}
            background 0
            emphasis_0 ${rgb(theme.rainbow[1])}
            emphasis_1 ${rgb(theme.rainbow[2])}
            emphasis_2 ${rgb(theme.rainbow[3])}
            emphasis_3 ${rgb(theme.rainbow[4])}
        }
        frame_selected {
            base ${rgb(theme.modes.visual)}
            background 0
            emphasis_0 0
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        frame_highlight {
            base ${rgb(theme.modes.insert)}
            background 0
            emphasis_0 0
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        exit_code_success {
            base ${rgb(theme.status.success.base)}
            background 0
            emphasis_0 ${rgb(theme.status.success.subtle)}
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        exit_code_error {
            base ${rgb(theme.status.error.base)}
            background 0
            emphasis_0 ${rgb(theme.status.error.subtle)}
            emphasis_1 0
            emphasis_2 0
            emphasis_3 0
        }
        multiplayer_user_colors {
            player_1 ${rgb(theme.rainbow[1])}
            player_2 ${rgb(theme.rainbow[2])}
            player_3 ${rgb(theme.rainbow[3])}
            player_4 ${rgb(theme.rainbow[4])}
            player_5 ${rgb(theme.rainbow[5])}
            player_6 ${rgb(theme.rainbow[6])}
            player_7 ${rgb(theme.rainbow[7])}
            player_8 ${rgb(theme.accents.primary)}
            player_9 ${rgb(theme.accents.secondary)}
            player_10 ${rgb(theme.accents.tertiary)}
        }
    }
}

`,
  };
}
