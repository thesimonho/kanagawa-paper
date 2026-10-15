import { palette } from "../palette.ts";
import { blend, brighten, inherit } from "../color/expression.ts";
import type { ThemeDefinition } from "../theme.ts";

export const ink = {
  ui: {
    text: {
      primary: palette.fujiWhite,
      secondary: palette.dragonGray2,
      muted: palette.dragonBlack5,
      contrast: palette.dragonBlack3,
      inverse: palette.dragonBlack2,
    },
    surface: {
      tones: {
        m4: palette.sumiInkn1,
        m3: palette.sumiInk0,
        m2: palette.sumiInk1,
        m1: palette.sumiInk2,
        p1: palette.sumiInk4,
        p2: palette.sumiInk5,
      },
      editor: {
        inactiveBackground: palette.sumiInk1,
        background: palette.sumiInk3,
      },
      floating: {
        background: palette.sumiInk4,
        border: {
          background: palette.sumiInk4,
          foreground: palette.sumiInk5,
        },
        foreground: palette.oldWhite,
      },
    },
    editor: {
      lineNumbers: {
        default: palette.sumiInk6,
        active: palette.dragonYellow,
      },
      gutter: {
        background: palette.sumiInk4,
      },
      currentLine: {
        background: palette.sumiInk4,
        alternateBackground: palette.sumiInk5,
      },
      indent: {
        default: palette.sumiInk5,
        active: palette.dragonViolet,
      },
      nontext: palette.sumiInk6,
      whitespace: palette.sumiInk6,
      mark: palette.waveAqua2,
    },
    search: {
      match: {
        background: palette.springViolet1,
      },
    },
    selection: {
      background: palette.sumiInk5,
    },
    statusline: {
      background: palette.sumiInk4,
    },
    border: {
      default: palette.dragonBlack6,
      separator: palette.dragonViolet,
    },
    heading: {
      primary: palette.dragonViolet,
      secondary: palette.dragonOrange,
    },
    navigation: {
      target: palette.dragonRed,
    },
    editing: {
      yank: palette.sumiInk6,
    },
    scrollbar: {
      thumb: palette.sumiInk5,
      menu: {
        track: palette.sumiInk4,
        thumb: palette.sumiInk6,
      },
    },
    tabs: {
      background: palette.sumiInk0,
      inactive: {
        foreground: palette.dragonBlack5,
        background: palette.sumiInk0,
      },
      alternate: {
        foreground: palette.dragonPink,
        background: palette.sumiInk0,
      },
      indicator: palette.dragonBlue,
      selected: {
        background: palette.sumiInk3,
        foreground: palette.dragonWhite,
      },
    },
    menu: {
      border: {
        foreground: palette.sumiInk5,
        background: palette.sumiInk4,
      },
      selected: {
        background: palette.sumiInk5,
        foreground: inherit,
      },
      background: palette.sumiInk4,
      foreground: palette.fujiWhite,
    },
  },
  accents: {
    special: {
      one: palette.dragonYellow,
      two: palette.springViolet1,
    },
    attention: palette.dragonRed,
    tertiary: palette.waveAqua1,
    muted: palette.dragonGray3,
    inverse: palette.sumiInk4,
    primary: palette.dragonBlue,
    secondary: palette.dragonOrange,
  },
  rainbow: {
    4: palette.dragonOrange2,
    5: palette.dragonGreen,
    6: palette.dragonAsh,
    7: palette.dragonTeal,
    1: palette.dragonRed,
    2: palette.dragonPink,
    3: palette.dragonBlue,
  },
  modes: {
    normal: palette.dragonYellow,
    visual: palette.springViolet1,
    replace: palette.dragonRed,
    insert: palette.dragonRed,
    command: palette.dragonYellow,
  },
  terminal: {
    bright: {
      black: brighten(palette.dragonBlack5, 0.6),
      red: brighten(palette.dragonRed, 0.2),
      green: brighten(palette.dragonGreen, 0.1),
      yellow: brighten(palette.dragonYellow, 0.2),
      blue: brighten(palette.dragonBlue5, 0.3),
      magenta: brighten(palette.dragonPink, 0.2),
      cyan: brighten(palette.dragonAqua, 0.1),
      white: brighten(palette.oldWhite, 0.2),
    },
    indexed: {
      16: palette.dragonOrange,
      17: palette.dragonRed,
    },
    normal: {
      black: palette.dragonBlack5,
      red: palette.dragonRed,
      green: palette.dragonGreen,
      yellow: palette.dragonYellow,
      blue: palette.dragonBlue5,
      magenta: palette.dragonPink,
      cyan: palette.dragonAqua,
      white: palette.oldWhite,
    },
  },
  changes: {
    added: {
      subtle: blend(palette.dragonGreen, palette.sumiInk3, 0.9),
      base: palette.dragonGreen,
      region: blend(palette.dragonGreen, palette.sumiInk3, 0.9),
    },
    removed: {
      base: palette.dragonRed,
      subtle: blend(palette.dragonRed, palette.sumiInk3, 0.9),
      region: blend(palette.dragonRed, palette.sumiInk3, 0.9),
    },
    modified: {
      base: palette.dragonYellow,
      subtle: blend(palette.dragonYellow, palette.sumiInk3, 0.9),
      region: blend(palette.dragonYellow, palette.sumiInk3, 0.9),
      regionBase: palette.dragonYellow,
    },
    text: {
      base: palette.dragonBlue,
      subtle: blend(palette.dragonBlue, palette.sumiInk3, 0.9),
    },
    conflict: {
      ours: palette.dragonGreen3,
      theirs: palette.dragonBlue5,
      ancestor: palette.dragonOrange2,
    },
  },
  syntax: {
    number: palette.dragonPink,
    type: palette.dragonAqua,
    operator: palette.dragonRed,
    symbol: palette.dragonRed,
    attribute: palette.dragonYellow,
    comment: palette.fujiGray,
    documentation: palette.dragonGreen3,
    constant: palette.dragonOrange,
    deprecated: palette.katanaGray,
    function: palette.dragonBlue2,
    identifier: palette.dragonYellow,
    keyword: palette.dragonPink,
    member: palette.dragonRed,
    parameter: palette.dragonGray,
    preprocessor: palette.dragonRed,
    punctuation: palette.dragonGray2,
    statement: palette.dragonViolet,
    variable: inherit,
    regex: palette.dragonRed,
    string: palette.dragonGreen2,
  },
  status: {
    success: {
      subtle: blend(palette.dragonGreen, palette.sumiInk3, 0.92),
      base: palette.dragonGreen,
    },
    error: {
      subtle: blend(palette.dragonRed, palette.sumiInk3, 0.92),
      base: palette.dragonRed,
    },
    warning: {
      base: palette.dragonYellow,
      subtle: blend(palette.dragonYellow, palette.sumiInk3, 0.92),
    },
    info: {
      subtle: blend(palette.dragonBlue, palette.sumiInk3, 0.92),
      base: palette.dragonBlue,
    },
    hint: {
      base: palette.dragonAqua,
      subtle: blend(palette.dragonAqua, palette.sumiInk3, 0.92),
    },
  },
} satisfies ThemeDefinition;
