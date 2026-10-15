/*
Lua implementation of HSLuv and HPLuv color spaces
Homepage: http://www.hsluv.org/

Copyright (C) 2019 Alexei Boronine

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// Direct numerical port of the existing Lua implementation; do not substitute color-space algorithms.
export type Triple = [number, number, number];
const m: Triple[] = [
  [3.240969941904521, -1.537383177570093, -0.498610760293],
  [-0.96924363628087, 1.87596750150772, 0.041555057407175],
  [0.055630079696993, -0.20397695888897, 1.056971514242878],
];
const inverse: Triple[] = [
  [0.41239079926595, 0.35758433938387, 0.18048078840183],
  [0.21263900587151, 0.71516867876775, 0.072192315360733],
  [0.019330818715591, 0.11919477979462, 0.95053215224966],
];
const refU = 0.19783000664283;
const refV = 0.46831999493879;
const kappa = 903.2962962;
const epsilon = 0.0088564516;
const dot = (a: Triple, b: Triple) =>
  a.reduce((sum, value, i) => sum + value * b[i], 0);
const fromLinear = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** 0.416666666666666685 - 0.055;
const toLinear = (c: number) =>
  c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
function maxChroma(l: number, h: number) {
  const theta = (h / 360) * Math.PI * 2;
  const sub1 = (l + 16) ** 3 / 1560896;
  const sub2 = sub1 > epsilon ? sub1 : l / kappa;
  let min = Number.MAX_VALUE;
  for (const [m1, m2, m3] of m) {
    for (let t = 0; t <= 1; t++) {
      const top1 = (284517 * m1 - 94839 * m3) * sub2;
      const top2 =
        (838422 * m3 + 769860 * m2 + 731718 * m1) * l * sub2 - 769860 * t * l;
      const bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
      const length =
        top2 / bottom / (Math.sin(theta) - (top1 / bottom) * Math.cos(theta));
      if (length >= 0) min = Math.min(min, length);
    }
  }
  return min;
}
export function hexToRgb(hex: string): Triple {
  if (!/^#[\da-f]{6}$/i.test(hex))
    throw new Error(`Invalid opaque color: ${hex}`);
  return [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  ) as Triple;
}
export function rgbToHsluv(rgb: Triple): Triple {
  const linear = rgb.map(toLinear) as Triple;
  const [x, y, z] = inverse.map((row) => dot(row, linear));
  const divider = x + 15 * y + 3 * z;
  const u = divider !== 0 ? (4 * x) / divider : 0;
  const v = divider !== 0 ? (9 * y) / divider : 0;
  const l = y <= epsilon ? y * kappa : 116 * y ** 0.333333333333333315 - 16;
  const U = l === 0 ? 0 : 13 * l * (u - refU);
  const V = l === 0 ? 0 : 13 * l * (v - refV);
  const c = Math.sqrt(U * U + V * V);
  let h = c < 0.00000001 ? 0 : (Math.atan2(V, U) * 180) / 3.1415926535897932;
  if (h < 0) h += 360;
  if (l > 99.9999999) return [h, 0, 100];
  if (l < 0.00000001) return [h, 0, 0];
  return [h, (c / maxChroma(l, h)) * 100, l];
}
export function hsluvToRgb([h, s, lightness]: Triple): Triple {
  const l =
    lightness > 99.9999999 ? 100 : lightness < 0.00000001 ? 0 : lightness;
  const c = l === 0 || l === 100 ? 0 : (maxChroma(l, h) / 100) * s;
  const angle = (h / 360) * 2 * Math.PI;
  const U = Math.cos(angle) * c;
  const V = Math.sin(angle) * c;
  if (l === 0) return [0, 0, 0];
  const varU = U / (13 * l) + refU;
  const varV = V / (13 * l) + refV;
  const y = l <= 8 ? l / kappa : ((l + 16) / 116) ** 3;
  const x = -(9 * y * varU) / ((varU - 4) * varV - varU * varV);
  const z = (9 * y - 15 * varV * y - varV * x) / (3 * varV);
  return m.map((row) => fromLinear(dot(row, [x, y, z]))) as Triple;
}
export const hexToHsluv = (hex: string) => rgbToHsluv(hexToRgb(hex));
export function hsluvToHex(value: Triple) {
  return (
    "#" +
    hsluvToRgb(value)
      .map((c) =>
        Math.floor(c * 255 + 0.5)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
