import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------
colors:
  background_color: '${theme.ui.surface.editor.background}'
  white: '${theme.terminal.normal.white}'
  red: '${theme.terminal.normal.red}'
  green: '${theme.terminal.normal.green}'
  yellow: '${theme.terminal.normal.yellow}'
  blue: '${theme.terminal.normal.blue}'
  pink: '${theme.terminal.normal.magenta}'
  cyan: '${theme.terminal.normal.cyan}'

  light_red: '${theme.terminal.bright.red}'
  light_green: '${theme.terminal.bright.green}'
  light_blue: '${theme.terminal.bright.blue}'
  light_pink: '${theme.terminal.bright.magenta}'
  light_cyan: '${theme.terminal.bright.cyan}'

  black: '${theme.ui.surface.tones.m4}'
  gray: '${theme.ui.surface.tones.m1}'
  darkgray: '${theme.ui.surface.tones.m2}'
  darkergray: '${theme.ui.surface.tones.m3}'

core:
  normal_text: {}
  regular_file: {}
  reset_to_normal: {}

  directory:
    foreground: light_blue

  symlink:
    foreground: light_pink

  multi_hard_link: {}

  fifo:
    foreground: black
    background: blue

  socket:
    foreground: black
    background: light_pink

  door:
    foreground: black
    background: light_pink

  block_device:
    foreground: light_cyan
    background: darkergray

  character_device:
    foreground: light_pink
    background: darkergray

  broken_symlink:
    foreground: black
    background: red

  missing_symlink_target:
    foreground: black
    background: red

  setuid: {}

  setgid: {}

  file_with_capability: {}

  sticky_other_writable: {}

  other_writable: {}

  sticky: {}

  executable_file:
    foreground: light_red

text:
  special:
    foreground: background_color
    background: yellow

  todo:
    font-style: bold

  licenses:
    foreground: gray

  configuration:
    foreground: yellow

  other:
    foreground: yellow

markup:
  foreground: yellow

programming:
  source:
    foreground: green

  tooling:
    foreground: light_green

    continuous-integration:
      foreground: green

media:
  foreground: pink

office:
  foreground: cyan

archives:
  foreground: light_cyan
  font-style: underline

executable:
  foreground: light_red
  font-style: bold

unimportant:
  foreground: darkgray
`.replace(/#([0-9a-f]{6})/gi, "$1"),
  };
}
