#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
PRUNE=false
DRY_RUN=false
NO_CONFIG=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [--prune] [--dry-run] [--no-config]

Options:
  --prune      Remove installed .md files that no longer exist in this repo.
  --dry-run    Show what would be installed or removed.
  --no-config  Skip copying config/ files (opencode.json, plugins, etc.)
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
    --no-config)
      NO_CONFIG=true
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

# ─── Config files (opencode.json, plugins, etc.) ────────────────────────────

install_config() {
  local src="$ROOT_DIR/config"
  local dest="$TARGET_BASE"

  if [[ ! -d "$src" ]]; then
    echo "skip (nonexistent): $src"
    return
  fi

  # opencode.json
  if [[ -f "$src/opencode.json" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/opencode.json"
    else
      mkdir -p "$dest"
      cp "$src/opencode.json" "$dest/opencode.json"
      echo "installed: $dest/opencode.json"
    fi
  fi

  # oh-my-opencode-slim.json
  if [[ -f "$src/oh-my-opencode-slim.json" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/oh-my-opencode-slim.json"
    else
      mkdir -p "$dest"
      cp "$src/oh-my-opencode-slim.json" "$dest/oh-my-opencode-slim.json"
      echo "installed: $dest/oh-my-opencode-slim.json"
    fi
  fi

  # package.json (for plugin dependencies)
  if [[ -f "$src/package.json" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/package.json"
    else
      mkdir -p "$dest"
      cp "$src/package.json" "$dest/package.json"
      echo "installed: $dest/package.json"
    fi
  fi

  # .env.example (template — user copies to .env manually or via setup.sh)
  if [[ -f "$src/.env.example" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/.env.example"
    else
      mkdir -p "$dest"
      cp "$src/.env.example" "$dest/.env.example"
      echo "installed: $dest/.env.example"
    fi
  fi

  # plugins/ directory
  if [[ -d "$src/plugins" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "would install: $dest/plugins/*"
    else
      mkdir -p "$dest/plugins"
      for pfile in "$src/plugins"/*; do
        [[ -e "$pfile" ]] || continue
        pname="$(basename "$pfile")"
        cp "$pfile" "$dest/plugins/$pname"
        echo "installed: $dest/plugins/$pname"
      done
    fi
  fi

  # npm install is handled by setup.sh to avoid double-install and give better error output
  if [[ "$DRY_RUN" == false && -f "$dest/package.json" ]]; then
    echo "note: run 'npm install' in $dest or use setup.sh for full installation"
  fi
}

if [[ "$NO_CONFIG" == false ]]; then
  install_config
fi

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run complete. No files were modified."
else
  echo "OpenCode configuration installed in $TARGET_BASE."
  if [[ "$NO_CONFIG" == false ]]; then
    echo "Config files installed. Run scripts/setup.sh for first-time setup with secrets."
  fi
fi
