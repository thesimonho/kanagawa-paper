---
agent:
  instruction: Keep these entry points and their callers aligned when this directory changes.
  on-change: "scripts/build/**"
---

# Build tooling

`build.ts` dispatches target builders through `targets.ts`; `output.ts` manages atomic output and locks. `watch.ts` rebuilds changed targets. `assemble.py` delegates Python release callers to the Node build, including target validation and expansion of `all`. `targets.ts` is the only build-target list. Run `node --import tsx scripts/build/build.ts --list-targets` for a JSON list without compiling or writing output; release definition validation uses this query. The legacy `build.sh` wrapper runs generation.

Use `just build`, `just watch`, or their npm equivalents from the repository root. Target implementations remain in `packages/`.
