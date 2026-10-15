import * as alacritty from "./extras/alacritty.ts";
import * as foot from "./extras/foot.ts";
import * as fzf from "./extras/fzf.ts";
import * as ghostty from "./extras/ghostty.ts";
import * as kitty from "./extras/kitty.ts";
import * as lazygit from "./extras/lazygit.ts";
import * as nchat from "./extras/nchat.ts";
import * as nushell from "./extras/nushell.ts";
import * as tailwind from "./extras/tailwind.ts";
import * as terminator from "./extras/terminator.ts";
import * as termux from "./extras/termux.ts";
import * as tilix from "./extras/tilix.ts";
import * as wezterm from "./extras/wezterm.ts";
import * as wezterm_tabline from "./extras/wezterm_tabline.ts";
import * as windows_terminal from "./extras/windows_terminal.ts";
import * as vscode_terminal from "./extras/vscode_terminal.ts";
import * as vivid from "./extras/vivid.ts";
import * as zellij from "./extras/zellij.ts";
import type { Theme, Variant } from "../shared/theme.ts";
export interface Metadata {
  name: string;
  styleName: string;
  upstreamUrl: string;
  url: string;
  packageName: string;
  variant: Variant;
}
export interface Extra {
  ext: string;
  url: string;
  generate(theme: Theme, meta: Metadata): Record<string, string>;
  generatePalette?(meta: Metadata): string;
}
export const extras = {
  alacritty: {
    ...alacritty,
    ext: "toml",
    url: "https://github.com/alacritty/alacritty",
  },
  foot: { ...foot, ext: "ini", url: "https://codeberg.org/dnkl/foot" },
  fzf: {
    ...fzf,
    ext: "rc",
    url: "https://github.com/junegunn/fzf/tree/master#environment-variables",
  },
  ghostty: {
    ...ghostty,
    ext: "",
    url: "https://github.com/ghostty-org/ghostty",
  },
  kitty: {
    ...kitty,
    ext: "conf",
    url: "https://sw.kovidgoyal.net/kitty/conf.html",
  },
  lazygit: {
    ...lazygit,
    ext: "yml",
    url: "https://github.com/jesseduffield/lazygit",
  },
  nchat: { ...nchat, ext: "conf", url: "https://github.com/d99kris/nchat" },
  nushell: { ...nushell, ext: "nu", url: "https://www.nushell.sh/" },
  tailwind: { ...tailwind, ext: "css", url: "https://tailwindcss.com/" },
  terminator: {
    ...terminator,
    ext: "conf",
    url: "https://gnome-terminator.readthedocs.io/en/latest/config.html",
  },
  termux: { ...termux, ext: "properties", url: "https://termux.dev/" },
  tilix: { ...tilix, ext: "jsonc", url: "https://github.com/gnunn1/tilix" },
  wezterm: {
    ...wezterm,
    ext: "toml",
    url: "https://wezterm.org/config/appearance.html",
  },
  wezterm_tabline: {
    ...wezterm_tabline,
    ext: "lua",
    url: "https://github.com/michaelbrusegard/tabline.wez",
  },
  windows_terminal: {
    ...windows_terminal,
    ext: "jsonc",
    url: "https://learn.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes",
  },
  vscode_terminal: {
    ...vscode_terminal,
    ext: "jsonc",
    url: "https://code.visualstudio.com/api/references/theme-color",
  },
  vivid: { ...vivid, ext: "yml", url: "https://github.com/sharkdp/vivid" },
  zellij: { ...zellij, ext: "kdl", url: "https://zellij.dev/" },
} satisfies Record<string, Extra>;
export type ExtraName = keyof typeof extras;
export function metadata(
  name: string,
  info: Extra,
  variant: Variant,
): Metadata {
  const filename = `kanagawa-paper-${variant}${info.ext ? "." + info.ext : ""}`;
  return {
    name: `kanagawa-paper-${variant}`,
    styleName: `Kanagawa Paper ${variant === "ink" ? "Ink" : "Canvas"}`,
    upstreamUrl: `https://github.com/thesimonho/kanagawa-paper/tree/main/extras/${name}/${filename}`,
    url: info.url,
    packageName: "Kanagawa Paper",
    variant,
  };
}
