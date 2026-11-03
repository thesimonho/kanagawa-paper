#!/bin/env bash
set -euo pipefail

# Build before isolating XDG paths so mise shims can find the selected Node.
npm run build -- neovim

export XDG_CACHE_HOME="${PWD}/.tests/cache"
export XDG_CONFIG_HOME="${PWD}/.tests/config"
export XDG_DATA_HOME="${PWD}/.tests/data"
export XDG_STATE_HOME="${PWD}/.tests/state"
export NVIM_LOG_FILE="${PWD}/.tests/nvim.log"

mkdir -p "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" "$XDG_DATA_HOME" "$XDG_STATE_HOME"

nvim --headless --clean -l scripts/test/test.lua "$@"
