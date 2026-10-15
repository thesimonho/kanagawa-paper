/** Default syntax emphasis shared by editor adapters and generated Neovim configuration. */
export const syntaxStyles = {
  comment: { italic: true },
  functions: { italic: false, bold: true },
  keyword: { italic: false, bold: false },
  statement: { italic: false, bold: false },
  type: { italic: false, bold: true },
  escape: { bold: true },
};

export function textMateStyle(style: { bold?: boolean; italic?: boolean }) {
  return [style.bold && "bold", style.italic && "italic"]
    .filter(Boolean)
    .join(" ");
}

export function zedStyle(style: { bold?: boolean; italic?: boolean }) {
  return {
    ...(style.bold ? { font_weight: 700 as const } : {}),
    ...(style.italic ? { font_style: "italic" as const } : {}),
  };
}
