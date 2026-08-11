#!/usr/bin/env bash
# build_body.sh — Assemble the MR description body from a template or default format.
#
# Usage: build_body.sh \
#   --context "<context text>" \
#   --solution "<solution text>" \
#   --resources "<resources text, multiline>" \
#   --media "<media markdown, optional>" \
#   --template-file <path>   # optional, path to template file
#
# Outputs the assembled MR body to stdout.
# If a template is provided, replaces placeholders:
#   {{CONTEXT}}, {{SOLUTION}}, {{RESOURCES}}, {{MEDIA}}
# If no template, uses the default format:
#   ## Context / ## Solution / ## Resources / ## Media

set -euo pipefail

CONTEXT=""
SOLUTION=""
RESOURCES=""
MEDIA=""
TEMPLATE_FILE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --context)
      CONTEXT="$2"
      shift 2
      ;;
    --solution)
      SOLUTION="$2"
      shift 2
      ;;
    --resources)
      RESOURCES="$2"
      shift 2
      ;;
    --media)
      MEDIA="$2"
      shift 2
      ;;
    --template-file)
      TEMPLATE_FILE="$2"
      shift 2
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

# Validate required fields
if [ -z "$(echo "$CONTEXT" | tr -d '[:space:]')" ]; then
  echo "ERROR: --context is required and must not be whitespace-only." >&2
  exit 1
fi

if [ -z "$(echo "$SOLUTION" | tr -d '[:space:]')" ]; then
  echo "ERROR: --solution is required and must not be whitespace-only." >&2
  exit 1
fi

# Default resources
if [ -z "$RESOURCES" ]; then
  RESOURCES="- (none)"
fi

# Use template if available
if [ -n "$TEMPLATE_FILE" ] && [ -f "$TEMPLATE_FILE" ]; then
  # Read template content
  TEMPLATE_CONTENT=$(cat "$TEMPLATE_FILE")

  # Escape special sed characters in variables to prevent injection
  # Characters to escape: \, &, and the delimiter |
  escape_sed() {
    printf '%s' "$1" | sed 's/[\\&|]/\\&/g'
  }

  ESC_CONTEXT=$(escape_sed "$CONTEXT")
  ESC_SOLUTION=$(escape_sed "$SOLUTION")
  ESC_RESOURCES=$(escape_sed "$RESOURCES")
  ESC_MEDIA=$(escape_sed "$MEDIA")

  # Replace placeholders using | as delimiter (less likely in text than /)
  BODY=$(printf '%s' "$TEMPLATE_CONTENT" | sed \
    -e "s|{{CONTEXT}}|${ESC_CONTEXT}|g" \
    -e "s|{{SOLUTION}}|${ESC_SOLUTION}|g" \
    -e "s|{{RESOURCES}}|${ESC_RESOURCES}|g" \
    -e "s|{{MEDIA}}|${ESC_MEDIA}|g" \
    -e "s|\[\]|${ESC_CONTEXT}|g" \
    -e "s|Description de l\"incrément ou du fix à insérer ici|${ESC_CONTEXT}|g" \
    -e "s|Description détaillée|${ESC_SOLUTION}|g" \
    -e "s|Insérer les liens ici|${ESC_RESOURCES}|g" \
    -e "s|Insérer les images ou vidéos ici|${ESC_MEDIA}|g" \
    2>/dev/null || printf '%s' "$TEMPLATE_CONTENT")

  printf '%s\n' "$BODY"
  exit 0
fi

# Default format (no template)
if [ -n "$MEDIA" ]; then
  cat <<EOF
## Contexte

${CONTEXT}

## Solution

${SOLUTION}

## Ressources

${RESOURCES}

## Media

${MEDIA}
EOF
else
  cat <<EOF
## Contexte

${CONTEXT}

## Solution

${SOLUTION}

## Ressources

${RESOURCES}
EOF
fi
