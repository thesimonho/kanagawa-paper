import type { Theme } from "../../../shared/theme.ts";
import { alpha } from "../../../shared/color/expression.ts";
import type schema from "../theme.schema.json";

type StyleKey = keyof typeof schema.definitions.ThemeStyleContent.properties;
type EditorStyle = Partial<
  Record<
    Exclude<
      StyleKey,
      "syntax" | "players" | "accents" | "background.appearance"
    >,
    string
  >
> & {
  "background.appearance": (typeof schema.definitions.WindowBackgroundContent.enum)[number];
  players: { cursor: string; background: string; selection: string }[];
  accents: string[];
};

export function zedEditorColors(theme: Theme) {
  const { ui, syntax, status, changes, terminal } = theme;
  const style: EditorStyle = {
    background: ui.surface.editor.background,
    "background.appearance": "opaque",
    "surface.background": ui.surface.tones.m1,
    "elevated_surface.background": ui.surface.floating.background,
    border: ui.surface.tones.m3,
    "border.variant": ui.surface.tones.m3,
    "border.disabled": ui.editor.indent.default,
    "border.transparent": alpha(ui.border.default, "00"),
    "border.focused": ui.surface.tones.m3,
    "border.selected": ui.surface.tones.m3,
    text: ui.text.primary,
    "text.muted": ui.text.secondary,
    "text.disabled": ui.text.muted,
    "text.placeholder": ui.text.muted,
    "text.accent": theme.accents.primary,
    icon: ui.text.primary,
    "icon.muted": ui.text.secondary,
    "icon.disabled": ui.text.muted,
    "icon.placeholder": ui.text.muted,
    "icon.accent": theme.accents.primary,
    "editor.background": ui.surface.editor.background,
    "editor.foreground": ui.text.primary,
    "editor.gutter.background": ui.surface.editor.background,
    "editor.subheader.background": ui.surface.tones.m1,
    "editor.line_number": ui.editor.lineNumbers.default,
    "editor.active_line_number": ui.editor.lineNumbers.active,
    "editor.active_line.background": ui.editor.currentLine.background,
    "editor.highlighted_line.background":
      ui.editor.currentLine.alternateBackground,
    "editor.indent_guide": ui.editor.indent.default,
    "editor.indent_guide_active": ui.editor.indent.active,
    "editor.invisible": ui.editor.whitespace,
    "editor.wrap_guide": ui.editor.indent.default,
    "editor.active_wrap_guide": ui.editor.indent.active,
    "editor.document_highlight.read_background": alpha(
      ui.selection.background,
      "80",
    ),
    "editor.document_highlight.write_background": alpha(
      ui.selection.background,
      "80",
    ),
    "editor.document_highlight.bracket_background": alpha(
      ui.selection.background,
      "80",
    ),
    "search.match_background": ui.search.match.background,
    "drop_target.background": alpha(theme.accents.primary, "30"),
    "pane.focused_border": ui.surface.tones.m3,
    "pane_group.border": ui.surface.tones.m3,
    "panel.focused_border": ui.surface.tones.m3,
    "panel.indent_guide": ui.editor.indent.default,
    "panel.indent_guide_active": ui.editor.indent.active,
    "panel.indent_guide_hover": ui.editor.indent.active,
    "panel.background": ui.surface.tones.m1,
    "status_bar.background": ui.statusline.background,
    "title_bar.background": ui.surface.tones.m1,
    "title_bar.inactive_background": ui.surface.tones.m2,
    "toolbar.background": ui.surface.editor.background,
    "tab_bar.background": ui.tabs.background,
    "tab.active_background": ui.tabs.selected.background,
    "tab.inactive_background": ui.tabs.inactive.background,
    "element.background": ui.surface.tones.p1,
    "element.hover": ui.surface.tones.p2,
    "element.active": ui.menu.selected.background,
    "element.selected": ui.menu.selected.background,
    "element.disabled": ui.surface.tones.m1,
    "ghost_element.background": alpha(ui.surface.editor.background, "00"),
    "ghost_element.active": ui.menu.selected.background,
    "ghost_element.disabled": alpha(ui.surface.editor.background, "00"),
    "ghost_element.hover": ui.surface.tones.p1,
    "ghost_element.selected": ui.menu.selected.background,
    "scrollbar.thumb.background": alpha(ui.scrollbar.thumb, "80"),
    "scrollbar.thumb.hover_background": ui.scrollbar.thumb,
    "scrollbar.thumb.border": alpha(ui.border.default, "00"),
    "scrollbar.track.border": alpha(ui.border.default, "00"),
    "scrollbar.track.background": ui.surface.editor.background,
    "terminal.background": ui.surface.editor.background,
    "terminal.ansi.background": ui.surface.editor.background,
    "terminal.foreground": ui.text.primary,
    "terminal.bright_foreground": ui.text.contrast,
    "terminal.dim_foreground": ui.text.muted,
    created: changes.added.base,
    "created.background": changes.added.region,
    "created.border": changes.added.base,
    deleted: changes.removed.base,
    "deleted.background": changes.removed.region,
    "deleted.border": changes.removed.base,
    modified: changes.modified.base,
    "modified.background": changes.modified.region,
    "modified.border": changes.modified.base,
    conflict: status.error.base,
    "conflict.background": status.error.subtle,
    "conflict.border": status.error.base,
    renamed: changes.text.base,
    "renamed.background": changes.text.subtle,
    "renamed.border": changes.text.base,
    hidden: ui.text.muted,
    "hidden.background": alpha(ui.surface.editor.background, "00"),
    "hidden.border": alpha(ui.border.default, "00"),
    predictive: syntax.comment,
    "predictive.background": alpha(ui.surface.editor.background, "00"),
    "predictive.border": alpha(ui.border.default, "00"),
    unreachable: syntax.deprecated,
    "unreachable.background": alpha(ui.surface.editor.background, "00"),
    "unreachable.border": alpha(ui.border.default, "00"),
    ignored: ui.text.muted,
    "ignored.background": alpha(ui.surface.editor.background, "00"),
    "ignored.border": alpha(ui.border.default, "00"),
    "link_text.hover": theme.accents.special.two,
    accents: Object.values(theme.rainbow),
    players: [
      {
        cursor: ui.text.primary,
        background: ui.surface.editor.background,
        selection: ui.selection.background,
      },
    ],
  };
  for (const name of ["error", "warning", "info", "hint", "success"] as const) {
    style[name] = status[name].base;
    style[`${name}.background`] = status[name].subtle;
    style[`${name}.border`] = status[name].base;
  }
  for (const name of [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
  ] as const) {
    style[`terminal.ansi.${name}`] = terminal.normal[name];
    style[`terminal.ansi.bright_${name}`] = terminal.bright[name];
    style[`terminal.ansi.dim_${name}`] = alpha(terminal.normal[name], "AA");
  }
  return style;
}
