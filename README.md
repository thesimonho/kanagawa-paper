# 🌊 Kanagawa Paper

<p align="center">
Remixed light and dark Kanagawa color scheme with muted colors. For Neovim and VS Code.
</p>

<p align="center">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/thesimonho/kanagawa-paper?style=for-the-badge&labelColor=1F1F28&color=c4b28a">

<img alt="GitHub Release" src="https://img.shields.io/github/v/release/thesimonho/kanagawa-paper?style=for-the-badge&labelColor=1F1F28&color=887389">

<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/thesimonho/kanagawa-paper?style=for-the-badge&labelColor=1F1F28&color=5d7a88">

<img alt="GitHub branch check runs" src="https://img.shields.io/github/check-runs/thesimonho/kanagawa-paper/main?style=for-the-badge&label=build&labelColor=1F1F28&color=699469">

</p>

## 💡 Motivation

I love the original [kanagawa.nvim](https://github.com/rebelot/kanagawa.nvim) color scheme, but I found some of the colors a bit too bright and distracting. What I wanted was a more muted theme overall, using less saturated colors inspired by the original theme. You can see a visual preview of the color palette [here](https://github.com/thesimonho/kanagawa-paper/blob/main/palette_colors.md).

Both a light theme and a dark theme are provided.

Install the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=SimonHo.kanagawa-paper) or use the Neovim installation below.
![ink](https://github.com/user-attachments/assets/68d6e82f-8dbb-4b96-9844-dcde55b264ee)
![canvas](https://github.com/user-attachments/assets/b653e9a0-260d-462a-8ad8-93290deed0b8)

## ⚡️ Requirements

- [Neovim](https://github.com/neovim/neovim) >= [0.8.0](https://github.com/neovim/neovim/releases/tag/v0.8.0)
- truecolor terminal support
- undercurl terminal support (optional)

## 📦 Installation

Install the theme with your preferred package manager, such as [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  "thesimonho/kanagawa-paper",
  branch = "neovim",
  lazy = false,
  priority = 1000,
  opts = {},
}
```

The `neovim` branch contains the installable runtime. The `main` branch contains development source. To pin a release, replace `branch` with `tag = "neovim-X.Y.Z"` using a published Neovim version. Historical `v*` tags remain available; they do not receive a separate update track.

## VS Code

Install **Kanagawa Paper** by **SimonHo** from the Marketplace, then select **Kanagawa Paper Ink** or **Kanagawa Paper Canvas**. The extension identity remains `SimonHo.kanagawa-paper`.

## Releases

Applications have independent versions and changelogs. Tags such as `neovim-4.2.0` identify installable distributions; `neovim-source-4.2.0` identifies their development source. There is no moving latest tag. Use the repository’s **Deployments → View deployment** links for each application’s latest successful publication, or the [release list](https://github.com/thesimonho/kanagawa-paper/releases) and [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=SimonHo.kanagawa-paper) directly. GitHub’s repository-wide Latest label can refer to either application.

## 🚀 Usage

Kanagawa Paper comes in a few variants:

- `kanagawa-paper-ink` for late nights
- `kanagawa-paper-canvas` for sunny days
- `kanagawa-paper` for automatic theme switching based on `vim.o.background`

Themes can be changed in a couple of ways:

- Using the background option:
  Any change to the value of `vim.o.background` will select the corresponding light or dark theme. If this is unset, the theme will default to the dark theme `ink`.
- Loading the color scheme directly with:

Vim:

```vim
colorscheme kanagawa-paper
colorscheme kanagawa-paper-ink
colorscheme kanagawa-paper-canvas
```

Neovim:

```lua
vim.cmd.colorscheme("kanagawa-paper")
vim.cmd.colorscheme("kanagawa-paper-ink")
vim.cmd.colorscheme("kanagawa-paper-canvas")
```

A full plugin spec example using [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
return {
  "thesimonho/kanagawa-paper",
  branch = "neovim",
  lazy = false,
  priority = 1000,
  init = function()
    vim.cmd.colorscheme("kanagawa-paper-ink")
  end,
  opts = {...},
}
```

## 🛠️ Configuration

> [!NOTE]
> Config options have changed between v1 and v2 of the color scheme.

> [!IMPORTANT]
> Set the configuration **BEFORE** loading the color scheme to ensure the settings are applied, otherwise defaults will be used.

The default configuration can be found [here](https://github.com/thesimonho/kanagawa-paper/blob/main/packages/neovim/lua/kanagawa-paper/config.lua)

```lua
require("kanagawa-paper").setup({
 -- enable undercurls for underlined text
 undercurl = true,
 -- transparent background
 transparent = false,
 -- highlight background for the left gutter
 gutter = false,
 -- background for diagnostic virtual text
 diag_background = true,
 -- dim inactive windows. Disabled when transparent
 dim_inactive = false,
 -- set colors for terminal buffers
 terminal_colors = true,
 -- cache highlights and colors for faster startup.
 -- see Cache section for more details.
 cache = false,

 styles = {
  -- style for comments
  comment = { italic = true },
  -- style for functions
  functions = { italic = false },
  -- style for keywords
  keyword = { italic = false, bold = false },
  -- style for statements
  statement = { italic = false, bold = false },
  -- style for types
  type = { italic = false },
 },
 -- override default palette and theme colors
 colors = {
  palette = {},
  theme = {
   ink = {},
   canvas = {},
  },
 },
 -- adjust overall color balance for each theme [-1, 1]
 color_balance = {
  ink = { brightness = 0, saturation = 0 },
  canvas = { brightness = 0, saturation = 0 },
 },
 -- override highlight groups
 overrides = function(colors)
  return {}
 end,

 -- uses lazy.nvim, if installed, to automatically enable needed plugins
 auto_plugins = true,
 -- enable highlights for all plugins (disabled if using lazy.nvim)
 all_plugins = package.loaded.lazy == nil,
 -- manually enable/disable individual plugins.
 -- check the `groups/plugins` directory for the exact names
 plugins = {
  -- examples:
  -- rainbow_delimiters = true
  -- which_key = false
 },
})
```

### Cache

The color scheme comes with a cache option that can be used to speed up startup time.

When you set `cache = true` in your config, the theme colors and all of your edits/adjustments will be saved to a cache file. This is loaded at startup so colors don't need to be recomputed every time.

Any changes you make to your config (e.g. overriding colors or highlight groups) should automatically invalidate the cache and build a new one.

In rare cases where this doesn't happen and you notice your changes aren't being applied, you can manually rebuild the cache by running `:KanagawaPaperCache`.

## 👥 Integrations

### Terminals

Matching colorschemes for a number of terminals are provided (e.g. WezTerm, ghostty, etc; see [Extras](https://github.com/thesimonho/kanagawa-paper#-extras)).

The automatic variant of `kanagawa-paper` switches between light and dark mode based on the value of `vim.o.background`. This value will generally follow the color mode of your terminal, i.e. if your terminal is set to dark mode via your OS, neovim will pick that up and the theme will automatically be changed to `kanagawa-paper-ink`.

Tip: if this auto switching is not working for you, the _first_ thing to check is whether the value of `vim.o.background` is what you expect it to be.

### [Lualine](https://github.com/nvim-lualine/lualine.nvim)

This color scheme comes with matching Lualine themes for both `ink` and `canvas` variants.

This will set the theme at startup:

```lua
local kanagawa_paper = require("lualine.themes.kanagawa-paper-ink")
-- local kanagawa_paper = require("lualine.themes.kanagawa-paper-canvas")

require("lualine").setup({
 options = {
  theme = kanagawa_paper,
  -- ... your lualine config
 },
})
```

For a more advanced use case you can make use of the background color to set the Lualine theme dynamically. This switches Lualine between light and dark themes based on background color:

```lua
require("lualine").setup({
 options = {
  theme = function()
    -- pcall and fallback theme is to handle the case of theme switching/previewing
    local ok, t = pcall(
      require,
      "lualine.themes." .. (vim.o.background == "light" and "kanagawa-paper-canvas" or "kanagawa-paper-ink")
    )
    if ok then
      theme = t
    else
      theme = require("some other fallback theme")
    end
    return theme
  end,
  -- ... your lualine config
 },
})
```

Examples of situations where this might be useful:

- You want to change the theme mid-session
- You want to change background color mid-session (either by manually setting `vim.o.background` or with something like dark background toggle in LazyVim)
- You use a plugin for live previews of color schemes

### [WezTerm](https://wezfurlong.org/wezterm/) and [WezTerm Tabline](https://github.com/michaelbrusegard/tabline.wez) (deprecated)

This feature has been deprecated. If you'd like to use it, you can still find the old script and instructions (README) in [v3.1](https://github.com/thesimonho/kanagawa-paper/tree/v3.1?tab=readme-ov-file#-integrations)

## 🔧 Customizing Colors

There are two kinds of colors: `PaletteColors` and `ThemeColors`.

`PaletteColors` are defined directly as RGB Hex strings, and have arbitrary names
that recall their actual color. Conversely, `ThemeColors` are named and grouped _semantically_
on the basis of their actual function.

In short, a `palette` defines all the available colors, while a `theme` maps the `PaletteColors`
to specific `ThemeColors` and the same palette color may be assigned to multiple theme colors.

You can change _both_ theme or palette colors using `config.colors`.
All the palette color names can be found [here](https://github.com/thesimonho/kanagawa-paper/blob/main/shared/lua/kanagawa-paper/palette.lua),
while their usage by each theme can be found [here](https://github.com/thesimonho/kanagawa-paper/tree/main/shared/lua/kanagawa-paper/themes).

You can see a visual preview of the entire color palette [here](https://github.com/thesimonho/kanagawa-paper/blob/main/palette_colors.md).

```lua
require('kanagawa-paper').setup({
  colors = {
    palette = {
      -- change all usages of these color names
      sumiInk0 = "#000000",
      fujiWhite = "#FFFFFF",
    },
    theme = {
      -- change specific usages for a specific theme
      ink = {
        ui = {
          float = {
            fg = "#ff0000",
          },
        },
      },
      canvas = {
      -- ...
      }
    },
  }
})
```

You can also conveniently add/modify `hlgroups` using the `config.overrides` option.
Supported keywords are the same for `:h nvim_set_hl` `{val}` parameter.

```lua
require("kanagawa-paper").setup({
 overrides = function(colors)
  return {
   -- Assign a static color to strings
   String = { fg = colors.palette.carpYellow, italic = true },
   -- theme colors will update dynamically when you change theme!
   SomePluginHl = { fg = colors.theme.syn.type, bold = true },
  }
 end,
})
```

You can find a more detailed explanation of color customization [here](https://github.com/thesimonho/kanagawa-paper/issues/3#issuecomment-2183665367).

### Extracting colors

You can get the palette and theme colors from the colors module like this:

```lua
-- Get the colors for the current theme
local colors = require("kanagawa-paper.colors")
local palette_colors = colors.palette
local theme_colors = colors.theme
```

and use them in your `opts` function. Example:

```lua
{
  "thesimonho/kanagawa-paper",
  branch = "neovim",
  lazy = false,
  priority = 1000,
  opts = function()
    local colors = require("kanagawa-paper.colors")
    local palette_colors = colors.palette
    return {
      colors = {
        theme = {
          ink = {
            ui = {
              bg_dim = palette_colors.boatYellow2,
            },
          },
        },
      },
    }
  end
}
```

## 🍭 Extras

- [alacritty](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/alacritty)
- [foot](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/foot)
- [ghostty](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/ghostty)
- [kitty](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/kitty)
- [nchat](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/nchat)
- [nushell](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/nushell)
- [tailwind](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/tailwind)
- [terminator](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/terminator)
- [termux](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/termux)
- [tilix](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/tilix)
- [vivid](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/vivid)
- [zellij](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/zellij)
- [vscode](https://github.com/thesimonho/kanagawa-paper.vscode) (official port)
- [vscode terminal](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/vscode_terminal) (guide: [Visual Studio Code Theme Color](https://code.visualstudio.com/api/references/theme-color))
- [fzf](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/fzf) (guide: [fzf color schemes](https://github.com/junegunn/fzf/wiki/Color-schemes))
- [wezterm](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/wezterm) (guide: [Defining a Color Scheme in a separate file](https://wezfurlong.org/wezterm/config/appearance.html#defining-a-color-scheme-in-a-separate-file))
- [wezterm tabline](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/wezterm_tabline) (guide: [tabline.wez](https://github.com/michaelbrusegard/tabline.wez))
- [windows terminal](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/windows_terminal) (guide: [Color schemes in Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes))

## 🔥 Contributing

Pull requests are welcome for theme fixes, new features, and new extras.

Using the [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages is recommended. PRs will then automatically be added to the next Release Notes and application changelogs ([Neovim](https://github.com/thesimonho/kanagawa-paper/blob/main/packages/neovim/CHANGELOG.md), [VS Code](https://github.com/thesimonho/kanagawa-paper/blob/main/packages/vscode/CHANGELOG.md)).

For the [extras](https://github.com/thesimonho/kanagawa-paper/tree/main/extras/), we use a simple template system that can be used to generate styles for the different themes.

How to add a new extra template:

1. Create a new template file in [generators/lua/kanagawa-paper/extras](https://github.com/thesimonho/kanagawa-paper/tree/main/generators/lua/kanagawa-paper/extras).
2. Add the name and output file extension to the `extras` table in [generators/lua/kanagawa-paper/extras/init.lua](https://github.com/thesimonho/kanagawa-paper/blob/main/generators/lua/kanagawa-paper/extras/init.lua).
3. Open a PR. CI checks that the extras, palette, and Neovim help generators run successfully. For an optional local preview, run `just generate`.

> [!IMPORTANT]
> After merge, automation generates and commits the extras, palette preview, and Neovim help to the default branch. You do not need to generate or commit these outputs locally, including when contributing from a fork.

## 👏 Acknowledgements

- [Kanagawa for Neovim](https://github.com/rebelot/kanagawa.nvim)
- [Kanagawa for VS Code](https://github.com/barklan/kanagawa.vscode)
- [Tokyo Night](https://github.com/folke/tokyonight.nvim)

## Development

Run `just test` for Neovim tests, `just test-targets` for package tests, and `just build` to assemble both installable trees under `dist/`. Build tools are Python 3 and Neovim; release tooling is pinned separately under `scripts/ci/release/`.

Open Neovim from the repository root with your existing lazy.nvim setup. The local `.lazy.lua` selects `packages/neovim`, adds `shared` to the runtime, activates Canvas, and reloads theme modules on save. After this file changes, review it and run `:trust` from its buffer so Neovim can load the updated local specification. No dotfile change or build per Lua edit is required.

| Directory | Purpose |
| --- | --- |
| `shared/` | Shared palette, semantic roles, and color calculations |
| `packages/` | Neovim runtime and VS Code application mappings |
| `generators/` | Existing lightweight extras generators |
| `extras/` | Copyable generated application configurations |
| `scripts/` | Tests, package assembly, and release coordination |
| `tests/` | Runtime and package checks |
