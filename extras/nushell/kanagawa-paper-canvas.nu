# -----------------------------------------------------------------------------
# Kanagawa Paper Canvas
# Upstream: https://github.com/thesimonho/kanagawa-paper/tree/main/extras/nushell/kanagawa-paper-canvas.nu
# URL: https://www.nushell.sh/
# -----------------------------------------------------------------------------

export def main [] {

    return {
        binary: '#a36360'
        block: '#6c828c'
        cell-path: '#92928b'
        closure: '#6a7893'
        custom: '#92928b'
        duration: '#91825e'
        float: '#b56e6b'
        glob: '#92928b'
        int: '#a36360'
        list: '#6a7893'
        nothing: '#a36360'
        range: '#91825e'
        record: '#6a7893'
        string: '#5c8388'

        bool: {|| if $in { '#819ba7' } else { '#91825e' } }

        datetime: {|| (date now) - $in |
            if $in < 1hr {
                { fg: '#a36360' attr: 'b' }
            } else if $in < 6hr {
                '#a36360'
            } else if $in < 1day {
                '#91825e'
            } else if $in < 3day {
                '#5c8388'
            } else if $in < 1wk {
                { fg: '#5c8388' attr: 'b' }
            } else if $in < 6wk {
                '#6a7893'
            } else if $in < 52wk {
                '#6c828c'
            } else { 'dark_gray' }
        }

        filesize: {|e|
            if $e == 0b {
                '#92928b'
            } else if $e < 1mb {
                '#6a7893'
            } else {{ fg: '#6c828c' }}
        }

        shape_and: { fg: '#a36360' attr: 'b' }
        shape_binary: { fg: '#a36360' attr: 'b' }
        shape_block: { fg: '#6c828c' attr: 'b' }
        shape_bool: '#819ba7'
        shape_closure: { fg: '#6a7893' attr: 'b' }
        shape_custom: '#5c8388'
        shape_datetime: { fg: '#6a7893' attr: 'b' }
        shape_directory: '#6a7893'
        shape_external: '#6a7893'
        shape_external_resolved: '#819ba7'
        shape_externalarg: { fg: '#5c8388' attr: 'b' }
        shape_filepath: '#6a7893'
        shape_flag: { fg: '#6c828c' attr: 'b' }
        shape_float: { fg: '#b56e6b' attr: 'b' }
        shape_garbage: { fg: '#77746c' bg: '#a36360' attr: 'b' }
        shape_glob_interpolation: { fg: '#6a7893' attr: 'b' }
        shape_globpattern: { fg: '#6a7893' attr: 'b' }
        shape_int: { fg: '#a36360' attr: 'b' }
        shape_internalcall: { fg: '#6a7893' attr: 'b' }
        shape_keyword: { fg: '#a36360' attr: 'b' }
        shape_list: { fg: '#6a7893' attr: 'b' }
        shape_literal: '#6c828c'
        shape_match_pattern: '#5c8388'
        shape_matching_brackets: { attr: 'u' }
        shape_nothing: '#a36360'
        shape_operator: '#91825e'
        shape_or: { fg: '#a36360' attr: 'b' }
        shape_pipe: { fg: '#a36360' attr: 'b' }
        shape_range: { fg: '#91825e' attr: 'b' }
        shape_raw_string: { fg: '#92928b' attr: 'b' }
        shape_record: { fg: '#6a7893' attr: 'b' }
        shape_redirection: { fg: '#a36360' attr: 'b' }
        shape_signature: { fg: '#5c8388' attr: 'b' }
        shape_string: '#5c8388'
        shape_string_interpolation: { fg: '#6a7893' attr: 'b' }
        shape_table: { fg: '#6c828c' attr: 'b' }
        shape_vardecl: { fg: '#6c828c' attr: 'u' }
        shape_variable: '#a36360'

        foreground: '#616569'
        background: '#e1e1de'
        cursor: '#6a7893'

        empty: '#6c828c'
        header: { fg: '#5c8388' attr: 'b' }
        hints: '#92928b'
        leading_trailing_space_bg: { attr: 'n' }
        row_index: { fg: '#5c8388' attr: 'b' }
        search_result: { fg: '#a36360' bg: '#92928b' }
        separator: '#92928b'
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
    | str replace --all "\n" ''
    | print -n $"($in)\r"
}

export module activate {
    export-env {
        set color_config
        update terminal
    }
}

# Activate the theme when sourced
use activate
  