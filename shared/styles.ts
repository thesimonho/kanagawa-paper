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
  typeDeclaration: { ...plain, bold: true },
  keyword: { ...plain },
  statement: { ...plain },
  type: { ...plain },
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
  markupStrong: { ...plain },
  markupItalic: { ...plain },
  markupStrike: { ...plain },
  markupUnderline: { ...plain },
  inlineCode: { ...plain },
  link: { ...plain },
  linkLabel: { ...plain },
  renderedHeading: { ...plain },

  // UI states shared across core and plugin integrations.
  activeLineNumber: { ...plain },
  title: { ...plain },
  treeRoot: { ...plain },
  openedFile: { ...plain },
  executableFile: { ...plain },
  activeTab: { ...plain },
  inactiveTab: { ...plain },
  tabNumber: { ...plain },
  modeIndicator: { ...plain },
  inactiveStatusline: { ...plain },
  jumpLabel: { ...plain },
  jumpPreview: { ...plain },
  searchMatch: { ...plain },
  matchedBracket: { ...plain },
  concealed: { ...plain },
  diffText: { ...plain },
  deletedText: { ...plain },
  conflictMarker: { ...plain },
  reference: { ...plain },
  inlayHint: { ...plain },
  signatureParameter: { ...plain },
  codeLens: { ...plain },
  deprecated: { strikethrough: true },
  indentContext: { ...plain },
  cursorWord: { ...plain },
  testEmphasis: { ...plain },
  testFocused: { ...plain },
  testMarked: { ...plain },
  testStructure: { ...plain },
  debuggerValue: { ...plain },
  breakpoint: { ...plain },
  detailLabel: { ...plain },
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
