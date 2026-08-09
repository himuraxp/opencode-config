#!/usr/bin/env bash
set -euo pipefail

# setup.sh — First-time installation or update of opencode-config on a machine.
#
# This script:
#   1. Checks prerequisites (Node.js, npm)
#   2. Installs or updates external dependencies (opencode-ai, rtk)
#   3. Runs install.sh (agents, standards, frameworks, config files)
#   4. Installs npm dependencies for plugins
#   5. Collects environment variables interactively (skips if .env is complete)
#   6. Writes ~/.config/opencode/.env
#   7. Runs a final verification

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
ENV_FILE="${TARGET_BASE}/.env"
FORCE_ENV=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
fail()  { echo -e "${RED}[FAIL]${NC} $*"; exit 1; }

usage() {
  cat <<EOF
Usage: $(basename "$0") [--force]

Options:
  --force    Re-collect environment variables even if .env is complete.
  --help     Show this help.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --force)
      FORCE_ENV=true
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

# ─── Step 1: Prerequisites ───────────────────────────────────────────────────

echo -e "\n${BOLD}=== OpenCode Config Setup ===${NC}\n"

info "Checking prerequisites..."

if ! command -v node &>/dev/null; then
  fail "Node.js not found. Install it first: https://nodejs.org/ (or use nvm)"
fi

if ! command -v npm &>/dev/null; then
  fail "npm not found. Install Node.js first."
fi

NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
ok "Node.js ${NODE_VERSION}"
ok "npm $(npm -v)"

if [[ "$NODE_MAJOR" -lt 18 ]]; then
  warn "Node.js 18+ is recommended. Current: ${NODE_VERSION}"
fi

# ─── Step 2: External dependencies ───────────────────────────────────────────

echo -e "\n${BOLD}--- External Dependencies ---${NC}\n"

# opencode-ai (global npm)
if command -v opencode &>/dev/null; then
  CURRENT_VER=$(opencode --version 2>/dev/null || echo "unknown")
  LATEST_VER=$(npm view opencode-ai version 2>/dev/null || echo "")
  if [[ -n "$LATEST_VER" && "$CURRENT_VER" != "$LATEST_VER" ]]; then
    warn "opencode-ai: ${CURRENT_VER} installed, ${LATEST_VER} available"
    printf "Update now? [Y/n] "
    read -r response || response="n"
    if [[ "$response" =~ ^[Yy]?$ ]]; then
      npm install -g opencode-ai
      ok "opencode-ai updated to ${LATEST_VER}"
    else
      ok "opencode-ai kept at ${CURRENT_VER}"
    fi
  else
    ok "opencode-ai up to date: ${CURRENT_VER}"
  fi
else
  info "Installing opencode-ai globally..."
  npm install -g opencode-ai
  ok "opencode-ai installed: $(opencode --version 2>/dev/null || echo 'unknown')"
fi

# rtk (Homebrew on macOS, manual on Linux)
if command -v rtk &>/dev/null; then
  CURRENT_VER=$(rtk --version 2>/dev/null || echo "unknown")
  if [[ "$(uname)" == "Darwin" ]] && command -v brew &>/dev/null; then
    if brew outdated | grep -q "^rtk"; then
      warn "rtk: ${CURRENT_VER} installed, update available"
      printf "Update now? [Y/n] "
      read -r response || response="n"
      if [[ "$response" =~ ^[Yy]?$ ]]; then
        brew upgrade rtk
        ok "rtk updated to $(rtk --version 2>/dev/null || echo 'unknown')"
      else
        ok "rtk kept at ${CURRENT_VER}"
      fi
    else
      ok "rtk up to date: ${CURRENT_VER}"
    fi
  else
    ok "rtk installed: ${CURRENT_VER} (manual update)"
  fi
else
  if [[ "$(uname)" == "Darwin" ]]; then
    if command -v brew &>/dev/null; then
      info "Installing rtk via Homebrew..."
      brew install rtk
      ok "rtk installed: $(rtk --version 2>/dev/null || echo 'unknown')"
    else
      warn "Homebrew not found. Install rtk manually: https://github.com/nicholasgriffintn/rtk"
    fi
  else
    warn "rtk not found. Install it manually: https://github.com/nicholasgriffintn/rtk"
    warn "On macOS: brew install rtk"
  fi
