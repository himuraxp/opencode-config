#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
PRUNE=false
DRY_RUN=false
NO_CONFIG=false

# Counters
NEW_COUNT=0
UPDATED_COUNT=0
UNCHANGED_COUNT=0
PRUNED_COUNT=0

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

# copy_file <src> <dest> — copies a file, tracking new/updated/unchanged
copy_file() {
  local src="$1"
  local dest="$2"

  if [[ "$DRY_RUN" == true ]]; then
    if [[ ! -f "$dest" ]]; then
      echo "  new:     $dest"
    elif ! diff -q "$src" "$dest" &>/dev/null; then
      echo "  updated: $dest"
    else
      echo "  unchanged: $dest"
    fi
    return
  fi

  if [[ ! -f "$dest" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "  new:     $dest"
    NEW_COUNT=$((NEW_COUNT + 1))
  elif ! diff -q "$src" "$dest" &>/dev/null; then
    cp "$src" "$dest"
    echo "  updated: $dest"
    UPDATED_COUNT=$((UPDATED_COUNT + 1))
  else
    echo "  unchanged: $dest"
    UNCHANGED_COUNT=$((UNCHANGED_COUNT + 1))
  fi
}

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
    copy_file "$file" "$dest/$name"
  done

  if [[ "$PRUNE" == true && -d "$dest" ]]; then
    for installed in "$dest"/*.md; do
      [[ -e "$installed" ]] || continue
      name="$(basename "$installed")"
      if [[ ! -e "$src/$name" ]]; then
        if [[ "$DRY_RUN" == true ]]; then
          echo "  would prune: $installed"
        else
          rm "$installed"
          echo "  pruned:  $installed"
          PRUNED_COUNT=$((PRUNED_COUNT + 1))
        fi
      fi
    done
  elif [[ -d "$dest" ]]; then
    for installed in "$dest"/*.md; do
      [[ -e "$installed" ]] || continue
      name="$(basename "$installed")"
      if [[ ! -e "$src/$name" ]]; then
        echo "  orphan:  $installed (run with --prune to remove)"
      fi
    done
  fi
}

install_dir "$ROOT_DIR/agents"     "$TARGET_BASE/agents"
install_dir "$ROOT_DIR/standards"  "$TARGET_BASE/standards"
install_dir "$ROOT_DIR/frameworks" "$TARGET_BASE/frameworks"

# ─── Skills (recursive: includes SKILL.md, README.md, and any sub-files) ────

install_skills() {
  local src="$ROOT_DIR/skills"
  local dest="$TARGET_BASE/skills"

  if [[ ! -d "$src" ]]; then
    echo "skip (nonexistent): $src"
    return
  fi

  if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$dest"
  fi

  # Walk each skill directory
  for skill_dir in "$src"/*/; do
    [[ -d "$skill_dir" ]] || continue
    local skill_name
    skill_name="$(basename "$skill_dir")"
    local skill_dest="$dest/$skill_name"

    if [[ "$DRY_RUN" == false ]]; then
      mkdir -p "$skill_dest"
    fi

    # Copy all files in the skill directory (non-recursive for now)
    for file in "$skill_dir"*; do
      [[ -f "$file" ]] || continue
      local name
      name="$(basename "$file")"
      if [[ "$DRY_RUN" == true ]]; then
        local dest_file="$skill_dest/$name"
        if [[ ! -f "$dest_file" ]]; then
          echo "  new:     $dest_file"
        elif ! diff -q "$file" "$dest_file" &>/dev/null; then
          echo "  updated: $dest_file"
        else
          echo "  unchanged: $dest_file"
        fi
      else
        copy_file "$file" "$skill_dest/$name"
      fi
    done
  done
}

install_skills

# ─── Scripts (recursive: includes .sh files and tests) ────────────────────────

install_scripts() {
  local src="$ROOT_DIR/scripts"
  local dest="$TARGET_BASE/scripts"

  if [[ ! -d "$src" ]]; then
    echo "skip (nonexistent): $src"
    return
  fi

  if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$dest"
  fi

  # Find all files recursively (excluding the install/setup scripts at root level)
  while IFS= read -r -d '' file; do
    local rel_path
    rel_path="${file#$src/}"
    local dest_file="$dest/$rel_path"

    if [[ "$DRY_RUN" == true ]]; then
      if [[ ! -f "$dest_file" ]]; then
        echo "  new:     $dest_file"
      elif ! diff -q "$file" "$dest_file" &>/dev/null; then
        echo "  updated: $dest_file"
      else
        echo "  unchanged: $dest_file"
      fi
    else
      mkdir -p "$(dirname "$dest_file")"
      copy_file "$file" "$dest_file"
      # Preserve executable bit for .sh files
      if [[ "$file" == *.sh ]]; then
        chmod +x "$dest_file" 2>/dev/null || true
      fi
    fi
  done < <(find "$src" -type f -not -name "install.sh" -not -name "setup.sh" -not -name "init-project.sh" -not -name "sync-project.sh" -print0)
}

install_scripts

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
    copy_file "$src/opencode.json" "$dest/opencode.json"
  fi

  # oh-my-opencode-slim.json
  if [[ -f "$src/oh-my-opencode-slim.json" ]]; then
    copy_file "$src/oh-my-opencode-slim.json" "$dest/oh-my-opencode-slim.json"
  fi

  # package.json (for plugin dependencies)
  if [[ -f "$src/package.json" ]]; then
    copy_file "$src/package.json" "$dest/package.json"
  fi

  # .env.example (template — user copies to .env manually or via setup.sh)
  if [[ -f "$src/.env.example" ]]; then
    copy_file "$src/.env.example" "$dest/.env.example"
  fi

  # plugins/ directory
  if [[ -d "$src/plugins" ]]; then
    mkdir -p "$dest/plugins"
    for pfile in "$src/plugins"/*; do
      [[ -e "$pfile" ]] || continue
      pname="$(basename "$pfile")"
      copy_file "$pfile" "$dest/plugins/$pname"
    done
  fi

  # npm install is handled by setup.sh to avoid double-install and give better error output
  if [[ "$DRY_RUN" == false && -f "$dest/package.json" ]]; then
    echo "  note: run 'npm install' in $dest or use setup.sh for full installation"
  fi
}

if [[ "$NO_CONFIG" == false ]]; then
  install_config
fi

if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "Dry run complete. No files were modified."
else
  echo ""
  echo "Summary: ${NEW_COUNT} new, ${UPDATED_COUNT} updated, ${UNCHANGED_COUNT} unchanged"
  if [[ ${PRUNED_COUNT} -gt 0 ]]; then
    echo "         ${PRUNED_COUNT} pruned"
  fi
  echo "OpenCode configuration installed in $TARGET_BASE."
  if [[ "$NO_CONFIG" == false ]]; then
    echo "Config files installed. Run scripts/setup.sh for first-time setup with secrets."
  fi
fi
