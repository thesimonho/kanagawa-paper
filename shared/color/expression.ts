export type Hex = `#${string}`;
export type ColorExpression =
  | { readonly kind: "palette"; readonly name: string }
  | { readonly kind: "literal"; readonly hex: Hex }
  | { readonly kind: "inherit" }
  | {
      readonly kind: "blend";
      readonly source: ColorExpression;
      readonly background: ColorExpression;
      readonly amount: number;
    }
  | {
      readonly kind: "brighten" | "saturate";
      readonly source: ColorExpression;
      readonly amount: number;
      readonly background?: ColorExpression;
    };

export const inherit: ColorExpression = Object.freeze({ kind: "inherit" });
export function definePalette<const P extends Record<string, Hex>>(raw: P) {
  for (const [name, hex] of Object.entries(raw)) {
    if (!/^#[0-9a-f]{6}$/i.test(hex))
      throw new Error(`Invalid palette color ${name}: ${hex}`);
  }
  return Object.freeze(
    Object.fromEntries(
      Object.keys(raw).map((name) => [
        name,
        Object.freeze({ kind: "palette", name }),
      ]),
    ),
  ) as {
    readonly [K in keyof P]: { readonly kind: "palette"; readonly name: K };
  };
}
function amount(value: number, min: number, max: number) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw new Error(`Color amount must be between ${min} and ${max}`);
  return value;
}
export const blend = (
  source: ColorExpression,
  background: ColorExpression,
  value: number,
): ColorExpression =>
  Object.freeze({
    kind: "blend",
    source,
    background,
    amount: amount(value, 0, 1),
  });
export const brighten = (
  source: ColorExpression,
  value: number,
  background?: ColorExpression,
): ColorExpression =>
  Object.freeze({
    kind: "brighten",
    source,
    amount: amount(value, -1, 1),
    ...(background ? { background } : {}),
  });
export const saturate = (
  source: ColorExpression,
  value: number,
): ColorExpression =>
  Object.freeze({ kind: "saturate", source, amount: amount(value, -1, 1) });
export function alpha(color: string, byte: string): Hex {
  if (!/^#[0-9a-f]{6}$/i.test(color) || !/^[0-9a-f]{2}$/i.test(byte))
    throw new Error(`Invalid alpha color: ${color}:${byte}`);
  return `${color}${byte}` as Hex;
}
export type Resolved<T> = T extends ColorExpression
  ? string
  : { [K in keyof T]: Resolved<T[K]> };
