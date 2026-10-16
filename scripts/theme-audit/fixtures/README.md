---
agent:
  instruction: Keep fixture anchors unique and run the audit validator after fixture edits.
  on-change: "scripts/theme-audit/fixtures/**"
---

# Highlighting fixtures

These small source files exercise import keywords, module/type names, built-ins, parameters, methods, constants, and comments. They are editor inputs; do not execute them as programs. Keep them ASCII and dependency-light. `manifest.json` identifies each probe by a unique line fragment and unique text within that line. Source changes invalidate existing report hashes.
