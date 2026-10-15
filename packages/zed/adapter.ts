import type { Theme, Variant } from "../../shared/theme.ts";
import { alpha } from "../../shared/color/expression.ts";
import type schema from "./theme.schema.json";

type StyleKey = keyof typeof schema.definitions.ThemeStyleContent.properties;
type Highlight = { color: string; font_style?: "italic"; font_weight?: 700 };
type Style = Partial<
  Record<
    Exclude<
      StyleKey,
      "syntax" | "players" | "accents" | "background.appearance"
    >,
    string
  >
> & {
  "background.appearance": (typeof schema.definitions.WindowBackgroundContent.enum)[number];
  syntax: Record<string, Highlight>;
  players: { cursor: string; background: string; selection: string }[];
  accents: string[];
};

/** Zed-specific mappings. Unsupported scopes inherit Zed's normal fallback. */
export function zedTheme(theme: Theme, variant: Variant) {
  const { ui, syntax, status, changes, terminal } = theme;
  const style: Style = {
    background: ui.surface.editor.background,
    "background.appearance": "opaque",
    "surface.background": ui.surface.tones.m1,
    "elevated_surface.background": ui.surface.floating.background,
    border: ui.border.default,
    "border.variant": ui.border.separator,
    "border.disabled": ui.editor.indent.default,
    "border.transparent": alpha(ui.border.default, "00"),
    "border.focused": theme.accents.primary,
    "border.selected": theme.accents.primary,
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
    "editor.gutter.background": ui.editor.gutter.background,
    "editor.subheader.background": ui.surface.tones.m1,
    "editor.line_number": ui.editor.nontext,
    "editor.active_line_number": theme.accents.primary,
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
    "pane.focused_border": theme.accents.primary,
    "pane_group.border": ui.border.separator,
    "panel.focused_border": theme.accents.primary,
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
    conflict: status.warning.base,
    "conflict.background": status.warning.subtle,
    "conflict.border": status.warning.base,
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
        cursor: theme.modes.normal,
        background: ui.surface.editor.background,
        selection: ui.selection.background,
      },
    ],
    syntax: {
      attribute: { color: syntax.attribute },
      boolean: { color: syntax.constant },
      comment: { color: syntax.comment, font_style: "italic" },
      "comment.doc": { color: syntax.documentation },
      constant: { color: syntax.constant },
      constructor: { color: syntax.type },
      embedded: { color: syntax.identifier },
      emphasis: { color: ui.text.primary, font_style: "italic" },
      "emphasis.strong": { color: ui.text.primary, font_weight: 700 },
      enum: { color: syntax.type },
      function: { color: syntax.function },
      "function.builtin": { color: theme.accents.special.one },
      hint: { color: status.hint.base },
      keyword: { color: syntax.keyword },
      label: { color: syntax.statement },
      link_text: { color: theme.accents.special.two },
      link_uri: { color: theme.accents.special.two },
      number: { color: syntax.number },
      namespace: { color: syntax.type },
      operator: { color: syntax.operator },
      predictive: { color: syntax.comment },
      preproc: { color: syntax.preprocessor },
      primary: { color: ui.text.primary },
      property: { color: syntax.member },
      punctuation: { color: syntax.punctuation },
      "punctuation.bracket": { color: syntax.punctuation },
      "punctuation.delimiter": { color: syntax.punctuation },
      "punctuation.list_marker": { color: syntax.punctuation },
      "punctuation.markup": { color: syntax.punctuation },
      "punctuation.special": { color: syntax.punctuation },
      selector: { color: syntax.statement },
      "selector.pseudo": { color: syntax.attribute },
      string: { color: syntax.string },
      "string.escape": { color: syntax.regex },
      "string.regex": { color: syntax.regex },
      "string.special": { color: theme.accents.special.one },
      "string.special.symbol": { color: syntax.symbol },
      "text.literal": { color: syntax.string },
      tag: { color: syntax.statement },
      title: { color: ui.heading.primary },
      type: { color: syntax.type },
      variable: { color: syntax.variable },
      "variable.parameter": { color: syntax.parameter },
      "variable.special": { color: theme.accents.special.one },
      variant: { color: syntax.type },
      "diff.plus": { color: changes.added.base },
      "diff.minus": { color: changes.removed.base },
    },
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
  for (const [scope, highlight] of Object.entries(style.syntax)) {
    if (highlight.color.toLowerCase() === "none") delete style.syntax[scope];
  }
  return {
    name: `Kanagawa Paper ${variant === "ink" ? "Ink" : "Canvas"}`,
    appearance: variant === "ink" ? "dark" : "light",
    style,
  };
}
