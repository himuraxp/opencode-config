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

copy_if_missing() {
  local src="$1"
  local dest="$2"

  if [[ -e "$dest" ]]; then
    echo "skip existing: $dest"
  else
    if [[ "$DRY_RUN" == true ]]; then
      echo "would create: $dest"
    else
      mkdir -p "$(dirname "$dest")"
      cp "$src" "$dest"
      echo "created: $dest"
    fi
  fi
}

# Copier AGENTS.md racine du projet
copy_if_missing "$ROOT_DIR/templates/AGENTS.md" "$PROJECT_DIR/AGENTS.md"

# Créer docs/ai/ et copier tous les templates de documentation IA
if [[ "$DRY_RUN" == true ]]; then
  echo "would create dir: $PROJECT_DIR/docs/ai"
else
  mkdir -p "$PROJECT_DIR/docs/ai"
fi

for file in "$ROOT_DIR/templates"/*.md; do
  name="$(basename "$file")"
  if [[ "$name" != "AGENTS.md" ]]; then
    copy_if_missing "$file" "$PROJECT_DIR/docs/ai/$name"
  fi
done

# Copier les templates depuis project-docs/ (BUFFER, INDEX, WARNINGS)
for file in "$ROOT_DIR/templates/project-docs"/*.md; do
  [[ -e "$file" ]] || continue
  copy_if_missing "$file" "$PROJECT_DIR/docs/ai/$(basename "$file")"
done

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run complete. No files were modified."
else
  echo "Project initialized for OpenCode."
fi

echo ""
echo "Note : OpenCode ne lit jamais les fichiers .new automatiquement."
echo "En cas de divergence future, utilisez sync-project.sh et fusionnez les .new manuellement."
