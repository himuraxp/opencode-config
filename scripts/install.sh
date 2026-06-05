#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"

install_dir() {
  local src="$1"
  local dest="$2"
  mkdir -p "$dest"

  if [[ ! -d "$src" ]]; then
    echo "skip (nonexistent): $src"
    return
  fi

  for file in "$src"/*.md; do
    [[ -e "$file" ]] || continue
    name="$(basename "$file")"
    cp "$file" "$dest/$name"
    echo "installed: $dest/$name"
  done
}

install_dir "$ROOT_DIR/agents"     "$TARGET_BASE/agents"
install_dir "$ROOT_DIR/standards"  "$TARGET_BASE/standards"
install_dir "$ROOT_DIR/frameworks" "$TARGET_BASE/frameworks"

echo "OpenCode configuration installed in $TARGET_BASE."
