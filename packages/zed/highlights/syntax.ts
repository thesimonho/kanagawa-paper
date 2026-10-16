import type { Theme } from "../../../shared/theme.ts";
import { zedStyle, type StylePolicy } from "../../../shared/styles.ts";

type Highlight = {
  color: string;
  font_style?: "italic" | "normal";
  font_weight?: 700 | 400;
};

export function zedSyntaxColors(theme: Theme, styles: StylePolicy) {
  const { ui, syntax, status, changes } = theme;
  const highlights: Record<string, Highlight> = {
    attribute: { color: syntax.attribute, ...zedStyle(styles.annotation) },
    "type.annotation": {
      color: syntax.type,
      ...zedStyle(styles.typeAnnotation),
    },
    boolean: { color: syntax.constant },
    comment: { color: syntax.comment, ...zedStyle(styles.comment) },
    "comment.doc": {
      color: syntax.documentation,
      ...zedStyle(styles.documentation),
    },
    "string.documentation": {
      color: syntax.string,
      ...zedStyle(styles.documentation),
    },
    "string.doc": { color: syntax.string, ...zedStyle(styles.documentation) },
    constant: { color: syntax.constant },
    constructor: { color: syntax.type, ...zedStyle(styles.functionCall) },
    embedded: { color: syntax.identifier },
    emphasis: { color: ui.text.primary, ...zedStyle(styles.markupItalic) },
    "emphasis.strong": {
      color: ui.text.primary,
      ...zedStyle(styles.markupStrong),
    },
    enum: { color: syntax.type, ...zedStyle(styles.type) },
    function: { color: syntax.function, ...zedStyle(styles.functions) },
    "function.builtin": {
      color: syntax.builtinFunction,
      ...zedStyle(styles.functions),
    },
    "function.call": {
      color: syntax.function,
      ...zedStyle(styles.functionCall),
    },
    "function.method.call": {
      color: syntax.function,
      ...zedStyle(styles.functionCall),
    },
    "type.definition": {
      color: syntax.type,
      ...zedStyle(styles.typeDeclaration),
    },
    "keyword.control": {
      color: syntax.keyword,
      ...zedStyle(styles.controlFlow),
    },
    hint: { color: status.hint.base },
    keyword: { color: syntax.keyword },
    "keyword.import": { color: syntax.preprocessor },
    label: { color: syntax.statement },
    link_text: { color: theme.accents.special.two },
    link_uri: { color: theme.accents.special.two },
    number: { color: syntax.number },
    namespace: { color: syntax.keyword },
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
    "punctuation.special": { color: syntax.symbol },
    selector: { color: syntax.selector },
    "selector.pseudo": { color: syntax.attribute },
    string: { color: syntax.string },
    "string.escape": {
      color: syntax.regex,
      ...zedStyle(styles.escape),
    },
    "string.regex": { color: syntax.regex },
    "string.special": { color: theme.accents.special.one },
    "string.special.symbol": { color: syntax.symbol },
    "text.literal": { color: syntax.string },
    tag: { color: syntax.tag },
    title: { color: theme.rainbow[1], ...zedStyle(styles.renderedHeading) },
    type: { color: syntax.type, ...zedStyle(styles.type) },
    variable: { color: syntax.variable },
    "variable.parameter": { color: syntax.parameter },
    "variable.special": { color: syntax.constant },
    variant: { color: syntax.type, ...zedStyle(styles.type) },
    "diff.plus": { color: changes.added.base },
    "diff.minus": { color: changes.removed.base },
  };
  for (const [scope, highlight] of Object.entries(highlights)) {
    if (highlight.color.toLowerCase() === "none") delete highlights[scope];
  }
  return highlights;
}
