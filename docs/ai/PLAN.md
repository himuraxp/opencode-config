---
status: reviewed
---

# PLAN

## Objectif

Maintenance continue du repo `opencode-config` — configuration globale de référence pour OpenCode.

## Étapes

- [x] Audit read-only complet (11 findings, 4 zones)
- [x] Correction des 10 findings actionnables
- [x] Suppression preset `opencode-go` (provider non disponible)
- [x] Alignement modèle Spark → Ministral-3 (doc ↔ code)
- [x] Durcissement `cat *` sur 8 agents (deny/ask)
- [x] Nettoyage mémoire (BUFFER, STATUS allégés)
- [x] Complétion examples (node-api, monorepo AGENTS.md)
- [x] Synchro docs (testing.md multi-stack, workflow.md agent-output)
- [x] Mise à jour INDEX.md et DECISIONS.md
- [x] 5 nouveaux scripts utilitaires (health-check, permissions-matrix, validate-memory, pre-commit secrets, auto-détection stack)

## Risques

- `install.sh --prune` supprime les `.md` orphelins des dossiers installés ; à utiliser quand ces dossiers sont gérés par ce repo.
- Le template générique impose de documenter explicitement la stack dans le `AGENTS.md` local du projet.
- Permissions bash permissives (curl, kill, sed, find en `allow`) par choix utilisateur documenté.

## Tests

- `bash scripts/health-check.sh --installed` — vérifie JSON, frontmatter, modèles, orphelins, références
- `bash scripts/validate-memory.sh .` — valide la structure `docs/ai/`
- `bash scripts/permissions-matrix.sh` — génère la matrice des permissions
- `bash -n scripts/*.sh` — syntaxe des scripts
- `scripts/init-project.sh --dry-run` — prévisualisation initialisation projet
