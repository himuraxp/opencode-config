#!/usr/bin/env bash
set -euo pipefail

# setup.sh — First-time installation or update of opencode-config on a machine.
#
# This script:
#   1. Checks prerequisites (Node.js, npm)
#   2. Installs or updates external dependencies (opencode-ai, rtk)
#   3. Optionally installs MCP servers (chrome-devtools, ios-simulator)
#   4. Runs install.sh (agents, standards, frameworks, config files)
#   5. Installs npm dependencies for plugins
#   6. Collects environment variables interactively (skips if .env is complete)
#   7. Writes ~/.config/opencode/.env
#   8. Runs a final verification

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_BASE="${HOME}/.config/opencode"
ENV_FILE="${TARGET_BASE}/.env"
FORCE_ENV=false
IDB_VENV="${HOME}/.local/idb-venv"

# Source the Aurora UI library
# shellcheck disable=SC1091
source "${ROOT_DIR}/scripts/ui.sh"

usage() {
  cat <<EOF
Usage: $(basename "$0") [--force] [--no-animation]

Options:
  --force         Re-collect environment variables even if .env is complete.
  --no-animation   Disable animations (for CI/SSH non-interactive sessions).
  --help          Show this help.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --force)
      FORCE_ENV=true
      ;;
    --no-animation)
      UI_NO_ANIMATION=true
      UI_ANIMATE=false
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

ui_logo "Aurora"

ui_section "System Check"

ui_info "Checking prerequisites..."

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

ui_section "External Dependencies"

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

# ─── Step 2.5: MCP Servers ──────────────────────────────────────────────────

ui_section "MCP Servers"

# chrome-devtools-mcp: auto-installed by npx, no manual setup needed
if npm list -g chrome-devtools-mcp &>/dev/null; then
  ok "chrome-devtools-mcp installed globally"
else
  ok "chrome-devtools-mcp: will auto-install via npx on first use"
fi

# ios-simulator-mcp: requires idb-companion (brew) + fb-idb (python venv) + UDID
# Detect if already installed
IOS_MCP_READY=false
if command -v idb_companion &>/dev/null && [[ -f "${IDB_VENV}/bin/idb" ]]; then
  IOS_MCP_READY=true
  ok "ios-simulator-mcp dependencies already installed (idb-companion + fb-idb)"
fi

if [[ "$IOS_MCP_READY" == false ]]; then
  if [[ "$(uname)" == "Darwin" ]]; then
    echo ""
    echo "The iOS Simulator MCP requires:"
    echo "  - idb-companion (Homebrew: facebook/fb tap)"
    echo "  - fb-idb (Python venv at ${IDB_VENV})"
    echo "  - Xcode (for iOS Simulator)"
    printf "Install iOS Simulator MCP dependencies? [y/N] "
    read -r install_ios_mcp || install_ios_mcp="n"

    if [[ "$install_ios_mcp" =~ ^[Yy]$ ]]; then
      # Check Xcode
      if ! xcrun simctl help &>/dev/null; then
        warn "Xcode or Command Line Tools not found."
        warn "Install Xcode from the App Store, then re-run setup.sh"
      else
        # Install idb-companion via Homebrew
        if command -v brew &>/dev/null; then
          if ! brew tap | grep -q "facebook/fb"; then
            info "Tapping facebook/fb..."
            brew tap facebook/fb
          fi
          if command -v idb_companion &>/dev/null; then
            ok "idb-companion already installed: $(idb_companion --version 2>/dev/null || echo 'unknown')"
          else
            info "Installing idb-companion..."
            brew install idb-companion
            ok "idb-companion installed"
          fi
        else
          warn "Homebrew not found — cannot install idb-companion automatically"
          warn "Install manually: brew tap facebook/fb && brew install idb-companion"
        fi

        # Install fb-idb via Python venv
        if command -v python3 &>/dev/null; then
          if [[ -f "${IDB_VENV}/bin/idb" ]]; then
            ok "fb-idb already installed in ${IDB_VENV}"
          else
            info "Creating Python venv at ${IDB_VENV}..."
            python3 -m venv "${IDB_VENV}"
            info "Installing fb-idb..."
            "${IDB_VENV}/bin/pip" install --quiet fb-idb
            ok "fb-idb installed in ${IDB_VENV}"
          fi
        else
          warn "python3 not found — cannot create venv for fb-idb"
          warn "Install manually: python3 -m venv ${IDB_VENV} && ${IDB_VENV}/bin/pip install fb-idb"
        fi
      fi

      # Verify
      if command -v idb_companion &>/dev/null && [[ -f "${IDB_VENV}/bin/idb" ]]; then
        IOS_MCP_READY=true
        ok "iOS Simulator MCP dependencies installed successfully"
      else
        warn "iOS Simulator MCP setup incomplete — check warnings above"
      fi
    else
      info "Skipping iOS Simulator MCP. You can install it later with: setup.sh"
      info "The ios-simulator MCP config will remain in opencode.json but may fail at runtime."
    fi
  else
    info "iOS Simulator MCP is only available on macOS — skipping"
    info "The ios-simulator MCP config will remain in opencode.json but is disabled on non-macOS."
  fi
