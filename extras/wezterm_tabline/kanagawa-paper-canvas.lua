-----------------------------------------------------------------------------
--- Kanagawa Paper Canvas
--- Upstream: https://github.com/thesimonho/kanagawa-paper/tree/main/extras/wezterm_tabline/kanagawa-paper-canvas.lua
--- URL: https://github.com/michaelbrusegard/tabline.wez
-----------------------------------------------------------------------------

local M = {}

M = {
  normal_mode = {
    a = { fg = "#ecece8", bg = "#6a7893" },
    b = { fg = "#6a7893", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  copy_mode = {
    a = { fg = "#ecece8", bg = "#a36360" },
    b = { fg = "#a36360", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  search_mode = {
    a = { fg = "#ecece8", bg = "#947992" },
    b = { fg = "#947992", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  window_mode = {
    a = { fg = "#ecece8", bg = "#6a7893" },
    b = { fg = "#6a7893", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  resize_mode = {
    a = { fg = "#ecece8", bg = "#a1805e" },
    b = { fg = "#a1805e", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  tab_mode = {
    a = { fg = "#ecece8", bg = "#5c8388" },
    b = { fg = "#5c8388", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  default_mode = {
    a = { fg = "#ecece8", bg = "#a36360" },
    b = { fg = "#a36360", bg = "#ecece8" },
    c = { fg = "#77746c", bg = "#d1cfc5" },
  },
  tab = {
    active = { fg = '#6a7893', bg = '#e1e1de', bold = true },
    inactive = { fg = '#77746c', bg = '#d1cfc5' },
    inactive_hover = { fg = '#947992', bg = '#e1e1de' },
  },
  ansi = {
    "#77746c",
    "#a36360",
    "#5c8388",
    "#91825e",
    "#6c828c",
    "#947992",
    "#6a7893",
    "#92928b",
  },
  brights = {
    "#848178",
    "#b56e6b",
    "#659095",
    "#9e8e67",
    "#819ba7",
    "#a1849f",
    "#7585a2",
    "#9c9c95",
  },
}

return M
