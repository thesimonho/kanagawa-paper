import type { Theme, Variant } from "../../shared/theme.ts";
import { alpha } from "../../shared/color/expression.ts";
import type schema from "./theme.schema.json";

type StyleKey = keyof typeof schema.definitions.ThemeStyleContent.properties;
type Highlight = { color: string; font_style?: "italic"; font_weight?: 700 };
type Style = Partial<
  Record<Exclude<StyleKey, "syntax" | "players" | "accents">, string>
> & {
  syntax: Record<string, Highlight>;
  players: { cursor: string; background: string; selection: string }[];
  accents: string[];
};

/** Zed-specific mappings. Unsupported scopes inherit Zed's normal fallback. */
export function zedTheme(theme: Theme, variant: Variant) {
  const { ui, syntax, status, changes, terminal } = theme;
  const style: Style = {
    background: ui.surface.editor.background,
    "surface.background": ui.surface.tones.m1,
    "elevated_surface.background": ui.surface.floating.background,
    border: ui.border.default,
    "border.variant": ui.border.separator,
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
    "icon.accent": theme.accents.primary,
    "editor.background": ui.surface.editor.background,
    "editor.foreground": ui.text.primary,
    "editor.gutter.background": ui.editor.gutter.background,
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
    "search.match_background": ui.search.match.background,
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
    "ghost_element.hover": ui.surface.tones.p1,
    "ghost_element.selected": ui.menu.selected.background,
    "scrollbar.thumb.background": alpha(ui.scrollbar.thumb, "80"),
    "scrollbar.thumb.hover_background": ui.scrollbar.thumb,
    "scrollbar.track.background": ui.surface.editor.background,
    "terminal.background": ui.surface.editor.background,
    "terminal.foreground": ui.text.primary,
    "terminal.bright_foreground": ui.text.contrast,
    "terminal.dim_foreground": ui.text.muted,
    created: changes.added.base,
    "created.background": changes.added.region,
    deleted: changes.removed.base,
    "deleted.background": changes.removed.region,
    modified: changes.modified.base,
    "modified.background": changes.modified.region,
    conflict: status.warning.base,
    "conflict.background": changes.conflict.ours,
    ignored: ui.text.muted,
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
      hint: { color: status.hint.base },
      keyword: { color: syntax.keyword },
      label: { color: syntax.statement },
      link_text: { color: theme.accents.special.two },
      link_uri: { color: theme.accents.special.two },
      number: { color: syntax.number },
      operator: { color: syntax.operator },
      predictive: { color: syntax.comment },
      preproc: { color: syntax.preprocessor },
      property: { color: syntax.member },
      punctuation: { color: syntax.punctuation },
      string: { color: syntax.string },
      "string.escape": { color: syntax.regex },
      "string.regex": { color: syntax.regex },
      "string.special": { color: theme.accents.special.one },
      tag: { color: syntax.statement },
      title: { color: ui.heading.primary },
      type: { color: syntax.type },
      variable: { color: syntax.variable },
      "variable.parameter": { color: syntax.parameter },
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
