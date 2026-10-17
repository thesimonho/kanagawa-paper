import { rawPalette } from "../palette.ts";
import type { ColorExpression, Resolved } from "./expression.ts";
import {
  hexToHsluv,
  hexToRgb,
  hsluvToHex,
  hsluvToRgb,
  rgbToHsluv,
  type Triple,
} from "./hsluv.ts";

type Palette = Readonly<Record<string, string>>;
export function evaluate(
  expression: ColorExpression,
  palette: Palette = rawPalette,
): string {
  if (expression.kind === "inherit") return "none";
  if (expression.kind === "literal") return expression.hex;
  if (expression.kind === "palette") {
    const value = palette[expression.name];
    if (!value) throw new Error(`Unknown palette color: ${expression.name}`);
    return value;
  }
  // Preserve intermediate HSLuv precision across chained operations, as Color does in Lua.
  const value = calculate(expression, palette);
  return value === "none" ? "NONE" : hsluvToHex(value);
}
function calculate(
  expression: ColorExpression,
  palette: Palette,
): Triple | "none" {
  if (expression.kind === "inherit") return "none";
  if (expression.kind === "palette" || expression.kind === "literal") {
    const hex = evaluate(expression, palette);
    return hex.toLowerCase() === "none" ? "none" : hexToHsluv(hex);
  }
  const value = calculate(expression.source, palette);
  if (value === "none") return value;
  if (expression.kind === "blend") {
    const background = evaluate(expression.background, palette);
    if (background.toLowerCase() === "none") return value;
    const a = hsluvToRgb(value),
      b = hexToRgb(background),
      r = expression.amount;
    return rgbToHsluv(
      a.map((v, i) => Math.sqrt((1 - r) * v ** 2 + r * b[i] ** 2)) as Triple,
    );
  }
  let r = expression.amount;
  if (expression.kind === "brighten" && expression.background) {
    const background = evaluate(expression.background, palette);
    if (background.toLowerCase() === "none") return value;
    if (hexToHsluv(background)[2] > 50) r = -r;
  }
  const index = expression.kind === "brighten" ? 2 : 1;
  value[index] += (r > 0 ? 100 - value[index] : value[index]) * r;
  return value;
}
export function resolveTheme<T>(
  value: T,
  palette: Palette = rawPalette,
): Resolved<T> {
  if (value && typeof value === "object" && "kind" in value)
    return evaluate(value as ColorExpression, palette) as Resolved<T>;
  if (Array.isArray(value))
    return value.map((item) =>
      resolveTheme(item, palette),
    ) as unknown as Resolved<T>;
  if (!value || typeof value !== "object")
    throw new Error("Theme contains a non-expression value");
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      resolveTheme(item, palette),
    ]),
  ) as Resolved<T>;
}