fi

ui_section "Installing configuration files"

info "Running install.sh..."
bash "${ROOT_DIR}/scripts/install.sh" || fail "install.sh failed"

# ─── Step 4: npm dependencies for plugins ────────────────────────────────────

ui_section "Plugin Dependencies"

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

# ─── Step 4.5: Build Infomaniak MCP server ──────────────────────────────────

ui_section "Infomaniak MCP Server"

MCP_DIR="${ROOT_DIR}/mcp/infomaniak"
if [[ -d "$MCP_DIR" ]] && [[ -f "$MCP_DIR/package.json" ]]; then
  if [[ -f "$MCP_DIR/dist/index.js" ]]; then
    ok "Infomaniak MCP already built"
  else
    info "Building Infomaniak MCP server..."
    if (cd "$MCP_DIR" && npm install --silent && npm run build); then
      ok "Infomaniak MCP server built successfully"
    else
      warn "Infomaniak MCP build failed — the MCP will not be available"
      warn "You can retry manually: cd $MCP_DIR && npm install && npm run build"
    fi
  fi
else
  warn "Infomaniak MCP source not found at $MCP_DIR — skipping"
fi

# ─── Step 5: Environment variables ───────────────────────────────────────────

# Check if .env already exists and is complete
env_is_complete() {
  [[ -f "$ENV_FILE" ]] || return 1
  grep -q "^OPENAI_API_KEY_INFOMANIAK=.\+" "$ENV_FILE" || return 1
  grep -q "^OPENAI_BASE_URL=.\+" "$ENV_FILE" || return 1
  return 0
}

if [[ "$FORCE_ENV" == false ]] && env_is_complete; then
  ui_section "Environment Configuration"
  ok ".env already exists and contains required variables."
  ok "Use --force to reconfigure environment variables."
  info "Skipping environment configuration."
