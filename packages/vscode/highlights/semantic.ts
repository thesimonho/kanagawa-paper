import type { Theme } from "../../../shared/theme.ts";
import {
  textMateStyle,
  semanticStyle,
  type StylePolicy,
  type TextStyle,
} from "../../../shared/styles.ts";

function withModifierStyles<T extends object, M extends string>(
  rules: T,
  modifier: M,
  style: TextStyle,
) {
  // Each derived selector outranks its base style reset, regardless of JSON key order.
  const overlays = Object.fromEntries(
    ["*", ...Object.keys(rules)].map((selector) => [
      `${selector}.${modifier}`,
      semanticStyle(style),
    ]),
  );
  return { ...rules, ...overlays } as T &
    Record<`${Extract<keyof T, string> | "*"}.${M}`, TextStyle>;
}

export function vscodeSemanticColors(theme: Theme, styles: StylePolicy) {
  const rules = {
    arithmetic: theme.syntax.operator,
    class: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    "class.defaultLibrary": theme.syntax.keyword,
    "class.builtin": {
      foreground: theme.accents.special.one,
      fontStyle: textMateStyle(styles.type),
    },
    enum: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    enumMember: theme.syntax.constant,
    event: theme.syntax.type,
    function: {
      foreground: theme.syntax.function,
      fontStyle: textMateStyle(styles.functions),
    },
    "function.defaultLibrary": {
      foreground: theme.syntax.builtinFunction,
      fontStyle: textMateStyle(styles.functions),
    },
    "function.builtin": {
      foreground: theme.syntax.builtinFunction,
      fontStyle: textMateStyle(styles.functions),
    },
    interface: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    "keyword.controlFlow": {
      foreground: theme.syntax.statement,
      fontStyle: textMateStyle(styles.controlFlow),
    },
    macro: theme.syntax.preprocessor,
    method: {
      foreground: theme.syntax.function,
      fontStyle: textMateStyle(styles.functions),
    },
    module: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    namespace: theme.syntax.keyword,
    newOperator: theme.syntax.operator,
    numberLiteral: theme.syntax.number,
    operator: theme.syntax.operator,
    parameter: theme.syntax.parameter,
    selfParameter: {
      foreground: theme.syntax.constant,
      fontStyle: textMateStyle(styles.builtinVariable),
    },
    property: theme.syntax.identifier,
    "property.readonly": theme.syntax.constant,
    stringLiteral: theme.syntax.string,
    struct: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    type: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    "type.builtin": {
      foreground: theme.accents.special.one,
      fontStyle: textMateStyle(styles.type),
    },
    "type.defaultLibrary": theme.syntax.keyword,
    typeParameter: {
      foreground: theme.syntax.type,
      fontStyle: textMateStyle(styles.type),
    },
    variable: theme.ui.text.primary,
    "variable.builtin": {
      foreground: theme.syntax.constant,
      fontStyle: textMateStyle(styles.builtinVariable),
    },
    "variable.builtin.classMember": {
      foreground: theme.syntax.member,
      ...semanticStyle(styles.builtinMember),
    },
    "variable.classMember": { foreground: theme.syntax.member },
    "variable.classMember.readonly": theme.syntax.constant,
    "variable.readonly": theme.syntax.constant,
    "variable.static": { foreground: theme.syntax.constant },
    "variable.readonly.defaultLibrary": theme.syntax.keyword,
    "variable.defaultLibrary": theme.syntax.keyword,
    "method.defaultLibrary": {
      foreground: theme.syntax.keyword,
      fontStyle: textMateStyle(styles.functions),
    },
  };
  const typeTokens = [
    "class",
    "type",
    "struct",
    "enum",
    "interface",
    "typeParameter",
  ] as const;
  type TypeToken = (typeof typeTokens)[number];
  type TypeSelector = Extract<
    keyof typeof rules,
    TypeToken | `${TypeToken}.${string}`
  >;
  const typeHints = Object.fromEntries(
    Object.keys(rules)
      .filter((selector) =>
        (typeTokens as readonly string[]).includes(selector.split(".")[0]),
      )
      .map((selector) => [
        `${selector}.typeHint`,
        semanticStyle(styles.typeAnnotation),
      ]),
  ) as Record<`${TypeSelector}.typeHint`, TextStyle>;
  const typed = { ...rules, ...typeHints };
  type DeclaredToken = "function" | "method" | TypeToken;
  type DeclaredSelector = Extract<
    keyof typeof rules | keyof typeof typeHints,
    DeclaredToken | `${DeclaredToken}.${string}`
  >;
  const declarations = Object.fromEntries(
    Object.keys(typed).flatMap((selector) => {
      const token = selector.split(".")[0];
      const style = ["function", "method"].includes(token)
        ? styles.functionDeclaration
        : (typeTokens as readonly string[]).includes(token)
          ? styles.typeDeclaration
          : undefined;
      return style
        ? ["declaration", "definition"].map((modifier) => [
            `${selector}.${modifier}`,
            semanticStyle(style),
          ])
        : [];
    }),
  ) as Record<`${DeclaredSelector}.${"declaration" | "definition"}`, TextStyle>;
  const decorated = withModifierStyles(
    { ...typed, ...declarations, decorator: semanticStyle(styles.annotation) },
    "decorator",
    styles.annotation,
  );
  return withModifierStyles(decorated, "deprecated", styles.deprecated);
}
