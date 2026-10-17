import type { Theme, Variant } from "../../../shared/theme.ts";
import { textStyles, type StylePolicy } from "../../../shared/styles.ts";
import { zedEditorColors } from "./editor.ts";
import { zedSyntaxColors } from "./syntax.ts";

export function zedTheme(
  theme: Theme,
  variant: Variant,
  styles: StylePolicy = textStyles,
) {
  return {
    name: `Kanagawa Paper ${variant === "ink" ? "Ink" : "Canvas"}`,
    appearance: variant === "ink" ? "dark" : "light",
    style: {
      ...zedEditorColors(theme),
      syntax: zedSyntaxColors(theme, styles),
    },
  };
}
