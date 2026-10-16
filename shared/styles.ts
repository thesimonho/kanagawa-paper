/** Omitted attributes inherit; false explicitly disables an attribute. */
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

/** Presentation policy; editor classifications and color choices stay in adapters. */
export const textStyles = {
  // Syntax roles retain the existing Neovim configuration names.
  comment: { italic: true },
  functions: { italic: false, bold: true },
  keyword: { italic: false, bold: false },
  statement: { italic: false, bold: false },
  type: { italic: false, bold: true },
  escape: { bold: true },
  boolean: { bold: true },
  builtinVariable: { italic: true },
  builtinType: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  builtinMember: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  keywordOperator: { bold: true },
  controlFlow: { bold: true },
  readonlyFunction: { bold: true },
  documentation: { italic: true },
  commentMarker: { bold: true },
  section: { bold: true },
  attribute: { italic: true },
  important: { bold: true },

  // Markup semantics and rendered document treatments.
  markupStrong: { bold: true },
  markupItalic: { italic: true },
  markupStrike: { strikethrough: true },
  markupUnderline: { underline: true },
  inlineCode: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  link: { underline: true },
  linkLabel: { underline: false },
  renderedHeading: { bold: true },

  // UI states shared across core and plugin integrations.
  activeLineNumber: { bold: true },
  title: { bold: true },
  treeRoot: { bold: true },
  openedFile: { italic: true },
  executableFile: { bold: true },
  activeTab: { bold: true },
  inactiveTab: { bold: false },
  tabNumber: { bold: true },
  modeIndicator: { bold: true },
  jumpLabel: { bold: true },
  jumpPreview: { bold: false },
  searchMatch: { bold: true },
  matchedBracket: { bold: true },
  concealed: { bold: true },
  diffText: { bold: true },
  deletedText: { strikethrough: true },
  conflictMarker: { bold: true },
  reference: { bold: false },
  inlayHint: { italic: true },
  signatureParameter: { bold: true, italic: true },
  codeLens: { italic: false },
  deprecated: { strikethrough: true },
  indentContext: { underline: true },
  cursorWord: { underline: false },
  testEmphasis: { bold: true },
  testFocused: { bold: true, underline: false },
  testMarked: { italic: true },
  testStructure: { bold: true },
  debuggerValue: { bold: true },
  breakpoint: { bold: true },
  detailLabel: { bold: true },
  changedItem: { bold: true },
  faint: { italic: false },
} satisfies Record<string, TextStyle>;

export type StylePolicy = Record<keyof typeof textStyles, TextStyle>;

/** TextMate replaces the entire font style set when any attribute is specified. */
export function textMateStyle(style: TextStyle) {
  if (Object.values(style).every((value) => value === undefined))
    return undefined;
  return [
    style.bold && "bold",
    style.italic && "italic",
    style.underline && "underline",
    style.strikethrough && "strikethrough",
  ]
    .filter(Boolean)
    .join(" ");
}

export function zedStyle(style: TextStyle) {
  if (style.underline !== undefined || style.strikethrough !== undefined)
    throw new Error(
      "Zed theme styles do not support underline or strikethrough",
    );
  return {
    ...(style.bold === undefined
      ? {}
      : { font_weight: style.bold ? (700 as const) : (400 as const) }),
    ...(style.italic === undefined
      ? {}
      : {
          font_style: style.italic ? ("italic" as const) : ("normal" as const),
        }),
  };
}

/** Semantic rules can override individual attributes without clearing the rest. */
export function semanticStyle(style: TextStyle): TextStyle {
  return { ...style };
}
