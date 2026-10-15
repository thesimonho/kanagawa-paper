#!/bin/bash
set -euo pipefail

# This is the approved post-merge automation exception to direct main pushes.
[[ "$(git branch --show-current)" == main ]] || { echo "Generation publication requires main" >&2; exit 1; }
# The shared generation action has already produced these outputs. Refuse to
# include any unrelated staged, tracked, or untracked changes in the bot commit.
[[ -z "$(git status --porcelain -- . ':(exclude)extras/**' ':(exclude)palette_colors.md' ':(exclude)packages/neovim/doc/kanagawa-paper.nvim.txt')" ]] || { echo "Unexpected source changes during generation" >&2; exit 1; }

# Extras are ignored for local development, so include newly generated files too.
git add -f -- extras/ palette_colors.md packages/neovim/doc/kanagawa-paper.nvim.txt
if git diff --cached --quiet; then
    exit 0
fi

git -c user.name='github-actions[bot]' \
    -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
    commit -m 'chore: refresh generated theme files'
# Reject a concurrent source update. Its queued workflow regenerates from that
# newer source; never force push or rebase outputs made from an older snapshot.
git push origin HEAD:refs/heads/main
