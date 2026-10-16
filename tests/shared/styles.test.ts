import test from "node:test";
import assert from "node:assert/strict";
import {
  textStyles,
  textMateStyle,
  semanticStyle,
  zedStyle,
  type StylePolicy,
} from "../../shared/styles.ts";
import { vscodeTheme } from "../../packages/vscode/adapter.ts";
import { zedTheme } from "../../packages/zed/adapter.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { canvas } from "../../shared/themes/canvas.ts";

test("chosen emphasis separates structural bold from supporting data", () => {
  for (const [name, style] of Object.entries(textStyles)) {
    const expected =
      name === "type"
        ? {}
        : name === "deprecated"
          ? { strikethrough: true }
          : {
              bold: [
                "functions",
                "functionDeclaration",
                "functionCall",
                "typeDeclaration",
                "controlFlow",
                "readonlyFunction",
              ].includes(name),
              italic: name === "comment" || name === "documentation",
              underline: false,
              strikethrough: false,
            };
    assert.deepEqual(style, expected, name);
  }
  assert.notEqual(textStyles.comment, textStyles.functions);
  assert.notEqual(textStyles.functions, textStyles.type);
});

test("editor output enables only the selected emphasis", () => {
  const theme = resolveTheme(canvas);
  const vscode = vscodeTheme(theme, "canvas");
  for (const rule of vscode.tokenColors)
    if (rule.settings.fontStyle !== undefined)
      assert.equal(
        rule.settings.fontStyle,
        [
          "Comments",
          "Comments: Documentation",
          "Strings: Documentation",
        ].includes(rule.name)
          ? "italic"
          : [
                "Functions",
                "Function Declarations",
                "Function Calls",
                "Type Declarations",
                "Control Flow",
              ].includes(rule.name)
            ? "bold"
            : rule.name === "Deprecated"
              ? "strikethrough"
              : "",
        rule.name,
      );
  for (const [name, style] of Object.entries(vscode.semanticTokenColors)) {
    if (typeof style === "string") continue;
    if ("fontStyle" in style && style.fontStyle !== undefined)
      assert.equal(
        style.fontStyle,
        /^(function|method)(\.|$)/.test(name) || name === "keyword.controlFlow"
          ? "bold"
          : "",
        name,
      );
    for (const attribute of ["bold", "italic", "underline", "strikethrough"])
      assert.equal(
        (style as Record<string, unknown>)[attribute] === true,
        (name.endsWith(".deprecated") && attribute === "strikethrough") ||
          (!name.endsWith(".deprecated") &&
            /\.(declaration|definition)$/.test(name) &&
            attribute === "bold"),
        name,
      );
  }
  for (const [name, style] of Object.entries(
    zedTheme(theme, "canvas").style.syntax,
  )) {
    assert.equal(
      style.font_weight === 700,
      [
        "function",
        "function.builtin",
        "function.call",
        "function.method.call",
        "constructor",
        "type.definition",
        "keyword.control",
      ].includes(name),
      name,
    );
    assert.equal(
      style.font_style === "italic",
      ["comment", "comment.doc", "string.doc", "string.documentation"].includes(
        name,
      ),
      name,
    );
  }
});

test("style translators distinguish inheritance from explicit disabling", () => {
  assert.equal(textMateStyle({}), undefined);
  assert.equal(textMateStyle({ bold: false }), "");
  assert.equal(
    textMateStyle({ italic: true, underline: true, strikethrough: true }),
    "italic underline strikethrough",
  );
  assert.deepEqual(semanticStyle({}), {});
  assert.deepEqual(semanticStyle({ bold: false, underline: true }), {
    bold: false,
    underline: true,
  });
  assert.deepEqual(zedStyle({}), {});
  assert.deepEqual(zedStyle({ bold: false, italic: false }), {
    font_weight: 400,
    font_style: "normal",
  });
  assert.deepEqual(zedStyle({ bold: true, italic: true }), {
    font_weight: 700,
    font_style: "italic",
  });
  assert.deepEqual(zedStyle({ underline: false, strikethrough: false }), {});
  for (const style of [{ underline: true }, { strikethrough: true }])
    assert.throws(() => zedStyle(style), /do not support/);
});

test("deprecated overlays outrank each existing selector without resetting other emphasis", () => {
  const rules = vscodeTheme(resolveTheme(canvas), "canvas").semanticTokenColors;
  for (const name of Object.keys(rules)) {
    if (name.endsWith(".deprecated")) continue;
    assert.deepEqual(
      rules[`${name}.deprecated` as keyof typeof rules],
      {
        strikethrough: true,
      },
      name,
    );
  }
  assert.deepEqual(rules["*.deprecated"], { strikethrough: true });
  assert.deepEqual(rules["variable.builtin.classMember.deprecated"], {
    strikethrough: true,
  });
});

