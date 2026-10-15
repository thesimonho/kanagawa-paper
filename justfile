set shell := ["bash", "-euo", "pipefail", "-c"]

default:
    @just --list

test *args:
    @bash scripts/test.sh {{ args }}

test-targets:
    @python3 -m unittest discover -s tests -p "test_*.py"

# Open the compact syntax specimen using your normal Neovim configuration.
syntax-specimen:
    @nvim -c 'lua dofile([[{{ justfile_directory() }}/scripts/syntax_specimen.lua]])'

# Build application distributions and copyable extras.
build target="all" output="dist":
    @python3 scripts/assemble.py {{ target }} --output "{{ output }}"

# Optional local preview; post-merge automation maintains these files.
generate:
    @bash scripts/build.sh
    @nvim --headless --clean -l scripts/generate_palette.lua

check:
    @bash scripts/test.sh
    @python3 -m unittest discover -s tests -p "test_*.py"
    @python3 scripts/assemble.py
