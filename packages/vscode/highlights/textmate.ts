import type { Theme } from "../../../shared/theme.ts";
import { textMateStyle, type StylePolicy } from "../../../shared/styles.ts";

export const vscodeTextMateColors = (theme: Theme, styles: StylePolicy) => [
  {
    name: "Comments",
    scope: ["comment", "punctuation.definition.comment"],
    settings: {
      fontStyle: textMateStyle(styles.comment),
      foreground: theme.syntax.comment,
    },
  },
  {
    name: "Comments: Documentation",
    scope: ["comment.documentation", "comment.block.documentation"],
    settings: {
      foreground: theme.syntax.documentation,
      fontStyle: textMateStyle(styles.documentation),
    },
  },
  {
    name: "Strings: Documentation",
    scope: ["string.quoted.docstring", "string.documentation"],
    settings: { fontStyle: textMateStyle(styles.documentation) },
  },
  {
    name: "Deprecated",
    scope: "invalid.deprecated",
    settings: { fontStyle: textMateStyle(styles.deprecated) },
  },
  {
    name: "Invalid - Illegal",
    scope: "invalid.illegal",
    settings: {
      foreground: theme.status.error.base,
    },
  },
  {
    name: "Operators",
    scope: "keyword.operator",
    settings: {
      foreground: theme.syntax.operator,
    },
  },
  {
    name: "Keywords",
    scope: ["keyword", "storage"],
    settings: {
      foreground: theme.syntax.keyword,
    },
  },
  {
    name: "Types",
    scope: ["storage.type", "support.type"],
    settings: {
      foreground: theme.syntax.type,
    },
  },
  {
    name: "Import Keywords",
    scope: [
      "keyword.control.import",
      "keyword.control.from",
      "keyword.control.export",
    ],
    settings: { foreground: theme.syntax.preprocessor },
  },
  {
    name: "Declaration Keywords",
    scope: [
      "storage.type.function",
      "storage.type.class",
      "storage.type.struct",
      "storage.type.enum",
      "storage.type.interface",
      "storage.type.namespace",
      "storage.type.type",
      "keyword.declaration storage.type",
      "meta.var.expr storage.type",
    ],
    settings: {
      foreground: theme.syntax.keyword,
      fontStyle: textMateStyle(styles.keyword),
    },
  },
  {
    name: "Built-in Types",
    scope: [
      "support.type.builtin",
      "support.type.primitive",
      "entity.name.type.primitive",
    ],
    settings: {
      foreground: theme.accents.special.one,
      fontStyle: textMateStyle(styles.builtinType),
    },
  },
  {
    name: "Modules",
    scope: ["entity.name.namespace", "support.type.object.module"],
    settings: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
  },
  {
    name: "Built-in Variables",
    scope: [
      "variable.language.this",
      "variable.language.special.self",
      "variable.language.special.cls",
    ],
    settings: {
      foreground: theme.syntax.constant,
      fontStyle: textMateStyle(styles.builtinVariable),
    },
  },
  {
    name: "Booleans",
    scope: ["constant.language.boolean", "constant.language.bool"],
    settings: {
      foreground: theme.syntax.constant,
      fontStyle: textMateStyle(styles.boolean),
    },
  },
  {
    name: "Language Constants",
    scope: ["constant.language", "support.constant", "variable.language"],
    settings: {
      foreground: theme.syntax.constant,
    },
  },
  {
    name: "Members",
    scope: "variable.other.property",
    settings: { foreground: theme.syntax.member },
  },
  {
    name: "Variables",
    scope: ["variable", "support.variable"],
    settings: {
      foreground: theme.ui.text.primary,
    },
  },
  {
    name: "Functions",
    scope: ["entity.name.function", "support.function"],
    settings: {
      fontStyle: textMateStyle(styles.functions),
      foreground: theme.syntax.function,
    },
  },
  {
    name: "Classes",
    scope: [
      "entity.name.type",
      "entity.other.inherited-class",
      "support.class",
    ],
    settings: {
      fontStyle: textMateStyle(styles.type),
      foreground: theme.syntax.type,
    },
  },
  {
    name: "Exceptions",
    scope: "entity.name.exception",
    settings: {
      foreground: theme.status.error.base,
    },
  },
  {
    name: "Sections",
    scope: "entity.name.section",
    settings: {
      fontStyle: textMateStyle(styles.section),
    },
  },
  {
    name: "Constants",
    scope: "constant",
    settings: {
      foreground: theme.syntax.constant,
    },
  },
  {
    name: "Numbers",
    scope: "constant.numeric",
    settings: {
      foreground: theme.syntax.number,
    },
  },
  {
    name: "Characters",
    scope: "constant.character",
    settings: {
      foreground: theme.syntax.string,
    },
  },
  {
    name: "Strings",
    scope: "string",
    settings: {
      foreground: theme.syntax.string,
    },
  },
  {
    name: "Strings: Escape Sequences",
    scope: "constant.character.escape",
    settings: {
      fontStyle: textMateStyle(styles.escape),
      foreground: theme.syntax.regex,
    },
  },
  {
    name: "Strings: Regular Expressions",
    scope: ["string.regexp", "constant.regexp"],
    settings: {
      foreground: theme.syntax.regex,
    },
  },
  {
    name: "Strings: Symbols",
    scope: "constant.other.symbol",
    settings: {
      foreground: theme.syntax.symbol,
    },
  },
  {
    name: "Punctuation",
    scope: "punctuation",
    settings: {
      foreground: theme.syntax.punctuation,
    },
  },
  {
    name: "HTML: Doctype Declaration",
    scope: [
      "meta.tag.sgml.doctype",
      "meta.tag.sgml.doctype string",
      "meta.tag.sgml.doctype entity.name.tag",
      "meta.tag.sgml punctuation.definition.tag.html",
    ],
    settings: {
      foreground: theme.syntax.preprocessor,
    },
  },
  {
    name: "HTML: Tags",
    scope: [
      "meta.tag",
      "punctuation.definition.tag.html",
      "punctuation.definition.tag.begin.html",
      "punctuation.definition.tag.end.html",
    ],
    settings: {
      foreground: theme.syntax.punctuation,
    },
  },
  {
    name: "HTML: Tag Names",
    scope: "entity.name.tag",
    settings: {
      foreground: theme.syntax.tag,
    },
  },
  {
    name: "HTML: Attribute Names",
    scope: [
      "meta.tag entity.other.attribute-name",
      "entity.other.attribute-name.html",
    ],
    settings: {
      fontStyle: textMateStyle(styles.attribute),
      foreground: theme.syntax.attribute,
    },
  },
  {
    name: "HTML: Entities",
    scope: ["constant.character.entity", "punctuation.definition.entity"],
    settings: {
      foreground: theme.syntax.constant,
    },
  },
  {
    name: "CSS: Selectors",
    scope: [
      "meta.selector",
      "meta.selector entity",
      "meta.selector entity punctuation",
      "entity.name.tag.css",
    ],
    settings: {
      foreground: theme.syntax.selector,
    },
  },
  {
    name: "CSS: Property Names",
    scope: ["meta.property-name", "support.type.property-name"],
    settings: {
      foreground: theme.syntax.member,
    },
  },
  {
    name: "CSS: Property Values",
    scope: [
      "meta.property-value",
      "meta.property-value constant.other",
      "support.constant.property-value",
    ],
    settings: {
      foreground: theme.syntax.string,
    },
  },
  {
    name: "CSS: Important Keyword",
    scope: "keyword.other.important",
    settings: {
      fontStyle: textMateStyle(styles.important),
    },
  },
  {
    name: "Markup: Changed",
    scope: "markup.changed",
    settings: {
      foreground: theme.changes.modified.base,
    },
  },
  {
    name: "Markup: Deletion",
    scope: "markup.deleted",
    settings: {
      foreground: theme.changes.removed.base,
    },
  },
  {
    name: "Markup: Error",
    scope: "markup.error",
    settings: {
      foreground: theme.status.error.base,
    },
  },
  {
    name: "Markup: Insertion",
    scope: "markup.inserted",
    settings: {
      foreground: theme.changes.added.base,
    },
  },
  {
    name: "Markup: Link",
    scope: "meta.link",
    settings: {
      foreground: theme.accents.special.two,
    },
  },
  {
    name: "Markup: Output",
    scope: ["markup.output", "markup.raw"],
    settings: {
      foreground: theme.syntax.string,
    },
  },
  {
    name: "Markup: Prompt",
    scope: "markup.prompt",
    settings: {
      foreground: theme.accents.primary,
    },
  },
  {
    name: "Markup: Heading",
    scope: "markup.heading",
    settings: {
      foreground: theme.rainbow[1],
    },
  },
  {
    name: "Markup: Heading 1",
    scope: ["heading.1.markdown", "markup.heading.setext.1.markdown"],
    settings: {
      foreground: theme.rainbow[1],
    },
  },
  {
    name: "Markup: Heading 2",
    scope: ["heading.2.markdown", "markup.heading.setext.2.markdown"],
    settings: {
      foreground: theme.rainbow[2],
    },
  },
  {
    name: "Markup: Heading 3",
    scope: ["heading.3.markdown"],
    settings: {
      foreground: theme.rainbow[3],
    },
  },
  {
    name: "Markup: Heading 4",
    scope: ["heading.4.markdown"],
    settings: {
      foreground: theme.rainbow[4],
    },
  },
  {
    name: "Markup: Heading 5",
    scope: ["heading.5.markdown"],
    settings: {
      foreground: theme.rainbow[5],
    },
  },
  {
    name: "Markup: Heading 6",
    scope: ["heading.6.markdown"],
    settings: {
      foreground: theme.rainbow[6],
    },
  },
  {
    name: "Markup: Traceback",
    scope: "markup.traceback",
    settings: {
      foreground: theme.status.error.base,
    },
  },
  {
    name: "Markup: Underline",
    scope: "markup.underline",
    settings: {
      fontStyle: textMateStyle(styles.markupUnderline),
    },
  },
  {
    name: "Markup Quote",
    scope: "markup.quote",
    settings: {
      foreground: theme.syntax.punctuation,
    },
  },
  {
    name: "Markup Lists",
    scope: "markup.list",
    settings: {
      foreground: theme.syntax.punctuation,
    },
  },
  {
    name: "Markup: Bold",
    scope: "markup.bold",
    settings: {
      fontStyle: textMateStyle(styles.markupStrong),
    },
  },
  {
    name: "Markup: Italic",
    scope: "markup.italic",
    settings: {
      fontStyle: textMateStyle(styles.markupItalic),
    },
  },
  {
    name: "Markup Inline",
    scope: "markup.inline.raw",
    settings: {
      fontStyle: textMateStyle(styles.inlineCode),
      foreground: theme.syntax.string,
    },
  },
  {
    name: "Extra: Diff Range",
    scope: ["meta.diff.range", "meta.diff.index", "meta.separator"],
    settings: {
      foreground: theme.changes.text.base,
    },
  },
  {
    name: "Extra: Diff From",
    scope: "meta.diff.header.from-file",
    settings: {
      foreground: theme.changes.removed.base,
    },
  },
  {
    name: "Extra: Diff To",
    scope: "meta.diff.header.to-file",
    settings: {
      foreground: theme.changes.added.base,
    },
  },
];