fi

# ─── Step 3: Run install.sh ──────────────────────────────────────────────────

echo -e "\n${BOLD}--- Installing configuration files ---${NC}\n"

info "Running install.sh..."
bash "${ROOT_DIR}/scripts/install.sh" || fail "install.sh failed"

# ─── Step 4: npm dependencies for plugins ────────────────────────────────────

echo -e "\n${BOLD}--- Plugin dependencies ---${NC}\n"

if [[ -f "${TARGET_BASE}/package.json" ]]; then
  info "Installing npm dependencies in ${TARGET_BASE}..."
  if ! (cd "${TARGET_BASE}" && npm install); then
    warn "npm install failed — plugins may not work until resolved"
    warn "You can retry manually: cd ${TARGET_BASE} && npm install"
  else
    ok "npm dependencies installed"
  fi
else
  warn "No package.json found in ${TARGET_BASE} — skipping npm install"
fi

# ─── Step 5: Environment variables ───────────────────────────────────────────

# Check if .env already exists and is complete
env_is_complete() {
  [[ -f "$ENV_FILE" ]] || return 1
  grep -q "^OPENAI_API_KEY=.\+" "$ENV_FILE" || return 1
  grep -q "^OPENAI_BASE_URL=.\+" "$ENV_FILE" || return 1
  return 0
}

if [[ "$FORCE_ENV" == false ]] && env_is_complete; then
  echo -e "\n${BOLD}--- Environment Configuration ---${NC}\n"
  ok ".env already exists and contains required variables."
  ok "Use --force to reconfigure environment variables."
  info "Skipping environment configuration."
else
  echo -e "\n${BOLD}--- Environment Configuration ---${NC}\n"
  if [[ "$FORCE_ENV" == true && -f "$ENV_FILE" ]]; then
    warn "Reconfiguring environment (--force)"
  fi
  echo "You will now be asked for your configuration values."
  echo "Secrets will be stored in ${ENV_FILE} (never committed to git)."
  echo "Press Enter to keep existing/current values."
  echo ""

  # Function: prompt with default, store in variable
  # Usage: prompt_var VAR_NAME "Prompt text" "default value" true|false (is_secret)
  prompt_var() {
    local var_name="$1"
    local prompt_text="$2"
    local default_val="$3"
    local is_secret="$4"

    local current=""
    # Check if value already exists in .env
    if [[ -f "${ENV_FILE}" ]]; then
      current=$(grep "^${var_name}=" "${ENV_FILE}" 2>/dev/null | cut -d'=' -f2- || echo "")
    fi

    local display_default="${default_val}"
    if [[ -n "${current}" ]]; then
      display_default="${current}"
    fi

    local prompt_display="${prompt_text}"
    if [[ -n "${display_default}" ]]; then
      if [[ "${is_secret}" == "true" && -n "${current}" ]]; then
        prompt_display="${prompt_text} [current: ******]"
      else
        prompt_display="${prompt_text} [default: ${display_default}]"
      fi
    fi

    printf "%s: " "${prompt_display}"
    read -r input_value || { echo -e "\n${RED}Cancelled.${NC}"; exit 1; }

    # Use default/current if user pressed Enter
    if [[ -z "${input_value}" ]]; then
      if [[ -n "${current}" ]]; then
        printf -v "${var_name}" '%s' "${current}"
      else
        printf -v "${var_name}" '%s' "${display_default}"
      fi
    else
      printf -v "${var_name}" '%s' "${input_value}"
    fi
  }

  # --- Required variables ---

  OPENAI_API_KEY=""
  OPENAI_BASE_URL=""
  OPENAI_B300_BASE_URL=""
  IDB_UDID=""
  IDB_PATH=""

  prompt_var OPENAI_API_KEY \
    "Enter your Infomaniak AI API key" "" true

  if [[ -z "${OPENAI_API_KEY}" ]]; then
    fail "OPENAI_API_KEY is required. Get it from the Infomaniak console."
  fi

  prompt_var OPENAI_BASE_URL \
    "Enter the Infomaniak AI API endpoint" \
    "https://api.infomaniak.com/2/ai/private/openai/v1" false

  # --- Optional variables ---

  prompt_var OPENAI_B300_BASE_URL \
    "Enter the B300 endpoint (Kimi K2.6, optional)" \
    "https://kimi-k26-nvfp4.ia2-kub.infomaniak.ch/v1" false

  # iOS Simulator — auto-detect UDID on macOS
  if [[ "$(uname)" == "Darwin" ]]; then
    AUTO_UDID=$(xcrun simctl list devices available 2>/dev/null | grep -m1 "Booted\|(" | grep -o '[0-9A-F-]\{36\}' | head -1)
    if [[ -z "${AUTO_UDID}" ]]; then
      AUTO_UDID=$(xcrun simctl list devices available 2>/dev/null | grep -o '[0-9A-F-]\{36\}' | head -1)
    fi
    prompt_var IDB_UDID \
      "Enter iOS Simulator UDID (auto-detected, press Enter to skip)" \
      "${AUTO_UDID}" false
  else
    prompt_var IDB_UDID \
      "Enter iOS Simulator UDID (skip if not on macOS)" "" false
  fi

  prompt_var IDB_PATH \
    "Enter PATH for idb binaries" \
    "${HOME}/.local/idb-venv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin" false

  # ─── Step 6: Write .env file ─────────────────────────────────────────────────

  echo -e "\n${BOLD}--- Writing environment file ---${NC}\n"

  # Expand $HOME in IDB_PATH (safe: only $HOME is expanded, no arbitrary eval)
  IDB_PATH_EXPANDED="${IDB_PATH/\$HOME/${HOME}}"

  cat > "${ENV_FILE}" <<EOF
