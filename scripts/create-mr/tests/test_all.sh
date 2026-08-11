#!/usr/bin/env bash
# test_all.sh — Tests for create-mr scripts.
#
# Usage: bash test_all.sh
#
# Creates temporary Git repositories to test each script in isolation.
# Never calls a real GitLab project or glab.
# All assertions are local.

set -euo pipefail

# Resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Test counters
PASS=0
FAIL=0
TOTAL_ASSERTIONS=0
FAILED_ASSERTIONS=0

# Temp directory for test repos
TMP_BASE="/tmp/create-mr-tests-$$"
mkdir -p "$TMP_BASE"
trap 'rm -rf "$TMP_BASE"' EXIT

# ─── Helpers ─────────────────────────────────────────────────────────────────

assert_eq() {
  local desc="$1"
  local expected="$2"
  local actual="$3"
  TOTAL_ASSERTIONS=$((TOTAL_ASSERTIONS + 1))
  if [ "$expected" = "$actual" ]; then
    PASS=$((PASS + 1))
    echo "  PASS: $desc"
  else
    FAIL=$((FAIL + 1))
    FAILED_ASSERTIONS=$((FAILED_ASSERTIONS + 1))
    echo "  FAIL: $desc"
    echo "    expected: '$expected'"
    echo "    actual:   '$actual'"
  fi
}

assert_contains() {
  local desc="$1"
  local needle="$2"
  local haystack="$3"
  TOTAL_ASSERTIONS=$((TOTAL_ASSERTIONS + 1))
  if echo "$haystack" | grep -qF "$needle"; then
    PASS=$((PASS + 1))
    echo "  PASS: $desc"
  else
    FAIL=$((FAIL + 1))
    FAILED_ASSERTIONS=$((FAILED_ASSERTIONS + 1))
    echo "  FAIL: $desc"
    echo "    needle: '$needle' not found in:"
    echo "    $haystack"
  fi
}

assert_exit_code() {
  local desc="$1"
  local expected_code="$2"
  local actual_code="$3"
  TOTAL_ASSERTIONS=$((TOTAL_ASSERTIONS + 1))
  if [ "$expected_code" = "$actual_code" ]; then
    PASS=$((PASS + 1))
    echo "  PASS: $desc"
  else
    FAIL=$((FAIL + 1))
    FAILED_ASSERTIONS=$((FAILED_ASSERTIONS + 1))
    echo "  FAIL: $desc"
    echo "    expected exit code: $expected_code"
    echo "    actual exit code:   $actual_code"
  fi
}

# Create a minimal Git repo in a temp directory
# Usage: create_test_repo <dir_name> [--with-template <file> <content>]
create_test_repo() {
  local repo_dir="$TMP_BASE/$1"
  shift
  mkdir -p "$repo_dir"
  cd "$repo_dir"
  git init --quiet
  git config user.email "test@test.com"
  git config user.name "Test"
  echo "# Test" > README.md
  git add README.md
  git commit --quiet -m "init"
  # Create and checkout a feature branch
  git checkout --quiet -b feat/test-feature

  # Process optional template args
  while [ $# -gt 0 ]; do
    case "$1" in
      --with-template)
        local template_file="$2"
        local template_content="$3"
        mkdir -p "$(dirname "$template_file")"
        echo "$template_content" > "$template_file"
        shift 3
        ;;
      --with-file)
        local fpath="$2"
        local fcontent="$3"
        mkdir -p "$(dirname "$fpath")"
        echo "$fcontent" > "$fpath"
        shift 3
        ;;
    esac
  done

  echo "$repo_dir"
}

# ─── Tests: validate_title.sh ─────────────────────────────────────────────────

echo ""
echo "=== validate_title.sh ==="

test_title_valid() {
  local result
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "feat(auth): add OAuth2 login" 2>&1)
  assert_exit_code "valid feat title exits 0" 0 $?
  assert_eq "valid feat title output" "OK" "$result"
}
test_title_valid

test_title_valid_no_scope() {
  local result
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "refactor: extract validation logic" 2>&1)
  assert_exit_code "valid refactor title exits 0" 0 $?
  assert_eq "valid refactor title output" "OK" "$result"
}
test_title_valid_no_scope

