#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
PRUNE=false
DRY_RUN=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [--prune] [--dry-run]

Options:
  --prune    Remove installed .md files that no longer exist in this repo.
  --dry-run  Show what would be installed or removed.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --prune)
      PRUNE=true
      ;;
    --dry-run)
      DRY_RUN=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      usage >&2
      exit 1
      ;;
  esac
done

install_dir() {
  local src="$1"
  local dest="$2"

  if [[ ! -d "$src" ]]; then
    echo "skip (nonexistent): $src"
    return
  fi

  if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$dest"
  fi

  for file in "$src"/*.md; do
    [[ -e "$file" ]] || continue
    name="$(basename "$file")"
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/$name"
    else
      cp "$file" "$dest/$name"
      echo "installed: $dest/$name"
    fi
  done

  if [[ "$PRUNE" == true && -d "$dest" ]]; then
    for installed in "$dest"/*.md; do
      [[ -e "$installed" ]] || continue
      name="$(basename "$installed")"
      if [[ ! -e "$src/$name" ]]; then
        if [[ "$DRY_RUN" == true ]]; then
          echo "would prune: $installed"
        else
          rm "$installed"
          echo "pruned: $installed"
        fi
      fi
    done
  elif [[ -d "$dest" ]]; then
    for installed in "$dest"/*.md; do
      [[ -e "$installed" ]] || continue
      name="$(basename "$installed")"
      if [[ ! -e "$src/$name" ]]; then
        echo "orphan: $installed (run with --prune to remove)"
      fi
    done
  fi
}

install_dir "$ROOT_DIR/agents"     "$TARGET_BASE/agents"
install_dir "$ROOT_DIR/standards"  "$TARGET_BASE/standards"
install_dir "$ROOT_DIR/frameworks" "$TARGET_BASE/frameworks"

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run complete. No files were modified."
else
  echo "OpenCode configuration installed in $TARGET_BASE."
fi
