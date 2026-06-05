#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="$(pwd)"

copy_if_missing() {
  local src="$1"
  local dest="$2"

  if [[ -e "$dest" ]]; then
    echo "skip existing: $dest"
  else
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "created: $dest"
  fi
}

copy_if_missing "$ROOT_DIR/templates/AGENTS.md" "$PROJECT_DIR/AGENTS.md"

mkdir -p "$PROJECT_DIR/.opencode/agent"
for file in "$ROOT_DIR/templates/.opencode/agent"/*.md; do
  copy_if_missing "$file" "$PROJECT_DIR/.opencode/agent/$(basename "$file")"
done

mkdir -p "$PROJECT_DIR/docs/ai"
for file in "$ROOT_DIR/templates/project-docs"/*.md; do
  copy_if_missing "$file" "$PROJECT_DIR/docs/ai/$(basename "$file")"
done

echo "Project initialized for OpenCode."
