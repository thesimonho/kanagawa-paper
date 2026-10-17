#!/bin/env bash
set -euo pipefail

export XDG_CACHE_HOME="${PWD}/.tests/cache"
export XDG_CONFIG_HOME="${PWD}/.tests/config"
export XDG_DATA_HOME="${PWD}/.tests/data"
export XDG_STATE_HOME="${PWD}/.tests/state"
export NVIM_LOG_FILE="${PWD}/.tests/nvim.log"

mkdir -p "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" "$XDG_DATA_HOME" "$XDG_STATE_HOME"

npm run build -- neovim

nvim --headless --clean -l scripts/test/test.lua "$@"