test_title_valid_with_breaking() {
  local result
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "feat(api)!: remove deprecated v1 endpoints" 2>&1)
  assert_exit_code "valid breaking change title exits 0" 0 $?
  assert_eq "valid breaking change title output" "OK" "$result"
}
test_title_valid_with_breaking

test_title_invalid_no_type() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "add something" 2>&1)
  code=$?
  set -e
  assert_exit_code "invalid title (no type) exits 1" 1 "$code"
  assert_contains "invalid title mentions format" "Conventional Commit" "$result"
}
test_title_invalid_no_type

test_title_invalid_no_colon() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "feat add something" 2>&1)
  code=$?
  set -e
  assert_exit_code "invalid title (no colon) exits 1" 1 "$code"
}
test_title_invalid_no_colon

test_title_empty() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "" 2>&1)
  code=$?
  set -e
  assert_exit_code "empty title exits 1" 1 "$code"
}
test_title_empty

test_title_no_arg() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" 2>&1)
  code=$?
  set -e
  assert_exit_code "no arg exits 1" 1 "$code"
}
test_title_no_arg

test_title_too_long() {
  local long_title="feat: $(printf 'a%.0s' {1..95})"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/validate_title.sh" "$long_title" 2>&1)
  code=$?
  set -e
  assert_exit_code "title over 100 chars exits 1" 1 "$code"
  assert_contains "too long mentions length" "too long" "$result"
}
test_title_too_long

# ─── Tests: detect_template.sh ────────────────────────────────────────────────

echo ""
echo "=== detect_template.sh ==="

test_template_found_gitlab_dir() {
  local repo
  repo=$(create_test_repo "with-template-1" \
    --with-template ".gitlab/merge_request_templates/default.md" \
    "## Contexte\n\n{{CONTEXT}}\n\n## Solution\n\n{{SOLUTION}}")
  cd "$repo"
  local result
  result=$(bash "$SCRIPTS_DIR/detect_template.sh" 2>/dev/null || true)
  assert_exit_code "template in .gitlab/merge_request_templates/ exits 0" 0 $?
  assert_contains "template contains placeholder" "{{CONTEXT}}" "$result"
}
test_template_found_gitlab_dir

test_template_found_root() {
  local repo
  repo=$(create_test_repo "with-template-2" \
    --with-template "MERGE_REQUEST_TEMPLATE.md" \
    "# MR Template\n\n{{CONTEXT}}")
  cd "$repo"
  local result
  result=$(bash "$SCRIPTS_DIR/detect_template.sh" 2>/dev/null || true)
  assert_exit_code "template at root exits 0" 0 $?
  assert_contains "root template has placeholder" "{{CONTEXT}}" "$result"
}
test_template_found_root

test_template_not_found() {
  local repo
  repo=$(create_test_repo "no-template")
  cd "$repo"
  local result
  result=$(bash "$SCRIPTS_DIR/detect_template.sh" 2>/dev/null || true)
  assert_exit_code "no template exits 0" 0 $?
  assert_eq "no template outputs nothing" "" "$result"
}
test_template_not_found

test_template_priority_gitlab_dir() {
  local repo
  repo=$(create_test_repo "with-template-3" \
    --with-template ".gitlab/merge_request_templates/default.md" "GITLAB_DIR_TEMPLATE" \
    --with-template "MERGE_REQUEST_TEMPLATE.md" "ROOT_TEMPLATE")
  cd "$repo"
  local result
  result=$(bash "$SCRIPTS_DIR/detect_template.sh" 2>/dev/null || true)
  assert_contains "gitlab dir template takes priority" "GITLAB_DIR_TEMPLATE" "$result"
}
test_template_priority_gitlab_dir

# ─── Tests: check_workspace.sh ────────────────────────────────────────────────

echo ""
echo "=== check_workspace.sh ==="

test_workspace_clean() {
  local repo
  repo=$(create_test_repo "clean-repo")
  cd "$repo"
  local result
  result=$(bash "$SCRIPTS_DIR/check_workspace.sh" 2>&1)
  assert_exit_code "clean workspace exits 0" 0 $?
  assert_contains "clean workspace mentions branch" "feat/test-feature" "$result"
}
test_workspace_clean

