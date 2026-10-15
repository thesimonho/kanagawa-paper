import { palette } from "../palette.ts";
import { blend, brighten, inherit } from "../color/expression.ts";
import type { ThemeDefinition } from "../theme.ts";

export const canvas = {
  ui: {
    text: {
      primary: palette.canvasGray3,
      secondary: palette.canvasGray2,
      muted: palette.canvasGray1,
      contrast: palette.canvasGray3,
      inverse: palette.canvasWhite5,
    },
    surface: {
      tones: {
        m4: palette.canvasGray2,
        m3: palette.canvasGray1,
        m2: palette.canvasWhite1,
        m1: palette.canvasWhite2,
        p1: palette.canvasWhite5,
        p2: palette.canvasWhite6,
      },
      editor: {
        inactiveBackground: palette.canvasWhite3,
        background: palette.canvasWhite4,
      },
      floating: {
        background: palette.canvasWhite6,
        border: {
          background: palette.canvasWhite6,
          foreground: palette.canvasWhite3,
        },
        foreground: palette.canvasGray3,
      },
    },
    editor: {
      gutter: {
        background: palette.canvasWhite2,
      },
      currentLine: {
        background: palette.canvasWhite3,
        alternateBackground: palette.canvasWhite4,
      },
      indent: {
        default: palette.canvasWhite2,
        active: palette.canvasGray1,
      },
      nontext: palette.canvasGray1,
      whitespace: palette.canvasGray1,
      mark: palette.canvasBlue4,
    },
    search: {
      match: {
        background: palette.canvasPink2,
      },
    },
    selection: {
      background: palette.canvasPink3,
    },
    statusline: {
      background: palette.canvasWhite2,
    },
    border: {
      default: palette.canvasGray3,
      separator: palette.canvasViolet2,
    },
    heading: {
      primary: palette.canvasBlue2,
      secondary: palette.canvasOrange1,
    },
    navigation: {
      target: palette.canvasRed1,
    },
    editing: {
      yank: palette.canvasPink2,
    },
    scrollbar: {
      thumb: palette.canvasWhite1,
      menu: {
        track: palette.canvasWhite6,
        thumb: palette.canvasGray1,
      },
    },
    tabs: {
      background: palette.canvasWhite1,
      inactive: {
        foreground: palette.canvasGray2,
        background: palette.canvasWhite1,
      },
      alternate: {
        foreground: palette.canvasPink1,
        background: palette.canvasWhite1,
      },
      indicator: palette.canvasTeal1,
      selected: {
        background: palette.canvasWhite4,
        foreground: palette.canvasGray3,
      },
    },
    menu: {
      border: {
        foreground: palette.canvasWhite3,
        background: palette.canvasWhite6,
      },
      selected: {
        background: palette.canvasWhite3,
        foreground: inherit,
      },
      background: palette.canvasWhite6,
      foreground: palette.canvasGray3,
    },
  },
  accents: {
    special: {
      one: palette.canvasTeal1,
      two: palette.canvasViolet1,
    },
    attention: palette.canvasRed1,
    tertiary: palette.canvasAqua1,
    muted: palette.canvasGray2,
    inverse: palette.canvasWhite2,
    primary: palette.canvasTeal1,
    secondary: palette.canvasOrange1,
  },
  rainbow: {
    4: palette.canvasOrange2,
    5: palette.canvasGreen1,
    6: palette.canvasAsh1,
    7: palette.canvasTeal1,
    1: palette.canvasRed1,
    2: palette.canvasPink1,
    3: palette.canvasBlue1,
  },
  modes: {
    normal: palette.canvasTeal1,
    visual: palette.canvasPink1,
    replace: palette.canvasRed1,
    insert: palette.canvasRed1,
    command: palette.canvasTeal1,
  },
  terminal: {
    bright: {
      black: brighten(palette.canvasGray2, 0.1),
      red: brighten(palette.canvasRed1, 0.1),
      green: brighten(palette.canvasAqua1, 0.1),
      yellow: brighten(palette.canvasYellow1, 0.1),
      blue: brighten(palette.canvasBlue1, 0.2),
      magenta: brighten(palette.canvasPink1, 0.1),
      cyan: brighten(palette.canvasTeal1, 0.1),
      white: brighten(palette.canvasGray1, 0.1),
    },
    indexed: {
      16: palette.canvasOrange1,
      17: palette.canvasRed1,
    },
    normal: {
      black: palette.canvasGray2,
      red: palette.canvasRed1,
      green: palette.canvasAqua1,
      yellow: palette.canvasYellow1,
      blue: palette.canvasBlue1,
      magenta: palette.canvasPink1,
      cyan: palette.canvasTeal1,
      white: palette.canvasGray1,
    },
  },
  changes: {
    added: {
      subtle: blend(palette.canvasGreen2, palette.canvasWhite4, 0.9),
      base: palette.canvasGreen2,
      region: blend(palette.canvasGreen2, palette.canvasWhite4, 0.8),
    },
    removed: {
      base: palette.canvasRed1,
      subtle: blend(palette.canvasRed1, palette.canvasWhite4, 0.9),
      region: blend(palette.canvasRed1, palette.canvasWhite4, 0.8),
    },
    modified: {
      base: palette.canvasYellow1,
      subtle: blend(palette.canvasYellow1, palette.canvasWhite4, 0.9),
      region: blend(palette.canvasYellow2, palette.canvasWhite4, 0.8),
      regionBase: palette.canvasYellow2,
    },
    text: {
      base: palette.canvasTeal1,
      subtle: blend(palette.canvasTeal1, palette.canvasWhite4, 0.8),
    },
    conflict: {
      ours: palette.canvasGreen3,
      theirs: palette.canvasBlue1,
      ancestor: palette.canvasOrange1,
    },
  },
  syntax: {
    number: palette.canvasPink1,
    type: palette.canvasAqua1,
    operator: palette.canvasRed1,
    symbol: palette.canvasRed1,
    attribute: palette.canvasYellow1,
    comment: palette.canvasGray1,
    documentation: palette.canvasGreen3,
    constant: palette.canvasOrange1,
    deprecated: palette.canvasGray1,
    function: palette.canvasAqua1,
    identifier: palette.canvasTeal1,
    keyword: palette.canvasPink1,
    member: palette.canvasRed1,
    parameter: palette.canvasGray3,
    preprocessor: palette.canvasRed1,
    punctuation: palette.canvasGray2,
    statement: palette.canvasViolet1,
    variable: inherit,
    regex: palette.canvasRed1,
    string: palette.canvasGreen1,
  },
  status: {
    success: {
      subtle: blend(palette.canvasGreen2, palette.canvasWhite4, 0.9),
      base: palette.canvasGreen2,
    },
    error: {
      subtle: blend(palette.canvasRed1, palette.canvasWhite4, 0.9),
      base: palette.canvasRed1,
    },
    warning: {
      base: palette.canvasOrange1,
      subtle: blend(palette.canvasOrange1, palette.canvasWhite4, 0.9),
    },
    info: {
      subtle: blend(palette.canvasBlue1, palette.canvasWhite4, 0.9),
      base: palette.canvasBlue1,
    },
    hint: {
      base: palette.canvasAqua1,
      subtle: blend(palette.canvasAqua1, palette.canvasWhite4, 0.9),
    },
  },
} satisfies ThemeDefinition;
