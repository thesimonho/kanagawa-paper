---@alias ColorSpec string RGB Hex string

---@class KanagawaConfig
---@field _theme? "auto" | "ink" | "canvas"
---@field undercurl? boolean
---@field transparent? boolean
---@field gutter? boolean
---@field diag_background? boolean
---@field dim_inactive? boolean
---@field terminal_colors? boolean
---@field cache? boolean
---@field styles? {comment: vim.api.keyset.highlight, functions: vim.api.keyset.highlight, keyword: vim.api.keyset.highlight, statement: vim.api.keyset.highlight, type: vim.api.keyset.highlight,}
---@field colors? {palette: PaletteColors, theme: {ink: ThemeColors, canvas: ThemeColors}}
---@field color_balance? table<string, ColorOffset>
---@field overrides? fun(colors: KanagawaColors): table<string, vim.api.keyset.highlight>
---@field all_plugins? boolean
---@field auto_plugins? boolean
---@field plugins? table<string, boolean>

---@class KanagawaCache
---@field colors KanagawaColors
---@field highlights table<string, vim.api.keyset.highlight>
---@field termcolors table<number, ColorSpec>
---@field opts KanagawaConfig
---@field version string

---@class ColorOffset
---@field brightness number [-1, 1]
---@field saturation number [-1, 1]

---@class KanagawaGroups
---@field [string] vim.api.keyset.highlight

---@class KanagawaColors
---@field palette? PaletteColors
---@field theme ThemeColors
