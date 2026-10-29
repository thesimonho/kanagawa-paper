#!/usr/bin/env bash
set -euo pipefail

# The coordinator captures stdout; keep VSCE progress and failures in CI logs.
exec "$(dirname "$0")/node_modules/.bin/vsce" "$@" >&2
