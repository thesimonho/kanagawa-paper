/** Omitted attributes inherit; false explicitly disables an attribute. */
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

const plain = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
} as const;

/** Presentation policy; editor classifications and color choices stay in adapters. */
export const textStyles = {
  // Syntax roles retain the existing Neovim configuration names.
  comment: { ...plain, italic: true },
  functions: { ...plain, bold: true },
  functionDeclaration: { ...plain, bold: true },
  functionCall: { ...plain, bold: true },
  functionReference: { ...plain },
  typeDeclaration: { ...plain, bold: true },
  typeAnnotation: { ...plain, italic: true },
  annotation: { ...plain, italic: true },
  keyword: { ...plain },
  statement: { ...plain },
  type: {},
  escape: { ...plain },
  boolean: { ...plain },
  builtinVariable: { ...plain },
  builtinType: { ...plain },
  builtinMember: { ...plain },
  keywordOperator: { ...plain },
  controlFlow: { ...plain, bold: true },
  readonlyFunction: { ...plain, bold: true },
  documentation: { ...plain, italic: true },
  commentMarker: { ...plain },
  section: { ...plain },
  attribute: { ...plain },
  important: { ...plain },

  // Markup semantics and rendered document treatments.
  markupStrong: { bold: true },
  markupItalic: { italic: true },
  markupQuote: { italic: true },
  markupStrike: { ...plain },
  markupUnderline: { ...plain },
  inlineCode: { ...plain },
  link: { ...plain },
  linkLabel: { ...plain },
  renderedHeading: { ...plain, bold: true },

  // UI states shared across core and plugin integrations.
  activeLineNumber: { ...plain, bold: true },
  title: { ...plain, bold: true },
  treeRoot: { ...plain, bold: true },
  openedFile: { ...plain, bold: true },
  executableFile: { ...plain },
  activeTab: { ...plain, bold: true },
  inactiveTab: { ...plain },
  tabNumber: { ...plain },
  modeIndicator: { ...plain, bold: true },
  inactiveStatusline: { ...plain },
  jumpLabel: { ...plain, bold: true },
  jumpPreview: { ...plain },
  searchMatch: { ...plain },
  matchedBracket: { ...plain },
  concealed: { ...plain },
  diffText: { ...plain },
  deletedText: { ...plain },
  conflictMarker: { ...plain },
  reference: { ...plain },
  inlayHint: { ...plain, italic: true },
  signatureParameter: { ...plain, bold: true },
  codeLens: { ...plain, italic: true },
  deprecated: { strikethrough: true },
  indentContext: { ...plain },
  cursorWord: { ...plain },
  testEmphasis: { ...plain },
  testFocused: { ...plain, bold: true },
  testMarked: { ...plain, bold: true },
  testStructure: { ...plain },
  debuggerValue: { ...plain },
  breakpoint: { ...plain },
  detailLabel: { ...plain, italic: true },
  changedItem: { ...plain },
  faint: { ...plain },
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
  if (style.underline === true || style.strikethrough === true)
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
