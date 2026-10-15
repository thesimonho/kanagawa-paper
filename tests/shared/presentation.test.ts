import test from "node:test";
import assert from "node:assert/strict";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { syntaxStyles, textMateStyle, zedStyle } from "../../shared/styles.ts";
import { vscodeTheme } from "../../packages/vscode/adapter.ts";
import { zedTheme } from "../../packages/zed/adapter.ts";
import { neovimRoles } from "../../packages/neovim/adapter.ts";

for (const [variant, definition] of Object.entries({ ink, canvas })) {
  test(`${variant}: shared syntax roles and emphasis reach every adapter`, () => {
    const changed = {
      ...definition,
      syntax: {
        ...definition.syntax,
        builtinFunction: { kind: "literal", hex: "#123456" } as const,
        tag: { kind: "literal", hex: "#234567" } as const,
        selector: { kind: "literal", hex: "#345678" } as const,
      },
    };
    const theme = resolveTheme(changed);
    const vscode = vscodeTheme(theme, variant as "ink" | "canvas");
    const zed = zedTheme(theme, variant as "ink" | "canvas");
    const neovim = resolveTheme(neovimRoles(changed));
    assert.equal(neovim.syn.fun_builtin, "#123456");
    assert.equal(neovim.syn.tag, "#234567");
    assert.equal(neovim.syn.selector, "#345678");
    assert.equal(
      vscode.semanticTokenColors["function.defaultLibrary"].foreground,
      "#123456",
    );
    assert.equal(zed.style.syntax["function.builtin"].color, "#123456");
    for (const [name, expected] of [
      ["HTML: Tag Names", "#234567"],
      ["CSS: Selectors", "#345678"],
    ])
      assert.equal(
        vscode.tokenColors.find((token) => token.name === name)?.settings
          .foreground,
        expected,
      );
    assert.equal(zed.style.syntax.tag.color, "#234567");
    assert.equal(zed.style.syntax.selector.color, "#345678");
    assert.equal(
      vscode.semanticTokenColors.function.fontStyle,
      textMateStyle(syntaxStyles.functions),
    );
    assert.equal(
      vscode.semanticTokenColors.class.fontStyle,
      textMateStyle(syntaxStyles.type),
    );
    for (const [name, styles] of [
      ["Functions", syntaxStyles.functions],
      ["Classes", syntaxStyles.type],
      ["Comments", syntaxStyles.comment],
      ["Strings: Escape Sequences", syntaxStyles.escape],
    ] as const)
      assert.equal(
        vscode.tokenColors.find((token) => token.name === name)?.settings
          .fontStyle,
        textMateStyle(styles),
      );
    for (const [name, styles] of [
      ["function", syntaxStyles.functions],
      ["type", syntaxStyles.type],
      ["comment", syntaxStyles.comment],
      ["string.escape", syntaxStyles.escape],
    ] as const)
      assert.deepEqual(zed.style.syntax[name], {
        color: zed.style.syntax[name].color,
        ...zedStyle(styles),
      });
  });
}