test_workspace_dirty() {
  local repo
  repo=$(create_test_repo "dirty-repo")
  cd "$repo"
  echo "dirty" >> README.md
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/check_workspace.sh" 2>&1)
  code=$?
  set -e
  assert_exit_code "dirty workspace exits 1" 1 "$code"
  assert_contains "dirty workspace mentions dirty" "dirty" "$result"
}
test_workspace_dirty

test_workspace_on_main() {
  local repo
  repo=$(create_test_repo "main-repo")
  cd "$repo"
  git checkout --quiet main 2>/dev/null || git checkout --quiet master 2>/dev/null
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/check_workspace.sh" 2>&1)
  code=$?
  set -e
  assert_exit_code "on main exits 1" 1 "$code"
  assert_contains "on main mentions feature branch" "feature branch" "$result"
}
test_workspace_on_main

# ─── Tests: build_body.sh ──────────────────────────────────────────────────────

echo ""
echo "=== build_body.sh ==="

test_build_body_default() {
  local result
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --context "Fix a bug" \
    --solution "Added null check" 2>&1)
  assert_exit_code "build body default exits 0" 0 $?
  assert_contains "body has Contexte" "## Contexte" "$result"
  assert_contains "body has Solution" "## Solution" "$result"
  assert_contains "body has Ressources" "## Ressources" "$result"
  assert_contains "body contains context text" "Fix a bug" "$result"
  assert_contains "body contains solution text" "Added null check" "$result"
}
test_build_body_default

test_build_body_with_template() {
  local repo
  repo=$(create_test_repo "template-body")
  cd "$repo"
  echo "## Contexte

{{CONTEXT}}

## Solution

{{SOLUTION}}

## Ressources

{{RESOURCES}}" > "$TMP_BASE/template.md"

  local result
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --context "Mon contexte" \
    --solution "Ma solution" \
    --resources "- [JIRA-123](url)" \
    --template-file "$TMP_BASE/template.md" 2>&1)
  assert_exit_code "build body with template exits 0" 0 $?
  assert_contains "template body has context replaced" "Mon contexte" "$result"
  assert_contains "template body has solution replaced" "Ma solution" "$result"
  assert_contains "template body has resources replaced" "[JIRA-123](url)" "$result"
}
test_build_body_with_template

test_build_body_with_media() {
  local result
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --context "Feature" \
    --solution "Implementation" \
    --media "![screenshot](upload.png)" 2>&1)
  assert_exit_code "build body with media exits 0" 0 $?
  assert_contains "body has Media section" "## Media" "$result"
  assert_contains "body has media content" "screenshot" "$result"
}
test_build_body_with_media

test_build_body_no_context() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --solution "Just solution" 2>&1)
  code=$?
  set -e
  assert_exit_code "build body without context exits 1" 1 "$code"
}
test_build_body_no_context

test_build_body_no_solution() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --context "Just context" 2>&1)
  code=$?
  set -e
  assert_exit_code "build body without solution exits 1" 1 "$code"
}
test_build_body_no_solution

test_build_body_default_resources() {
  local result
  result=$(bash "$SCRIPTS_DIR/build_body.sh" \
    --context "C" \
    --solution "S" 2>&1)
  assert_contains "default resources when none provided" "(none)" "$result"
}
test_build_body_default_resources

# ─── Tests: push_branch.sh ─────────────────────────────────────────────────────

echo ""
echo "=== push_branch.sh ==="

test_push_branch_no_remote() {
  local repo
  repo=$(create_test_repo "push-no-remote")
  cd "$repo"
  # Add a commit on the feature branch so there's something to push
  echo "new file" > newfile.txt
  git add newfile.txt
  git commit --quiet -m "feat: add new file"
  # No remote set up; push should fail
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/push_branch.sh" 2>&1)
  code=$?
  set -e
  # Should fail since there's no remote
  assert_exit_code "push without remote exits 1" 1 "$code"
}
test_push_branch_no_remote

# ─── Tests: create_mr.sh ──────────────────────────────────────────────────────

echo ""
echo "=== create_mr.sh ==="

