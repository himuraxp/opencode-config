#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="$(pwd)"

# Parse arguments
DRY_RUN=false
for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then
    DRY_RUN=true
  fi
done

sync_file() {
  local src="$1"
  local dest="$2"

  if [[ ! -e "$dest" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would create: $dest"
    else
      mkdir -p "$(dirname "$dest")"
      cp "$src" "$dest"
      echo "created: $dest"
    fi
  elif cmp -s "$src" "$dest"; then
    echo "up-to-date: $dest"
  else
    if [[ "$DRY_RUN" == true ]]; then
      echo "would create: $dest.new (review and replace if needed)"
    else
      cp "$src" "$dest.new"
      echo "diff: $dest.new (review and replace if needed)"
    fi
  fi
}

# Sync AGENTS.md
sync_file "$ROOT_DIR/templates/AGENTS.md" "$PROJECT_DIR/AGENTS.md"

# Sync docs/ai/ : templates racine
if [[ "$DRY_RUN" == true ]]; then
  echo "would create dir: $PROJECT_DIR/docs/ai"
else
  mkdir -p "$PROJECT_DIR/docs/ai"
fi

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

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run complete. No files were modified."
else
  echo "Project sync done."
fi

echo ""
echo "Note : OpenCode ne lit jamais les fichiers .new automatiquement."
echo "Les fichiers .new (s'il en existe) sont des propositions de mise à jour à fusionner manuellement."
