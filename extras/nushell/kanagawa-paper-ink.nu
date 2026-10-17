# -----------------------------------------------------------------------------
# Kanagawa Paper Ink
# Upstream: https://github.com/thesimonho/kanagawa-paper/tree/main/extras/nushell/kanagawa-paper-ink.nu
# URL: https://www.nushell.sh/
# -----------------------------------------------------------------------------

export def main [] {

    return {
        binary: '#c4746e'
        block: '#435965'
        cell-path: '#C8C093'
        closure: '#8ea49e'
        custom: '#C8C093'
        duration: '#c4b28a'
        float: '#cc928e'
        glob: '#C8C093'
        int: '#c4746e'
        list: '#8ea49e'
        nothing: '#c4746e'
        range: '#c4b28a'
        record: '#8ea49e'
        string: '#699469'

        bool: {|| if $in { '#698a9b' } else { '#c4b28a' } }

        datetime: {|| (date now) - $in |
            if $in < 1hr {
                { fg: '#c4746e' attr: 'b' }
            } else if $in < 6hr {
                '#c4746e'
            } else if $in < 1day {
                '#c4b28a'
            } else if $in < 3day {
                '#699469'
            } else if $in < 1wk {
                { fg: '#699469' attr: 'b' }
            } else if $in < 6wk {
                '#8ea49e'
            } else if $in < 52wk {
                '#435965'
            } else { 'dark_gray' }
        }

        filesize: {|e|
            if $e == 0b {
                '#C8C093'
            } else if $e < 1mb {
                '#8ea49e'
            } else {{ fg: '#435965' }}
        }

        shape_and: { fg: '#c4746e' attr: 'b' }
        shape_binary: { fg: '#c4746e' attr: 'b' }
        shape_block: { fg: '#435965' attr: 'b' }
        shape_bool: '#698a9b'
        shape_closure: { fg: '#8ea49e' attr: 'b' }
        shape_custom: '#699469'
        shape_datetime: { fg: '#8ea49e' attr: 'b' }
        shape_directory: '#8ea49e'
        shape_external: '#8ea49e'
        shape_external_resolved: '#698a9b'
        shape_externalarg: { fg: '#699469' attr: 'b' }
        shape_filepath: '#8ea49e'
        shape_flag: { fg: '#435965' attr: 'b' }
        shape_float: { fg: '#cc928e' attr: 'b' }
        shape_garbage: { fg: '#9e9b93' bg: '#c4746e' attr: 'b' }
        shape_glob_interpolation: { fg: '#8ea49e' attr: 'b' }
        shape_globpattern: { fg: '#8ea49e' attr: 'b' }
        shape_int: { fg: '#c4746e' attr: 'b' }
        shape_internalcall: { fg: '#8ea49e' attr: 'b' }
        shape_keyword: { fg: '#c4746e' attr: 'b' }
        shape_list: { fg: '#8ea49e' attr: 'b' }
        shape_literal: '#435965'
        shape_match_pattern: '#699469'
        shape_matching_brackets: { attr: 'u' }
        shape_nothing: '#c4746e'
        shape_operator: '#c4b28a'
        shape_or: { fg: '#c4746e' attr: 'b' }
        shape_pipe: { fg: '#c4746e' attr: 'b' }
        shape_range: { fg: '#c4b28a' attr: 'b' }
        shape_raw_string: { fg: '#C8C093' attr: 'b' }
        shape_record: { fg: '#8ea49e' attr: 'b' }
        shape_redirection: { fg: '#c4746e' attr: 'b' }
        shape_signature: { fg: '#699469' attr: 'b' }
        shape_string: '#699469'
        shape_string_interpolation: { fg: '#8ea49e' attr: 'b' }
        shape_table: { fg: '#435965' attr: 'b' }
        shape_vardecl: { fg: '#435965' attr: 'u' }
        shape_variable: '#c4746e'

        foreground: '#DCD7BA'
        background: '#1F1F28'
        cursor: '#c4b28a'

        empty: '#435965'
        header: { fg: '#699469' attr: 'b' }
        hints: '#727169'
        leading_trailing_space_bg: { attr: 'n' }
        row_index: { fg: '#699469' attr: 'b' }
        search_result: { fg: '#c4746e' bg: '#C8C093' }
        separator: '#C8C093'
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
  