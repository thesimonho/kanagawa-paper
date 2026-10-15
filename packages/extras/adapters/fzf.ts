import type { Theme } from "../../../shared/theme.ts";
import type { Metadata } from "../registry.ts";

export function generate(theme: Theme, meta: Metadata): Record<string, string> {
  return {
    "": `# -----------------------------------------------------------------------------
# ${meta.styleName}
# Upstream: ${meta.upstreamUrl}
# URL: ${meta.url}
# Note: You can either export the following as an environment variable (export FZF_DEFAULT_OPTS='...') or
#       add the following to an opts file and point FZF_DEFAULT_OPTS_FILE to it.
#       See the URL above for more information.
# -----------------------------------------------------------------------------

--color=bg:-1,bg+:${theme.ui.editor.currentLine.background},fg:-1,fg+:${theme.ui.text.primary},hl:${theme.modes.visual},hl+:${theme.syntax.symbol}
--color=header:${theme.ui.heading.secondary},info:${theme.status.info.base},pointer:${theme.ui.editor.mark}
--color=marker:${theme.ui.editor.mark},prompt:${theme.ui.navigation.target},spinner:${theme.accents.emphasis}
`,
  };
}
