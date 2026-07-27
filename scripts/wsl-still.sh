#!/usr/bin/env bash
# Quick still render via WSL to verify compositor works
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm use 22 >/dev/null

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WSL_DIR="$ROOT/.wsl-render"
COMPOSITION="${1:-Scene02}"
FRAME="${2:-200}"
OUT="$ROOT/out/wsl-test-$COMPOSITION.png"

mkdir -p "$WSL_DIR" "$ROOT/out"
rsync -a --delete \
  --exclude node_modules \
  --exclude out \
  --exclude .wsl-render \
  --exclude .git \
  "$ROOT/" "$WSL_DIR/"

cd "$WSL_DIR"
if [ ! -d node_modules/@remotion/cli ]; then
  npm install
fi

npx remotion still "$COMPOSITION" "$OUT" --frame="$FRAME"
echo "Wrote $OUT"
