import { rawPalette } from "../shared/palette.ts";
export function paletteMarkdown() {
  return (
    "# Palette Colors\n\n(this file is auto generated from `shared/palette.ts`)\n\n| Name  | Color  | Hex   |\n| ----- | :----: | :---: |\n" +
    Object.entries(rawPalette)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([name, color]) => {
        const hex = color.slice(1);
        return `| **${name}** | ![${hex}](https://placehold.co/40x15/${hex}/${hex}.png) | \`#${hex}\` |\n`;
      })
      .join("")
  );
}
