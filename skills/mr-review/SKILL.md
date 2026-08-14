---
name: mr-review
description: Review a GitLab MR and post inline conventional comments on code lines. Use when the user gives a GitLab MR URL or asks to review an MR. Analyzes the diff, delegates to Oracle for adversarial review, and posts structured inline comments using Conventional Comments format (issue:, suggestion:, nitpick:, question:, thought:, praise:).
---

# MR Review — Inline Conventional Comments

Review a GitLab merge request and post inline comments directly on the code lines
using the Conventional Comments convention.

**Requires**: GitLab CLI (`glab`) authenticated and available.

## Nature

Ce skill est **global**. Il est installé dans la configuration globale de
l'utilisateur OpenCode et n'est jamais copié dans les dépôts.

## Prerequisites

```bash
command -v glab
glab auth status
```

If `glab` is not authenticated, stop and ask the user to run `glab auth login`.

## Process

### Step 1: Parse the MR URL and extract metadata

The user provides a GitLab MR URL or an MR number. Extract:

- **Project**: `infomaniak/media/site-manager` (or from URL)
- **MR IID**: from URL or argument

```bash
# If URL: https://gitlab.infomaniak.ch/infomaniak/media/site-manager/-/merge_requests/466
# Extract project and IID
```

Fetch MR metadata:

```bash
glab api "projects/${PROJECT_ENCODED}/merge_requests/${MR_IID}" \
  | jq '{source_branch: .source_branch, sha: .sha, base_sha: .diff_refs.base_sha, head_sha: .diff_refs.head_sha, start_sha: .diff_refs.start_sha}'
```

### Step 2: Fetch the MR diff

```bash
glab mr diff ${MR_IID} --repo ${PROJECT_PATH}
```

### Step 3: Read AGENTS.md (project conventions)

If the target project contains an `AGENTS.md`, read it to extract the coding
rules that apply to the review. This is critical — the review must be based on
the project's actual conventions, not generic best practices.

### Step 4: Delegate to Oracle for adversarial review

Delegate the diff analysis to the `oracle` subagent with:
- The full diff text
- A summary of the AGENTS.md rules to check against
- Instruction to return a structured list of findings

The Oracle prompt must:
- Ask for findings with: file path, line number, severity (issue/suggestion/nitpick),
  description, recommendation, and AGENTS.md rule reference if applicable.
- Enforce the Conventional Comments prefixes: `issue:`, `suggestion:`, `nitpick:`,
  `question:`, `thought:`, `praise:`.
- NOT rubber-stamp. Find real problems.
- Justify every comment (explain the "why").
- Propose concrete solutions or alternatives.
- Tous les commentaires DOIVENT être rédigés en français. Les préfixes Conventional Comments
  (`issue:`, `suggestion:`, `nitpick:`, `question:`, `thought:`, `praise:`) restent en anglais,
  mais tout le texte descriptif, les explications, les justifications et les solutions proposées
  doivent être en français.

### Step 5: Map findings to exact line numbers

For each finding from Oracle, fetch the file content at the MR head SHA to get
the exact line number:

```bash
glab api "projects/${PROJECT_ENCODED}/repository/files/${FILE_PATH_ENCODED}/raw?ref=${HEAD_SHA}"
```

Use `cat -n` or manual counting to find the exact line. The line must exist in
the diff (new_line) for the inline comment to anchor correctly.

### Step 6: Post inline comments via GitLab API

Post each comment as a discussion thread with a `position` object so it anchors
to the code line in the diff view.

**Critical**: `glab api -f` does not serialize nested objects correctly. Use
`--input` with a JSON payload file.

```bash
cat > /tmp/comment_payload.json << 'ENDJSON'
{
  "body": "issue: description du problème en français.\n\nExplanation...\n\n```typescript\n// code example\n```",
  "position": {
    "base_sha": "${BASE_SHA}",
    "head_sha": "${HEAD_SHA}",
    "start_sha": "${START_SHA}",
    "position_type": "text",
    "new_path": "${FILE_PATH}",
    "new_line": ${LINE_NUMBER}
  }
}
ENDJSON

glab api --method POST \
  "projects/${PROJECT_ENCODED}/merge_requests/${MR_IID}/discussions" \
  --input /tmp/comment_payload.json \
  -H "Content-Type: application/json"
```

### Step 7: Verify all comments are inline

After posting, verify each discussion has a `position` set:

```bash
glab api "projects/${PROJECT_ENCODED}/merge_requests/${MR_IID}/discussions" \
  | jq '[.[] | .notes[0] | {has_position: (.position != null), file: .position.new_path, line: .position.new_line}]'
```

If a comment was posted without a position (fallback to plain note), delete it
and retry with the JSON payload method.

### Step 8: Report to the user

Display a summary table:

```
| # | Préfixe | Fichier | Ligne |
|---|---------|--------|-------|
| 1 | issue: | path/to/file.ts | 42 |
| 2 | suggestion: | path/to/other.ts | 15 |
```

## Conventional Comments Format

All comments MUST use one of these prefixes:

| Prefix | When to use |
|--------|-------------|
| `issue:` | Problem, bug, or error that must be fixed |
| `suggestion:` | Improvement or alternative, non-blocking |
| `nitpick:` | Minor detail or personal preference |
| `question:` | Question about code intent or behavior |
| `thought:` | Reflection or idea related to the code |
| `praise:` | Positive aspect, good practice |

### Comment structure

```
{prefix}: {description concise du problème en français}.

{explication du pourquoi c'est un problème, avec le contexte, en français}

{solution concrète ou alternative, avec exemple de code si pertinent, en français}
```

### Rules

- Formuler des commentaires clairs, concis et précis.
- Adopter un ton respectueux et constructif. Privilégier les suggestions et les
  questions aux affirmations catégoriques.
- Justifier chaque commentaire. Expliquer le "pourquoi".
- Proposer des solutions alternatives concrètes.
- Every comment must be an inline comment anchored to a code line, not a
  general note on the MR.
- Langue : Les préfixes restent en anglais (convention Conventional Comments).
  Tout le reste du commentaire (description, explication, solution, référence
  à la règle) doit être rédigé en français.

## Error handling

- If `glab api --input` fails (returns non-zero), retry once.
- If a file is not in the diff, the inline comment cannot be anchored — skip it
  and report it as a plain note instead.
- If the diff is empty, report "No changes to review".
- If Oracle returns no findings, report "No issues found" and post a `praise:`
  comment if warranted.
