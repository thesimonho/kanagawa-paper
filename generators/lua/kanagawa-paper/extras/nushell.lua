local util = require("kanagawa-paper.generator_util")

-- Retrieve the theme settings
local M = {}

--- @param colors ThemeColors
function M.generate(colors)
	local nushell = util.template(
		[[
# -----------------------------------------------------------------------------
# ${_style_name}
# Upstream: ${_upstream_url}
# URL: ${_url}
# -----------------------------------------------------------------------------

export def main [] {

    return {
        binary: '${term.red}'
        block: '${term.blue}'
        cell-path: '${term.white}'
        closure: '${term.cyan}'
        custom: '${term.white}'
        duration: '${term.yellow}'
        float: '${term.red_bright}'
        glob: '${term.white}'
        int: '${term.red}'
        list: '${term.cyan}'
        nothing: '${term.indexed2}'
        range: '${term.yellow}'
        record: '${term.cyan}'
        string: '${term.green}'

        bool: {|| if $in { '${term.blue_bright}' } else { '${term.yellow}' } }

        datetime: {|| (date now) - $in |
            if $in < 1hr {
                { fg: '${term.indexed2}' attr: 'b' }
            } else if $in < 6hr {
                '${term.indexed2}'
            } else if $in < 1day {
                '${term.yellow}'
            } else if $in < 3day {
                '${term.green}'
            } else if $in < 1wk {
                { fg: '${term.green}' attr: 'b' }
            } else if $in < 6wk {
                '${term.cyan}'
            } else if $in < 52wk {
                '${term.blue}'
            } else { 'dark_gray' }
        }

        filesize: {|e|
            if $e == 0b {
                '${term.white}'
            } else if $e < 1mb {
                '${term.cyan}'
            } else {{ fg: '${term.blue}' }}
        }

        shape_and: { fg: '${term.red}' attr: 'b' }
        shape_binary: { fg: '${term.red}' attr: 'b' }
        shape_block: { fg: '${term.blue}' attr: 'b' }
        shape_bool: '${term.blue_bright}'
        shape_closure: { fg: '${term.cyan}' attr: 'b' }
        shape_custom: '${term.green}'
        shape_datetime: { fg: '${term.cyan}' attr: 'b' }
        shape_directory: '${term.cyan}'
        shape_external: '${term.cyan}'
        shape_external_resolved: '${term.blue_bright}'
        shape_externalarg: { fg: '${term.green}' attr: 'b' }
        shape_filepath: '${term.cyan}'
        shape_flag: { fg: '${term.blue}' attr: 'b' }
        shape_float: { fg: '${term.red_bright}' attr: 'b' }
        shape_garbage: { fg: '${fg.dim}' bg: '${diag.error}' attr: 'b' } # Keeping red and white for garbage
        shape_glob_interpolation: { fg: '${term.cyan}' attr: 'b' }
        shape_globpattern: { fg: '${term.cyan}' attr: 'b' }
        shape_int: { fg: '${term.red}' attr: 'b' }
        shape_internalcall: { fg: '${term.cyan}' attr: 'b' }
        shape_keyword: { fg: '${term.red}' attr: 'b' }
        shape_list: { fg: '${term.cyan}' attr: 'b' }
        shape_literal: '${term.blue}'
        shape_match_pattern: '${term.green}'
        shape_matching_brackets: { attr: 'u' }
        shape_nothing: '${term.indexed2}'
        shape_operator: '${term.yellow}'
        shape_or: { fg: '${term.red}' attr: 'b' }
        shape_pipe: { fg: '${term.red}' attr: 'b' }
        shape_range: { fg: '${term.yellow}' attr: 'b' }
        shape_raw_string: { fg: '${term.white}' attr: 'b' }
        shape_record: { fg: '${term.cyan}' attr: 'b' }
        shape_redirection: { fg: '${term.red}' attr: 'b' }
        shape_signature: { fg: '${term.green}' attr: 'b' }
        shape_string: '${term.green}'
        shape_string_interpolation: { fg: '${term.cyan}' attr: 'b' }
        shape_table: { fg: '${term.blue}' attr: 'b' }
        shape_vardecl: { fg: '${term.blue}' attr: 'u' }
        shape_variable: '${term.red}'

        foreground: '${ui.fg}'
        background: '${ui.bg}'
        cursor: '${modes.normal}'

        empty: '${term.blue}'
        header: { fg: '${term.green}' attr: 'b' }
        hints: '${syn.comment}'
        leading_trailing_space_bg: { attr: 'n' }
        row_index: { fg: '${term.green}' attr: 'b' }
        search_result: { fg: '${term.indexed2}' bg: '${term.white}' }
        separator: '${term.white}'
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
  ]],
		colors
	)
	return nushell
end
return M
