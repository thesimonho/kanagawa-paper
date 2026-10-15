#!/bin/bash
set -euo pipefail

# Keep the existing generation command on the common artifact build path.
python3 scripts/assemble.py extras --output .