else
  ui_section "Environment Configuration"
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

  OPENAI_API_KEY_INFOMANIAK=""
  OPENAI_BASE_URL=""
  OPENAI_B300_BASE_URL=""
  IDB_UDID=""
  IDB_PATH=""
  INFOMANIAK_API_TOKEN=""

  # Migration: if an old installation used OPENAI_API_KEY for Infomaniak,
  # carry its value over to OPENAI_API_KEY_INFOMANIAK (without displaying the secret).
  if [[ -f "$ENV_FILE" ]]; then
    OLD_OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || echo "")
    NEW_INFOMANIAK_KEY=$(grep "^OPENAI_API_KEY_INFOMANIAK=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || echo "")
    if [[ -n "$OLD_OPENAI_API_KEY" && -z "$NEW_INFOMANIAK_KEY" ]]; then
      warn "Migrating OPENAI_API_KEY → OPENAI_API_KEY_INFOMANIAK in existing .env (value hidden)"
      # Prepend the new variable; leave the old one in place for reference
      # but it won't be used by opencode.json anymore.
      {
        echo "# Migrated from OPENAI_API_KEY on $(date '+%Y-%m-%d')"
        echo "OPENAI_API_KEY_INFOMANIAK=${OLD_OPENAI_API_KEY}"
        cat "$ENV_FILE"
      } > "${ENV_FILE}.tmp" && mv "${ENV_FILE}.tmp" "$ENV_FILE"
      chmod 600 "$ENV_FILE"
      ok "Migration complete — OPENAI_API_KEY_INFOMANIAK added to .env"
    fi
    if [[ -n "$OLD_OPENAI_API_KEY" && -n "$NEW_INFOMANIAK_KEY" ]]; then
      info "Both OPENAI_API_KEY and OPENAI_API_KEY_INFOMANIAK exist in .env — using OPENAI_API_KEY_INFOMANIAK"
    fi
    # Clean up: remove the old OPENAI_API_KEY line to prevent confusion
    if [[ -n "$OLD_OPENAI_API_KEY" ]]; then
      sed -i '' '/^OPENAI_API_KEY=/d' "$ENV_FILE" 2>/dev/null || sed -i '/^OPENAI_API_KEY=/d' "$ENV_FILE" 2>/dev/null || true
      chmod 600 "$ENV_FILE"
    fi
  fi

  prompt_var OPENAI_API_KEY_INFOMANIAK \
    "Enter your Infomaniak AI API key" "" true

  if [[ -z "${OPENAI_API_KEY_INFOMANIAK}" ]]; then
    fail "OPENAI_API_KEY_INFOMANIAK is required. Get it from the Infomaniak console."
  fi

  prompt_var OPENAI_BASE_URL \
    "Enter the Infomaniak AI API endpoint" \
    "https://api.infomaniak.com/2/ai/private/openai/v1" false

  # --- Optional variables ---

  prompt_var OPENAI_B300_BASE_URL \
    "Enter the B300 endpoint (Kimi K2.6, optional)" \
    "https://kimi-k26-nvfp4.ia2-kub.infomaniak.ch/v1" false

  prompt_var INFOMANIAK_API_TOKEN \
    "Enter your Infomaniak API token (for Infomaniak MCP, get it at https://manager.infomaniak.com/v3/ng/accounts/token/list)" \
    "" true

  # iOS Simulator — only ask if MCP dependencies are installed
  if [[ "$IOS_MCP_READY" == true ]]; then
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
      "${IDB_VENV}/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin" false
  else
    info "Skipping iOS Simulator variables (MCP not installed)"
    IDB_UDID=""
    IDB_PATH=""
  fi

  # ─── Step 6: Write .env file ─────────────────────────────────────────────────

  ui_section "Writing environment file"

  # Expand $HOME in IDB_PATH (safe: only $HOME is expanded, no arbitrary eval)
  IDB_PATH_EXPANDED="${IDB_PATH/\$HOME/${HOME}}"

  cat > "${ENV_FILE}" <<EOF
# OpenCode environment variables — generated by setup.sh
# DO NOT commit this file. It contains secrets.

# Required
OPENAI_API_KEY_INFOMANIAK=${OPENAI_API_KEY_INFOMANIAK}
OPENAI_BASE_URL=${OPENAI_BASE_URL}

# Optional
OPENAI_B300_BASE_URL=${OPENAI_B300_BASE_URL}
IDB_UDID=${IDB_UDID}
IDB_PATH=${IDB_PATH_EXPANDED}
INFOMANIAK_API_TOKEN=${INFOMANIAK_API_TOKEN}
EOF

  chmod 600 "${ENV_FILE}"
  ok "Environment file written to ${ENV_FILE} (permissions: 600)"
fi

# ─── Step 7: Verification ────────────────────────────────────────────────────

ui_section "Verification"

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
for agent in aurora aurora-heavy reviewer tester security cybersec architect spark vision atlas crawler sage scribe pulse echo beacon designer mobile; do
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

# Check MCP servers
ok "chrome-devtools-mcp: auto-installed via npx"

if [[ "$IOS_MCP_READY" == true ]]; then
  if command -v idb_companion &>/dev/null; then
    ok "ios-simulator-mcp: idb-companion available"
  else
    warn "ios-simulator-mcp: idb-companion not in PATH"
    ERRORS=$((ERRORS + 1))
  fi
  if [[ -f "${IDB_VENV}/bin/idb" ]]; then
    ok "ios-simulator-mcp: fb-idb available"
  else
    warn "ios-simulator-mcp: fb-idb not found in ${IDB_VENV}"
    ERRORS=$((ERRORS + 1))
  fi
else
  info "ios-simulator-mcp: not installed (skipped by user or non-macOS)"
fi

# Check Infomaniak MCP
if [[ -f "${ROOT_DIR}/mcp/infomaniak/dist/index.js" ]]; then
  ok "infomaniak-mcp: built and ready"
else
  warn "infomaniak-mcp: not built — run: cd $ROOT_DIR/mcp/infomaniak && npm install && npm run build"
  ERRORS=$((ERRORS + 1))
fi

# Summary
ui_section "Summary"

if [[ ${ERRORS} -eq 0 ]]; then
  ok "Setup complete! Run 'opencode' to start."
  echo ""
  echo "  Next steps:"
  echo "    1. Restart your terminal (to pick up PATH changes)"
  echo "    2. Run: opencode"
  echo "    3. The oh-my-opencode-slim plugin will auto-install on first run"
  echo ""
  echo "  To reconfigure environment variables later:"
  echo "    ~/.config/opencode-config/scripts/setup.sh --force"
  if [[ "$UI_ANIMATE" == true ]]; then
    echo ""
    ui_typewriter "Aurora is ready to deploy." 0.04
  fi
else
  warn "Setup completed with ${ERRORS} warning(s). Check the output above."
fi
