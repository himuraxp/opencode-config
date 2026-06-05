#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="$(pwd)"

sync_file() {
  local src="$1"
  local dest="$2"

  mkdir -p "$(dirname "$dest")"

  if [[ ! -e "$dest" ]]; then
    cp "$src" "$dest"
    echo "created: $dest"
    return
  fi

  if cmp -s "$src" "$dest"; then
    echo "up-to-date: $dest"
    return
  fi

  cp "$src" "$dest.new"
  echo "new version available: $dest.new"
}

sync_file "$ROOT_DIR/templates/AGENTS.md" "$PROJECT_DIR/AGENTS.md"

for file in "$ROOT_DIR/templates/.opencode/agent"/*.md; do
  sync_file "$file" "$PROJECT_DIR/.opencode/agent/$(basename "$file")"
done

for file in "$ROOT_DIR/templates/project-docs"/*.md; do
  sync_file "$file" "$PROJECT_DIR/docs/ai/$(basename "$file")"
done

echo "Project sync completed. Existing files were not overwritten."
