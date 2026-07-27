#!/usr/bin/env bash
set -euo pipefail
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
hash -r
echo "NODE=$(command -v node)"
echo "NODE_VERSION=$(node -v)"
echo "NPM_VERSION=$(npm -v)"
