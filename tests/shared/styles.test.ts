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

test("every named role starts plain and remains independently editable", () => {
  for (const [name, style] of Object.entries(textStyles))
    assert.deepEqual(
      style,
      {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
      },
      name,
    );
  assert.notEqual(textStyles.comment, textStyles.functions);
  assert.notEqual(textStyles.functions, textStyles.type);
});

test("editor output contains no enabled theme emphasis", () => {
  const theme = resolveTheme(canvas);
  const vscode = vscodeTheme(theme, "canvas");
  for (const rule of vscode.tokenColors)
    if (rule.settings.fontStyle !== undefined)
      assert.equal(rule.settings.fontStyle, "", rule.name);
  for (const [name, style] of Object.entries(vscode.semanticTokenColors)) {
    if (typeof style === "string") continue;
    if ("fontStyle" in style) assert.equal(style.fontStyle, "", name);
    for (const attribute of ["bold", "italic", "underline", "strikethrough"])
      assert.notEqual(
        (style as Record<string, unknown>)[attribute],
        true,
        name,
      );
  }
  for (const [name, style] of Object.entries(
    zedTheme(theme, "canvas").style.syntax,
  )) {
    assert.notEqual(style.font_weight, 700, name);
    assert.notEqual(style.font_style, "italic", name);
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
