# CHANGELOG

## 2026-08-11

- Nouveau standard `agent-output.md` : format de retour JSON structuré pour les sous-agents (schéma v1, 12 catégories, 5 sévérités, consolidation multi-agents)
- 13 agents mis à jour avec section "Format de retour JSON" (atlas, crawler, sage, scribe, pulse, echo, beacon, reviewer, security, architect, tester, spark, vision) — aucune exception
- `aurora.md` et `AGENTS.md` : référence au standard dans les règles de délégation et comportement attendu

## 2026-08-10

- Audit complet read-only du repo (55 findings sur 4 zones via subagents Reviewer parallèles)
- Correction du routing Search & Growth : délégation automatique + mots-clés déclencheurs + routing multi-agents
- Équipe Search & Growth : 7 nouveaux agents (atlas, crawler, sage, scribe, pulse, echo, beacon)
- `standards/audit.md` : exception SEO/AIO/Growth déléguée aux agents spécialistes
- `templates/AGENTS.md` : exception SEO/AIO/Growth dans le Mode AUDIT

## 2026-08-09

- Portabilité complète du repo : `git clone + setup.sh` reproduit toute la config
- `config/` créé : `opencode.json` (secrets → `{env:...}`), `oh-my-opencode-slim.json`, `package.json`, `plugins/rtk.ts`, `.env.example`
- `scripts/setup.sh` : installation interactive (prérequis, opencode-ai, rtk, MCP, secrets, vérification)
- `scripts/install.sh` : tracking `new/updated/unchanged`, `--no-config`, `--prune`, `--dry-run`
- `standards/delegation-failure.md` : procédure obligatoire après échec de sous-agent
- Optimisation modèles par agent (oracle → Qwen 397B, explorer/librarian → Ministral-3, etc.)
- `aurora-heavy.md` ajouté au repo

## 2026-08-06

- Délégation sous-agents : Spark (commit/MR, `mode: all`) + Vision (multimodal)
- `agents/aurora.md` : section "Délégation aux sous-agents" (Spark par défaut + fallback, Vision obligatoire pour images)
- `agents/spark.md` : permissions bash complétées pour `create-mr` + `skill: allow`

## 2026-06-28

- Correction des 7 findings de l'audit read-only (install.sh --prune, sync-project.sh .new horodatés, template générique, etc.)
- Analyse et intégration adaptée des recommandations AIDD (audit read-only, artifact-authoring, review en axes, lifecycle PLAN.md, capacités prouvées INDEX.md)
- Ajout des fichiers `docs/ai/` manquants : `PLAN.md`, `INDEX.md`, `WARNINGS.md`, `DECISIONS.md`

## 2026-06-09

- Intégration Claude Code best practices : 4 nouveaux standards (review-before-done, exploration-limits, error-correction, anti-patterns)
- Workflow enrichi : ajout étape REVIEW (6 étapes)
- AGENTS.md (global + template) : 4 nouvelles obligations de comportement
- Renommage `memory.md` → `memory-session-flow.md` pour lever l'ambiguïté

## 2026-06-05

- Restructuration complète du repository.
- Création des dossiers `agents/`, `templates/`, `examples/`, `scripts/`, `docs/`.
- Renommage des agents : `angular-20-infomaniak.md`, `reviewer.md`, `tester.md`, `architect.md`.
- Ajout de l'agent `security.md` pour les revues de code sécurité.
- Ajout de la documentation `docs/` (angular-20, code-review, testing, architecture).
- Ajout des exemples `angular-app`, `node-api`, `monorepo`.
- Installation multi-couches documentée dans le README.
- Scripts `install.sh`, `init-project.sh`, `sync-project.sh` adaptés à la nouvelle structure.
