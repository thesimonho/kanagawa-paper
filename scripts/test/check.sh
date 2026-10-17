#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."
npm run typecheck
npm run format:check
npm test
npm run test:release
bash scripts/test/test.sh
python3 -m unittest discover -s tests/release -p 'test_*.py'
npm run build
python3 scripts/ci/release/coordinator.py check-packages
