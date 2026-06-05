#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${HOME}/.config/opencode/agents"

mkdir -p "$TARGET_DIR"

for file in "$ROOT_DIR"/agents/*.md; do
  name="$(basename "$file")"
  cp "$file" "$TARGET_DIR/$name"
  echo "installed: $TARGET_DIR/$name"
done

echo "OpenCode global agents installed."
