import type { ColorExpression, Resolved } from "./color/expression.ts";

/** Shared intent and presentation variants. Target exceptions stay in adapters. */
export interface ThemeDefinition {
  ui: {
    text: {
      primary: ColorExpression;
      secondary: ColorExpression;
      muted: ColorExpression;
      contrast: ColorExpression;
      inverse: ColorExpression;
    };
    surface: {
      tones: {
        m4: ColorExpression;
        m3: ColorExpression;
        m2: ColorExpression;
        m1: ColorExpression;
        p1: ColorExpression;
        p2: ColorExpression;
      };
      editor: {
        inactiveBackground: ColorExpression;
        background: ColorExpression;
      };
      floating: {
        background: ColorExpression;
        border: {
          background: ColorExpression;
          foreground: ColorExpression;
        };
        foreground: ColorExpression;
      };
    };
    editor: {
      lineNumbers: {
        default: ColorExpression;
        active: ColorExpression;
      };
      gutter: {
        background: ColorExpression;
      };
      currentLine: {
        background: ColorExpression;
        alternateBackground: ColorExpression;
      };
      indent: {
        default: ColorExpression;
        active: ColorExpression;
      };
      nontext: ColorExpression;
      whitespace: ColorExpression;
      mark: ColorExpression;
    };
    search: {
      match: {
        background: ColorExpression;
      };
    };
    selection: {
      background: ColorExpression;
    };
    statusline: {
      background: ColorExpression;
    };
    border: {
      default: ColorExpression;
      separator: ColorExpression;
    };
    heading: {
      primary: ColorExpression;
      secondary: ColorExpression;
    };
    navigation: {
      target: ColorExpression;
    };
    editing: {
      yank: ColorExpression;
    };
    scrollbar: {
      thumb: ColorExpression;
      menu: {
        track: ColorExpression;
        thumb: ColorExpression;
      };
    };
    tabs: {
      background: ColorExpression;
      inactive: {
        foreground: ColorExpression;
        background: ColorExpression;
      };
      alternate: {
        foreground: ColorExpression;
        background: ColorExpression;
      };
      indicator: ColorExpression;
      selected: {
        background: ColorExpression;
        foreground: ColorExpression;
      };
    };
    menu: {
      border: {
        foreground: ColorExpression;
        background: ColorExpression;
      };
      selected: {
        background: ColorExpression;
        foreground: ColorExpression;
      };
      background: ColorExpression;
      foreground: ColorExpression;
    };
  };
  accents: {
    special: {
      one: ColorExpression;
      two: ColorExpression;
    };
    attention: ColorExpression;
    tertiary: ColorExpression;
    muted: ColorExpression;
    inverse: ColorExpression;
    primary: ColorExpression;
    secondary: ColorExpression;
  };
  rainbow: {
    4: ColorExpression;
    5: ColorExpression;
    6: ColorExpression;
    7: ColorExpression;
    1: ColorExpression;
    2: ColorExpression;
    3: ColorExpression;
  };
  modes: {
    normal: ColorExpression;
    visual: ColorExpression;
    replace: ColorExpression;
    insert: ColorExpression;
    command: ColorExpression;
  };
  terminal: {
    bright: {
      black: ColorExpression;
      red: ColorExpression;
      green: ColorExpression;
      yellow: ColorExpression;
      blue: ColorExpression;
      magenta: ColorExpression;
      cyan: ColorExpression;
      white: ColorExpression;
    };
    indexed: {
      16: ColorExpression;
      17: ColorExpression;
    };
    normal: {
      black: ColorExpression;
      red: ColorExpression;
      green: ColorExpression;
      yellow: ColorExpression;
      blue: ColorExpression;
      magenta: ColorExpression;
      cyan: ColorExpression;
      white: ColorExpression;
    };
  };
  changes: {
    added: {
      subtle: ColorExpression;
      base: ColorExpression;
      region: ColorExpression;
    };
    removed: {
      base: ColorExpression;
      subtle: ColorExpression;
      region: ColorExpression;
    };
    modified: {
      base: ColorExpression;
      subtle: ColorExpression;
      region: ColorExpression;
      regionBase: ColorExpression;
    };
    text: {
      base: ColorExpression;
      subtle: ColorExpression;
    };
    conflict: {
      ours: ColorExpression;
      theirs: ColorExpression;
      ancestor: ColorExpression;
    };
  };
  syntax: {
    number: ColorExpression;
    type: ColorExpression;
    operator: ColorExpression;
    symbol: ColorExpression;
    attribute: ColorExpression;
    comment: ColorExpression;
    documentation: ColorExpression;
    constant: ColorExpression;
    deprecated: ColorExpression;
    function: ColorExpression;
    builtinFunction: ColorExpression;
    tag: ColorExpression;
    selector: ColorExpression;
    identifier: ColorExpression;
    keyword: ColorExpression;
    member: ColorExpression;
    parameter: ColorExpression;
    preprocessor: ColorExpression;
    punctuation: ColorExpression;
    statement: ColorExpression;
    variable: ColorExpression;
    regex: ColorExpression;
    string: ColorExpression;
  };
  status: {
    success: {
      subtle: ColorExpression;
      base: ColorExpression;
    };
    error: {
      subtle: ColorExpression;
      base: ColorExpression;
    };
    warning: {
      base: ColorExpression;
      subtle: ColorExpression;
    };
    info: {
      subtle: ColorExpression;
      base: ColorExpression;
    };
    hint: {
      base: ColorExpression;
      subtle: ColorExpression;
    };
  };
}

export type Theme = Resolved<ThemeDefinition>;
export type Variant = "ink" | "canvas";
