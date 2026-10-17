import type { Theme, Variant } from "../../../shared/theme.ts";
import { textStyles, type StylePolicy } from "../../../shared/styles.ts";
import { vscodeEditorColors } from "./editor.ts";
import { vscodeTextMateColors } from "./textmate.ts";
import { vscodeSemanticColors } from "./semantic.ts";

export const vscodeTheme = (
  theme: Theme,
  variant: Variant,
  styles: StylePolicy = textStyles,
) => ({
  $schema: "vscode://schemas/color-theme",
  name: variant === "ink" ? "Ink" : "Canvas",
  type: variant === "ink" ? "dark" : "light",
  semanticHighlighting: true,
  colors: vscodeEditorColors(theme),
  tokenColors: vscodeTextMateColors(theme, styles),
  semanticTokenColors: vscodeSemanticColors(theme, styles),
});
