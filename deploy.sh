#!/usr/bin/env bash
# Optional helper; master pushes already publish gh-pages through Actions.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
for tool in git node npm; do
  command -v "$tool" >/dev/null || { echo "Missing required tool: $tool"; exit 1; }
done
git remote get-url origin >/dev/null || { echo 'Configure the real origin remote first; see DEPLOYMENT_COMMANDS.md.'; exit 1; }
branch=$(git branch --show-current)
if [[ "$branch" != 'master' ]]; then
  echo 'Use master; this deployment workflow publishes only the master source branch.'
  exit 1
fi
npm test
npm run build:pages
git status --short
printf '\nCommit local changes and push %s to origin? [y/N] ' "$branch"
read -r reply
if [[ "$reply" != 'y' && "$reply" != 'Y' ]]; then
  echo 'No changes committed or pushed.'
  exit 0
fi
git add --all
if ! git diff --cached --quiet; then
  git commit -m 'chore: prepare AG Home Pages deployment'
fi
git push -u origin "$branch"
printf '\nPush completed. Actions will publish gh-pages and request its Pages build.\n'
printf 'Monitor: https://github.com/AG-Alien-Gamerz/AG-Home/actions\n'
