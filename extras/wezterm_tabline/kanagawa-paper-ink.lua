-----------------------------------------------------------------------------
--- Kanagawa Paper Ink
--- Upstream: https://github.com/thesimonho/kanagawa-paper/tree/main/extras/wezterm_tabline/kanagawa-paper-ink.lua
--- URL: https://github.com/michaelbrusegard/tabline.wez
-----------------------------------------------------------------------------

local M = {}

M = {
  normal_mode = {
    a = { fg = "#363646", bg = "#c4b28a" },
    b = { fg = "#c4b28a", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  copy_mode = {
    a = { fg = "#363646", bg = "#c4746e" },
    b = { fg = "#c4746e", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  search_mode = {
    a = { fg = "#363646", bg = "#938AA9" },
    b = { fg = "#938AA9", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  window_mode = {
    a = { fg = "#363646", bg = "#658594" },
    b = { fg = "#658594", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  resize_mode = {
    a = { fg = "#363646", bg = "#b6927b" },
    b = { fg = "#b6927b", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  tab_mode = {
    a = { fg = "#363646", bg = "#6A9589" },
    b = { fg = "#6A9589", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  default_mode = {
    a = { fg = "#363646", bg = "#c4746e" },
    b = { fg = "#c4746e", bg = "#363646" },
    c = { fg = "#9e9b93", bg = "#2A2A37" },
  },
  tab = {
    active = { fg = '#c4b28a', bg = '#1F1F28', bold = true },
    inactive = { fg = '#9e9b93', bg = '#2A2A37' },
    inactive_hover = { fg = '#a292a3', bg = '#1F1F28' },
  },
  ansi = {
    "#393836",
    "#c4746e",
    "#699469",
    "#c4b28a",
    "#435965",
    "#a292a3",
    "#8ea49e",
    "#C8C093",
  },
  brights = {
    "#aca9a4",
    "#cc928e",
    "#72a072",
    "#d4c196",
    "#698a9b",
    "#b4a7b5",
    "#96ada7",
    "#d5cd9d",
  },
}

return M
