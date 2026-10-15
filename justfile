set shell := ["bash", "-euo", "pipefail", "-c"]

default:
    @just --list

test *args:
    @bash scripts/test/test.sh {{ args }}

test-targets:
    @npm run test:release
    @python3 -m unittest discover -s tests/release -p "test_*.py"

# Open the compact syntax specimen using your normal Neovim configuration.
syntax-specimen:
    @nvim -c 'lua dofile([[{{ justfile_directory() }}/scripts/syntax_specimen.lua]])'

# Build application distributions and copyable extras.
build target="all" output="dist":
    @npm run build -- {{ target }} --output "{{ output }}"

watch target="all" output="dist":
    @npm run watch -- {{ target }} --output "{{ output }}"

# Optional local preview; post-merge automation maintains these files.
generate:
    @npm run generate

check:
    @npm run check