test("central policy changes reach syntax and semantic consumers without changing colors", () => {
  const policy: StylePolicy = {
    ...textStyles,
    functions: { bold: false, italic: true },
    builtinVariable: { italic: false },
    markupStrong: { bold: false },
  };
  const theme = resolveTheme(canvas);
  const vscode = vscodeTheme(theme, "canvas", policy);
  const zed = zedTheme(theme, "canvas", policy);
  const baseline = vscodeTheme(theme, "canvas");
  assert.deepEqual(vscode.colors, baseline.colors);
  assert.equal(
    vscode.tokenColors.find((rule) => rule.name === "Functions")?.settings
      .fontStyle,
    "italic",
  );
  for (const key of ["function", "method", "function.builtin"] as const) {
    assert.equal(vscode.semanticTokenColors[key].fontStyle, "italic");
    assert.equal(
      vscode.semanticTokenColors[key].foreground,
      baseline.semanticTokenColors[key].foreground,
    );
  }
  assert.equal(vscode.semanticTokenColors.selfParameter.fontStyle, "");
  assert.equal(zed.style.syntax.function.font_weight, 400);
  assert.equal(zed.style.syntax.function.font_style, "italic");
  assert.equal(zed.style.syntax["emphasis.strong"].font_weight, 400);
});

test("empty semantic and TextMate policies retain the underlying emphasis", () => {
  const policy: StylePolicy = { ...textStyles, functions: {} };
  const rendered = vscodeTheme(resolveTheme(canvas), "canvas", policy);
  const semantic = rendered.semanticTokenColors.function;
  assert.equal(Object.hasOwn(semantic, "bold"), false);
  assert.equal(Object.hasOwn(semantic, "italic"), false);
  const syntax = rendered.tokenColors.find((rule) => rule.name === "Functions");
  assert.equal(syntax?.settings.fontStyle, undefined);
  assert.equal(
    Object.hasOwn(JSON.parse(JSON.stringify(syntax)).settings, "fontStyle"),
    false,
  );
});

test("existing semantic replacements keep resets that outrank inherited decorations", () => {
  const policy: StylePolicy = {
    ...textStyles,
    functions: { bold: true },
    type: { bold: true },
    builtinVariable: { italic: true },
  };
  const rendered = vscodeTheme(resolveTheme(canvas), "canvas", policy);
  // VS Code's fontStyle form resets all unlisted attributes, including underline
  // from a less-specific semantic rule. Partial boolean objects do not.
  for (const name of ["function", "method", "class", "type"] as const)
    assert.deepEqual(rendered.semanticTokenColors[name], {
      foreground: rendered.semanticTokenColors[name].foreground,
      fontStyle: "bold",
    });
  assert.deepEqual(rendered.semanticTokenColors.selfParameter, {
    foreground: rendered.semanticTokenColors.selfParameter.foreground,
    fontStyle: "italic",
  });
  assert.deepEqual(
    rendered.semanticTokenColors["variable.builtin.classMember"],
    {
      foreground:
        rendered.semanticTokenColors["variable.builtin.classMember"].foreground,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    },
  );
});

test("structural styles distinguish declarations, calls, references, and imports", () => {
  const policy: StylePolicy = {
    ...textStyles,
    functionDeclaration: { bold: false, italic: true },
    functionCall: { bold: false },
    typeDeclaration: { bold: true },
  };
  const theme = resolveTheme(canvas);
  const vs = vscodeTheme(theme, "canvas", policy);
  assert.deepEqual(vs.semanticTokenColors["class.builtin.declaration"], {
    bold: true,
  });
  assert.deepEqual(vs.semanticTokenColors["function.builtin.declaration"], {
    bold: false,
    italic: true,
  });
  assert.deepEqual(
    vs.semanticTokenColors["function.builtin.declaration.deprecated"],
    { strikethrough: true },
  );
  assert.equal(vs.semanticTokenColors.type.fontStyle, undefined);
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Import Keywords")?.settings
      .fontStyle,
    "",
  );
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Function Calls")?.settings.fontStyle,
    "",
  );
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Function Declarations")?.settings
      .fontStyle,
    "italic",
  );
  const zed = zedTheme(theme, "canvas", policy).style.syntax;
  assert.equal(zed.type.font_weight, undefined);
  assert.equal(zed["type.definition"].font_weight, 700);
  assert.equal(zed["function.call"].font_weight, 400);
});

test("callable types and variables retain contextual bold while decorators stay plain", () => {
  const vs = vscodeTheme(resolveTheme(canvas), "canvas");
  assert.equal(typeof vs.semanticTokenColors.parameter, "string");
  assert.equal(typeof vs.semanticTokenColors.variable, "string");
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Function Support")?.settings
      .fontStyle,
    "",
  );
  const calls = vs.tokenColors.find((r) => r.name === "Function Calls");
  assert.ok(Array.isArray(calls?.scope));
  assert.ok(calls.scope.includes("meta.function-call.generic"));
  assert.ok(!calls.scope.includes("support.function"));
  assert.ok(calls.scope.includes("meta.function-call > support.function"));
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Function References in Arguments")
      ?.settings.fontStyle,
    "",
  );
  assert.equal(vs.semanticTokenColors["class.builtin"].fontStyle, undefined);
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Classes")?.settings.fontStyle,
    undefined,
  );
  assert.equal(
    vs.tokenColors.find((r) => r.name === "Decorators")?.settings.fontStyle,
    "",
  );
  assert.deepEqual(
    vs.semanticTokenColors["function.decorator"],
    textStyles.attribute,
  );
  assert.deepEqual(
    vs.semanticTokenColors["function.builtin.declaration.decorator"],
    textStyles.attribute,
  );
  assert.deepEqual(
    vs.semanticTokenColors["function.builtin.declaration.decorator.deprecated"],
    { strikethrough: true },
  );
  const declarations = vs.tokenColors.find(
    (r) => r.name === "Type Declarations",
  );
  assert.ok(Array.isArray(declarations?.scope));
  assert.ok(declarations.scope.every((scope) => scope.includes(" ")));
});