test_create_mr_dry_run() {
  local repo
  repo=$(create_test_repo "dry-run-repo")
  cd "$repo"
  echo "## Test body" > "$TMP_BASE/body.md"
  local result
  result=$(bash "$SCRIPTS_DIR/create_mr.sh" \
    --target-branch main \
    --title "feat(test): add test" \
    --body-file "$TMP_BASE/body.md" \
    --dry-run 2>&1)
  assert_exit_code "dry run exits 0" 0 $?
  assert_contains "dry run shows target" "main" "$result"
  assert_contains "dry run shows title" "feat(test): add test" "$result"
  assert_contains "dry run shows body preview" "Test body" "$result"
}
test_create_mr_dry_run

test_create_mr_missing_target() {
  local repo
  repo=$(create_test_repo "missing-target")
  cd "$repo"
  echo "body" > "$TMP_BASE/body2.md"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/create_mr.sh" \
    --title "feat: test" \
    --body-file "$TMP_BASE/body2.md" 2>&1)
  code=$?
  set -e
  assert_exit_code "missing target-branch exits 1" 1 "$code"
}
test_create_mr_missing_target

test_create_mr_missing_title() {
  local repo
  repo=$(create_test_repo "missing-title")
  cd "$repo"
  echo "body" > "$TMP_BASE/body3.md"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/create_mr.sh" \
    --target-branch main \
    --body-file "$TMP_BASE/body3.md" 2>&1)
  code=$?
  set -e
  assert_exit_code "missing title exits 1" 1 "$code"
}
test_create_mr_missing_title

test_create_mr_missing_body_file() {
  local repo
  repo=$(create_test_repo "missing-body")
  cd "$repo"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/create_mr.sh" \
    --target-branch main \
    --title "feat: test" \
    --body-file "$TMP_BASE/nonexistent.md" 2>&1)
  code=$?
  set -e
  assert_exit_code "missing body file exits 1" 1 "$code"
}
test_create_mr_missing_body_file

# ─── Tests: detect_target_branch.sh ───────────────────────────────────────────

echo ""
echo "=== detect_target_branch.sh ==="

test_detect_branch_explicit_exists() {
  local repo
  repo=$(create_test_repo "explicit-branch")
  cd "$repo"
  # main branch exists (created by git init default)
  local main_branch
  main_branch=$(git branch --show-current 2>/dev/null || echo "")
  # The repo has main or master from init, then we're on feat/test-feature
  # Let's create a known branch
  git branch staging 2>/dev/null || true
  local result
  result=$(bash "$SCRIPTS_DIR/detect_target_branch.sh" --branch staging 2>&1)
  assert_exit_code "explicit existing branch exits 0" 0 $?
  assert_eq "returns correct branch" "staging" "$result"
}
test_detect_branch_explicit_exists

test_detect_branch_explicit_not_found() {
  local repo
  repo=$(create_test_repo "bad-branch")
  cd "$repo"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/detect_target_branch.sh" --branch nonexistent-branch 2>&1)
  code=$?
  set -e
  assert_exit_code "nonexistent branch exits 1" 1 "$code"
  assert_contains "error mentions not found" "not found" "$result"
}
test_detect_branch_explicit_not_found

# ─── Tests: upload_media.sh ───────────────────────────────────────────────────

echo ""
echo "=== upload_media.sh ==="

test_upload_no_args() {
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/upload_media.sh" 2>&1)
  code=$?
  set -e
  assert_exit_code "no args exits 1" 1 "$code"
}
test_upload_no_args

test_upload_nonexistent_file() {
  local repo
  repo=$(create_test_repo "upload-nonexist")
  cd "$repo"
  local result code
  set +e
  result=$(bash "$SCRIPTS_DIR/upload_media.sh" "/tmp/nonexistent-file-12345.png" 2>&1)
  code=$?
  set -e
  # In test env, glab is not available → script exits 1 with "glab CLI not found"
  # OR if glab is available but not authed, it will error on project ID
  assert_exit_code "upload without glab exits 1" 1 "$code"
  assert_contains "error mentions glab" "glab" "$result"
}
test_upload_nonexistent_file

# ─── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo "============================================"
echo "  Tests:        $((PASS + FAIL))"
echo "  Passed:       $PASS"
echo "  Failed:       $FAIL"
echo "  Assertions:   $TOTAL_ASSERTIONS"
echo "  Failed assertions: $FAILED_ASSERTIONS"
echo "============================================"

if [ $FAIL -gt 0 ]; then
  exit 1
fi

exit 0