# OpenCode environment variables — generated by setup.sh
# DO NOT commit this file. It contains secrets.

# Required
OPENAI_API_KEY=${OPENAI_API_KEY}
OPENAI_BASE_URL=${OPENAI_BASE_URL}

# Optional
OPENAI_B300_BASE_URL=${OPENAI_B300_BASE_URL}
IDB_UDID=${IDB_UDID}
IDB_PATH=${IDB_PATH_EXPANDED}
EOF

  chmod 600 "${ENV_FILE}"
  ok "Environment file written to ${ENV_FILE} (permissions: 600)"
fi

# ─── Step 7: Verification ────────────────────────────────────────────────────

echo -e "\n${BOLD}--- Verification ---${NC}\n"

ERRORS=0

# Check installed files
check_file() {
  if [[ -f "$1" ]]; then
    ok "$2"
  else
    warn "Missing: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

check_file "${TARGET_BASE}/opencode.json" "opencode.json"
check_file "${TARGET_BASE}/oh-my-opencode-slim.json" "oh-my-opencode-slim.json"
check_file "${TARGET_BASE}/package.json" "package.json (plugins)"
check_file "${TARGET_BASE}/plugins/rtk.ts" "plugins/rtk.ts"
check_file "${TARGET_BASE}/.env" ".env (secrets)"

# Check agents
for agent in aurora aurora-heavy reviewer tester security architect spark vision; do
  check_file "${TARGET_BASE}/agents/${agent}.md" "agents/${agent}.md"
done

# Check that opencode is available
if command -v opencode &>/dev/null; then
  ok "opencode CLI available"
else
  warn "opencode CLI not in PATH — you may need to restart your terminal"
  ERRORS=$((ERRORS + 1))
fi

# Check rtk
if command -v rtk &>/dev/null; then
  ok "rtk available"
else
  warn "rtk not in PATH — plugin will be disabled until installed"
fi

# Summary
echo -e "\n${BOLD}=== Summary ===${NC}\n"

if [[ ${ERRORS} -eq 0 ]]; then
  ok "Setup complete! Run 'opencode' to start."
  echo ""
  echo "Next steps:"
  echo "  1. Restart your terminal (to pick up PATH changes)"
  echo "  2. Run: opencode"
  echo "  3. The oh-my-opencode-slim plugin will auto-install on first run"
  echo ""
  echo "To reconfigure environment variables later:"
  echo "  ~/.config/opencode-config/scripts/setup.sh --force"
else
  warn "Setup completed with ${ERRORS} warning(s). Check the output above."
fi
