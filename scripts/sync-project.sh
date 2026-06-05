#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="$(pwd)"

sync_file() {
  local src="$1"
  local dest="$2"

  if [[ ! -e "$dest" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "created: $dest"
  elif cmp -s "$src" "$dest"; then
    echo "up-to-date: $dest"
  else
    cp "$src" "$dest.new"
    echo "diff: $dest.new (review and replace if needed)"
  fi
}

# Sync AGENTS.md
sync_file "$ROOT_DIR/templates/AGENTS.md" "$PROJECT_DIR/AGENTS.md"

# Sync docs/ai/ : templates racine
mkdir -p "$PROJECT_DIR/docs/ai"
for file in "$ROOT_DIR/templates"/*.md; do
  name="$(basename "$file")"
  if [[ "$name" != "AGENTS.md" ]]; then
    sync_file "$file" "$PROJECT_DIR/docs/ai/$name"
  fi
done

# Sync docs/ai/ : project-docs (BUFFER, INDEX, WARNINGS)
for file in "$ROOT_DIR/templates/project-docs"/*.md; do
  [[ -e "$file" ]] || continue
  sync_file "$file" "$PROJECT_DIR/docs/ai/$(basename "$file")"
done

echo "Project sync done."
