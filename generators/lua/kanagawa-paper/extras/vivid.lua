local util = require("kanagawa-paper.generator_util")

local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local vivid = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------
colors:
  background_color: '${ui.bg}'
  white: '${term.white}'
  red: '${term.red}'
  green: '${term.green}'
  yellow: '${term.yellow}'
  blue: '${term.blue}'
  pink: '${term.magenta}'
  cyan: '${term.cyan}'

  light_red: '${term.red_bright}'
  light_green: '${term.green_bright}'
  light_blue: '${term.blue_bright}'
  light_pink: '${term.magenta_bright}'
  light_cyan: '${term.cyan_bright}'

  black: '${ui.bg_m4}'
  gray: '${ui.bg_m1}'
  darkgray: '${ui.bg_m2}'
  darkergray: '${ui.bg_m3}'

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
]],
		colors
	)
	vivid = vivid:gsub("#(%x%x%x%x%x%x)", "%1")
	return vivid
end

return M
