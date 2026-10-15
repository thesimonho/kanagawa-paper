import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------

export def main [] {

    return {
        binary: '${theme.terminal.normal.red}'
        block: '${theme.terminal.normal.blue}'
        cell-path: '${theme.terminal.normal.white}'
        closure: '${theme.terminal.normal.cyan}'
        custom: '${theme.terminal.normal.white}'
        duration: '${theme.terminal.normal.yellow}'
        float: '${theme.terminal.bright.red}'
        glob: '${theme.terminal.normal.white}'
        int: '${theme.terminal.normal.red}'
        list: '${theme.terminal.normal.cyan}'
        nothing: '${theme.terminal.indexed[17]}'
        range: '${theme.terminal.normal.yellow}'
        record: '${theme.terminal.normal.cyan}'
        string: '${theme.terminal.normal.green}'

        bool: {|| if $in { '${theme.terminal.bright.blue}' } else { '${theme.terminal.normal.yellow}' } }

        datetime: {|| (date now) - $in |
            if $in < 1hr {
                { fg: '${theme.terminal.indexed[17]}' attr: 'b' }
            } else if $in < 6hr {
                '${theme.terminal.indexed[17]}'
            } else if $in < 1day {
                '${theme.terminal.normal.yellow}'
            } else if $in < 3day {
                '${theme.terminal.normal.green}'
            } else if $in < 1wk {
                { fg: '${theme.terminal.normal.green}' attr: 'b' }
            } else if $in < 6wk {
                '${theme.terminal.normal.cyan}'
            } else if $in < 52wk {
                '${theme.terminal.normal.blue}'
            } else { 'dark_gray' }
        }

        filesize: {|e|
            if $e == 0b {
                '${theme.terminal.normal.white}'
            } else if $e < 1mb {
                '${theme.terminal.normal.cyan}'
            } else {{ fg: '${theme.terminal.normal.blue}' }}
        }

        shape_and: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_binary: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_block: { fg: '${theme.terminal.normal.blue}' attr: 'b' }
        shape_bool: '${theme.terminal.bright.blue}'
        shape_closure: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_custom: '${theme.terminal.normal.green}'
        shape_datetime: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_directory: '${theme.terminal.normal.cyan}'
        shape_external: '${theme.terminal.normal.cyan}'
        shape_external_resolved: '${theme.terminal.bright.blue}'
        shape_externalarg: { fg: '${theme.terminal.normal.green}' attr: 'b' }
        shape_filepath: '${theme.terminal.normal.cyan}'
        shape_flag: { fg: '${theme.terminal.normal.blue}' attr: 'b' }
        shape_float: { fg: '${theme.terminal.bright.red}' attr: 'b' }
        shape_garbage: { fg: '\${fg.dim}' bg: '${theme.status.error.base}' attr: 'b' } # Keeping red and white for garbage
        shape_glob_interpolation: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_globpattern: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_int: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_internalcall: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_keyword: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_list: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_literal: '${theme.terminal.normal.blue}'
        shape_match_pattern: '${theme.terminal.normal.green}'
        shape_matching_brackets: { attr: 'u' }
        shape_nothing: '${theme.terminal.indexed[17]}'
        shape_operator: '${theme.terminal.normal.yellow}'
        shape_or: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_pipe: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_range: { fg: '${theme.terminal.normal.yellow}' attr: 'b' }
        shape_raw_string: { fg: '${theme.terminal.normal.white}' attr: 'b' }
        shape_record: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_redirection: { fg: '${theme.terminal.normal.red}' attr: 'b' }
        shape_signature: { fg: '${theme.terminal.normal.green}' attr: 'b' }
        shape_string: '${theme.terminal.normal.green}'
        shape_string_interpolation: { fg: '${theme.terminal.normal.cyan}' attr: 'b' }
        shape_table: { fg: '${theme.terminal.normal.blue}' attr: 'b' }
        shape_vardecl: { fg: '${theme.terminal.normal.blue}' attr: 'u' }
        shape_variable: '${theme.terminal.normal.red}'

        foreground: '${theme.ui.text.primary}'
        background: '${theme.ui.surface.editor.background}'
        cursor: '${theme.modes.normal}'

        empty: '${theme.terminal.normal.blue}'
        header: { fg: '${theme.terminal.normal.green}' attr: 'b' }
        hints: '${theme.syntax.comment}'
        leading_trailing_space_bg: { attr: 'n' }
        row_index: { fg: '${theme.terminal.normal.green}' attr: 'b' }
        search_result: { fg: '${theme.terminal.indexed[17]}' bg: '${theme.terminal.normal.white}' }
        separator: '${theme.terminal.normal.white}'
    }
}

# Update the Nushell configuration
export def --env "set color_config" [] {
    $env.config.color_config = (main)
}

# Update terminal colors
export def "update terminal" [] {
    let theme = (main)

    # Set terminal colors
    let osc_screen_foreground_color = '10;'
    let osc_screen_background_color = '11;'
    let osc_cursor_color = '12;'
        
    $"
    (ansi -o $osc_screen_foreground_color)($theme.foreground)(char bel)
    (ansi -o $osc_screen_background_color)($theme.background)(char bel)
    (ansi -o $osc_cursor_color)($theme.cursor)(char bel)
    "
    # Line breaks above are just for source readability
    # but create extra whitespace when activating. Collapse
    # to one line and print with no-newline
    | str replace --all "\\n" ''
    | print -n $"($in)\\r"
}

export module activate {
    export-env {
        set color_config
        update terminal
    }
}

# Activate the theme when sourced
use activate
  `,
  };
}
