#!/usr/bin/env bash
# Render Remotion via WSL — bypasses Windows Smart App Control
# blocking node_modules/@remotion/compositor-win32-x64-msvc/remotion.exe
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm use 22 >/dev/null

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSITION="${1:-Main}"
OUTPUT="${2:-out/icone-institucional.mp4}"

WSL_DIR="$ROOT/.wsl-render"
mkdir -p "$WSL_DIR" "$ROOT/out"

# Sync project sources into a Linux worktree (keeps Windows node_modules intact)
rsync -a --delete \
  --exclude node_modules \
  --exclude out \
  --exclude .wsl-render \
  --exclude .git \
  "$ROOT/" "$WSL_DIR/"

cd "$WSL_DIR"

if [ ! -d node_modules/@remotion/cli ]; then
  echo "Installing Linux Remotion dependencies (first run)..."
  npm install
fi

echo "Rendering $COMPOSITION -> $ROOT/$OUTPUT"
npx remotion render "$COMPOSITION" "$ROOT/$OUTPUT"
echo "Done."
