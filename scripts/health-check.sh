#!/usr/bin/env bash
set -euo pipefail

# health-check.sh — Verify opencode-config consistency.
#
# Checks:
#   1. JSON files are valid (opencode.json, oh-my-opencode-slim.json)
#   2. All agent frontmatter is valid (model, mode, permission)
#   3. All models referenced in agents exist in opencode.json
#   4. No orphan files in installed config vs repo source
#   5. No broken standard references in agent files
#
# Usage: ./scripts/health-check.sh [--installed] [--quiet]
#   --installed  Also check ~/.config/opencode/ for orphans
#   --quiet      Only show errors

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
CHECK_INSTALLED=false
QUIET=false
ERRORS=0
WARNINGS=0

for arg in "$@"; do
  case "$arg" in
    --installed) CHECK_INSTALLED=true ;;
    --quiet)     QUIET=true ;;
    -h|--help)
      echo "Usage: $(basename "$0") [--installed] [--quiet]"
      echo ""
      echo "Options:"
      echo "  --installed  Also check ~/.config/opencode/ for orphan files"
      echo "  --quiet      Only show errors and warnings"
      exit 0
      ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

ok()   { [[ "$QUIET" == false ]] && echo "  OK   $1" || true; }
warn() { echo "  WARN $1"; WARNINGS=$((WARNINGS + 1)); }
fail() { echo "  FAIL $1"; ERRORS=$((ERRORS + 1)); }

echo "=== Health Check ==="
echo ""

# ─── 1. JSON validity ────────────────────────────────────────────────────────

echo "--- JSON files ---"

for json_file in "config/opencode.json" "config/oh-my-opencode-slim.json" "config/package.json"; do
  if [[ -f "$ROOT_DIR/$json_file" ]]; then
    if jq empty "$ROOT_DIR/$json_file" 2>/dev/null; then
      ok "$json_file"
    else
      fail "$json_file — invalid JSON"
    fi
  fi
done

# ─── 2. Agent frontmatter ─────────────────────────────────────────────────────

echo ""
echo "--- Agent frontmatter ---"

for agent_file in "$ROOT_DIR"/agents/*.md; do
  [[ -f "$agent_file" ]] || continue
  name="$(basename "$agent_file")"

  # Skip README.md — not an agent file
  [[ "$name" == "README.md" ]] && continue

  # Check frontmatter exists
  if ! head -1 "$agent_file" | grep -q "^---$"; then
    fail "$name — missing frontmatter"
    continue
  fi

  # Check required fields
  has_mode=$(grep -c "^mode:" "$agent_file" || true)
  has_perm=$(grep -c "^permission:" "$agent_file" || true)

  # Some agents (like aurora.md) don't have model in frontmatter (inherited)
  # but all should have mode and permission
  if [[ "$has_mode" -eq 0 ]]; then
    fail "$name — missing 'mode' in frontmatter"
  fi
  if [[ "$has_perm" -eq 0 && "$name" != "aurora.md" ]]; then
    warn "$name — missing 'permission' in frontmatter"
  fi

  ok "$name"
done

# ─── 3. Models referenced in agents exist in opencode.json ──────────────────

echo ""
echo "--- Agent models vs opencode.json ---"

# Extract all valid model IDs from opencode.json
# Format: provider/model_name
VALID_MODELS=$(
  jq -r '
    .provider as $p
    | $p | to_entries[]
    | .key as $provider
    | .value.models | to_entries[]
    | .key as $model
    | "\($provider)/\($model)"
  ' "$ROOT_DIR/config/opencode.json" 2>/dev/null || echo ""
)

if [[ -z "$VALID_MODELS" ]]; then
  warn "Could not extract models from opencode.json"
else
  for agent_file in "$ROOT_DIR"/agents/*.md; do
    [[ -f "$agent_file" ]] || continue
    name="$(basename "$agent_file")"
    [[ "$name" == "README.md" ]] && continue

    # Extract model from frontmatter
    model=$(grep "^model:" "$agent_file" 2>/dev/null | head -1 | sed 's/^model:[[:space:]]*//' || true)
    [[ -z "$model" ]] && continue

    # Check if model is in the valid list
    if echo "$VALID_MODELS" | grep -qxF "$model"; then
      ok "$name — model '$model'"
    else
      fail "$name — model '$model' not found in opencode.json providers"
    fi
  done
fi

# ─── 4. Orphan detection (installed config) ────────────────────────────────

if [[ "$CHECK_INSTALLED" == true ]]; then
  echo ""
  echo "--- Orphan detection (~/.config/opencode/) ---"

  for dir in agents standards frameworks; do
    if [[ ! -d "$TARGET_BASE/$dir" ]]; then
      warn "$TARGET_BASE/$dir — not installed"
      continue
    fi

    for installed_file in "$TARGET_BASE/$dir"/*.md; do
      [[ -f "$installed_file" ]] || continue
      installed_name="$(basename "$installed_file")"
      if [[ ! -f "$ROOT_DIR/$dir/$installed_name" ]]; then
        warn "$dir/$installed_name — orphan (not in repo source)"
      fi
    done
  done

  ok "Orphan check complete"
fi

# ─── 5. Broken standard references ─────────────────────────────────────────

echo ""
echo "--- Standard references ---"

# Check that standards referenced in any agent file exist
for agent_file in "$ROOT_DIR"/agents/*.md; do
  [[ -f "$agent_file" ]] || continue
  agent_name=$(basename "$agent_file")
  [[ "$agent_name" == "README.md" ]] && continue
  for ref in $(grep -oE 'standards/[a-z-]+\.md' "$agent_file" 2>/dev/null | sort -u || true); do
    ref_path="$ROOT_DIR/$ref"
    if [[ ! -f "$ref_path" ]]; then
      fail "$agent_name references '$ref' — file not found"
    fi
  done
done

ok "Standard references checked"

# ─── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo "=== Summary ==="
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo "All checks passed."
elif [[ $ERRORS -eq 0 ]]; then
  echo "Passed with $WARNINGS warning(s)."
else
  echo "$ERRORS error(s), $WARNINGS warning(s)."
fi

exit $((ERRORS > 0 ? 1 : 0))
