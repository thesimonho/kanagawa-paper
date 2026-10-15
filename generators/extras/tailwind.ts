import { rawPalette } from "../../shared/palette.ts";
import type { Theme } from "../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `/* ----------------------------------------------------------------------------- */
/* ${meta.styleName} */
/* Upstream: ${meta.upstreamUrl} */
/* URL: ${meta.url} */
/* ----------------------------------------------------------------------------- */

@theme inline {
  --color-${meta.name}-foreground: oklch(from ${theme.ui.text.primary} l c h);
  --color-${meta.name}-background: oklch(from ${theme.ui.surface.editor.background} l c h);
  --color-${meta.name}-divider: oklch(from ${theme.ui.border.default} l c h);
  --color-${meta.name}-focus: oklch(from ${theme.ui.search.match.background} l c h);
  --color-${meta.name}-highlight: oklch(from ${theme.ui.selection.background} l c h);
  --color-${meta.name}-comment: oklch(from ${theme.syntax.comment} l c h);

  --color-${meta.name}-primary: oklch(from ${theme.modes.normal} l c h);
  --color-${meta.name}-secondary: oklch(from ${theme.modes.insert} l c h);
  --color-${meta.name}-tertiary: oklch(from ${theme.modes.visual} l c h);

  --color-${meta.name}-success: oklch(from ${theme.status.success.base} l c h);
  --color-${meta.name}-warning: oklch(from ${theme.status.warning.base} l c h);
  --color-${meta.name}-danger: oklch(from ${theme.status.error.base} l c h);
  --color-${meta.name}-info: oklch(from ${theme.status.info.base} l c h);
  
  --color-${meta.name}-content1: oklch(from ${theme.ui.surface.editor.background} l c h);
  --color-${meta.name}-content2: oklch(from ${theme.ui.surface.tones.m1} l c h);
  --color-${meta.name}-content3: oklch(from ${theme.ui.surface.tones.m2} l c h);
  --color-${meta.name}-content4: oklch(from ${theme.ui.surface.tones.m3} l c h);
  --color-${meta.name}-content5: oklch(from ${theme.ui.surface.tones.m4} l c h);
  --color-${meta.name}-panel: oklch(from ${theme.ui.surface.floating.background} l c h);

  --color-${meta.name}-rainbow1: oklch(from ${theme.rainbow[1]} l c h);
  --color-${meta.name}-rainbow2: oklch(from ${theme.rainbow[2]} l c h);
  --color-${meta.name}-rainbow3: oklch(from ${theme.rainbow[3]} l c h);
  --color-${meta.name}-rainbow4: oklch(from ${theme.rainbow[4]} l c h);
  --color-${meta.name}-rainbow5: oklch(from ${theme.rainbow[5]} l c h);
  --color-${meta.name}-rainbow6: oklch(from ${theme.rainbow[6]} l c h);
  --color-${meta.name}-rainbow7: oklch(from ${theme.rainbow[7]} l c h);

  --color-${meta.name}-accent1: oklch(from ${theme.accents.primary} l c h);
  --color-${meta.name}-accent2: oklch(from ${theme.accents.secondary} l c h);
  --color-${meta.name}-accent3: oklch(from ${theme.accents.tertiary} l c h);
  --color-${meta.name}-accent4: oklch(from ${theme.accents.muted} l c h);
  --color-${meta.name}-accent5: oklch(from ${theme.accents.attention} l c h);

  --color-${meta.name}-black: oklch(from ${theme.terminal.normal.black} l c h);
  --color-${meta.name}-black-bright: oklch(from ${theme.terminal.bright.black} l c h);
  --color-${meta.name}-red: oklch(from ${theme.terminal.normal.red} l c h);
  --color-${meta.name}-red-bright: oklch(from ${theme.terminal.bright.red} l c h);
  --color-${meta.name}-green: oklch(from ${theme.terminal.normal.green} l c h);
  --color-${meta.name}-green-bright: oklch(from ${theme.terminal.bright.green} l c h);
  --color-${meta.name}-yellow: oklch(from ${theme.terminal.normal.yellow} l c h);
  --color-${meta.name}-yellow-bright: oklch(from ${theme.terminal.bright.yellow} l c h);
  --color-${meta.name}-blue: oklch(from ${theme.terminal.normal.blue} l c h);
  --color-${meta.name}-blue-bright: oklch(from ${theme.terminal.bright.blue} l c h);
  --color-${meta.name}-magenta: oklch(from ${theme.terminal.normal.magenta} l c h);
  --color-${meta.name}-magenta-bright: oklch(from ${theme.terminal.bright.magenta} l c h);
  --color-${meta.name}-cyan: oklch(from ${theme.terminal.normal.cyan} l c h);
  --color-${meta.name}-cyan-bright: oklch(from ${theme.terminal.bright.cyan} l c h);
  --color-${meta.name}-white: oklch(from ${theme.terminal.normal.white} l c h);
  --color-${meta.name}-white-bright: oklch(from ${theme.terminal.bright.white} l c h);
}
`,
  };
}

export function generatePalette(meta: Metadata): string {
  const kebab = (name: string) =>
    name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  const lines = Object.entries(rawPalette)
    .sort(([a], [b]) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
    .map(
      ([name, hex]) =>
        `  --color-kanagawa-paper-${kebab(name)}: oklch(from ${hex} l c h);`,
    )
    .join("\n");
  return `/* ----------------------------------------------------------------------------- */
/* ${meta.styleName} */
/* Upstream: ${meta.upstreamUrl} */
/* URL: ${meta.url} */
/* ----------------------------------------------------------------------------- */

@theme inline {
${lines}
}
`;
}
