import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# -----------------------------------------------------------------------------

gui:
  theme:
    activeBorderColor:
      - "${theme.modes.normal}"
      - "bold"
    inactiveBorderColor:
      - "${theme.ui.border.default}"
    searchingActiveBorderColor:
      - "${theme.ui.search.match.background}"
      - "bold"
    optionsTextColor:
      - "${theme.accents.primary}"
    selectedLineBgColor:
      - "${theme.ui.editor.currentLine.background}"
    cherryPickedCommitFgColor:
      - "${theme.ui.text.muted}"
    cherryPickedCommitBgColor:
      - "${theme.modes.replace}"
    markedBaseCommitFgColor:
      - "${theme.ui.text.muted}"
    markedBaseCommitBgColor:
      - "${theme.modes.normal}"
    unstagedChangesColor:
      - "${theme.changes.modified.base}"
    defaultFgColor:
      - "${theme.ui.text.primary}"
`,
  };
}
