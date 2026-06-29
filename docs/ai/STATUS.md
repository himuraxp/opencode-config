# STATUS

## En cours

## Fait

### 2026-06-28 — Correction des 7 findings d'audit

- Corrige :
  - `install.sh` : ajout `--prune`, `--dry-run`, `--help`, detection des orphelins
  - config installee : suppression de `~/.config/opencode/standards/memory.md` via `install.sh --prune`
  - `sync-project.sh` : preservation des `.new` existants via suffixe timestamp
  - `templates/AGENTS.md` : retrait des conventions Angular 20 du template generique
  - README : hierarchie de priorite corrigee, documentation `--prune`, `.new` horodates, stack explicite
  - memoire : clarification `docs/ai/` absent entre `memory-session-flow.md` et `memory-checklist.md`
  - exemples : Angular mis a jour ; Node/monorepo clarifies comme structures cibles
  - Astro/standards/docs : corrections de typos et formulations
- Verifications :
  - `bash -n scripts/install.sh`
  - `bash -n scripts/init-project.sh`
  - `bash -n scripts/sync-project.sh`
  - `scripts/install.sh --dry-run --prune`
  - `scripts/install.sh --prune`
  - `init-project.sh --dry-run`
  - `sync-project.sh --dry-run`
  - test `.new` existant preserve
  - `git diff --check`

### 2026-06-28 — Audit read-only opencode-config

- Audit complet read-only du repo :
  - scripts d'installation/synchronisation
  - standards et agents
  - templates projet
  - documentation utilisateur
  - exemples
  - config installee dans `~/.config/opencode`
- Verifications :
  - `bash -n scripts/install.sh`
  - `bash -n scripts/init-project.sh`
  - `bash -n scripts/sync-project.sh`
- Findings principaux :
  - `install.sh` ne nettoie pas les anciens fichiers installes ; `~/.config/opencode/standards/memory.md` est encore present
  - `sync-project.sh` peut ecraser un `.new` existant
  - `templates/AGENTS.md` injecte Angular 20 dans tous les projets
  - README : hierarchie de priorite contradictoire avec la regle locale
  - exemples non synchronises avec les templates actuels
  - contradictions/typos dans standards et docs

### 2026-06-28

- Analyse comparative du dossier `plugins` de `ai-driven-dev/framework` branche `next`
- Integration adaptee des recommandations pertinentes :
  - `standards/audit.md`
  - `standards/artifact-authoring.md`
  - review adversarial en axes code/fonctionnel/pertinence
  - lifecycle `PLAN.md` avec `status`
  - `INDEX.md` enrichi avec capacites prouvees
- Documentation et templates synchronises
- Verifications : `bash -n` scripts + dry-runs `init-project.sh` et `sync-project.sh`

### 2026-06-09 ~12:00

- Audit Claude Code best practices : intégration de 4 nouveaux standards
  - `review-before-done.md` : examen contradictoire avant fin de tâche
  - `exploration-limits.md` : délimitation des investigations (>15 fichiers = subagent)
  - `error-correction.md` : règle du 2-strikes + reset obligatoire
  - `anti-patterns.md` : 5 patterns d'échec courants
- Workflow enrichi : ajout étape REVIEW (6 étapes)
- AGENTS.md (global + template) : 4 nouvelles obligations de comportement
- README.md mis à jour avec les 10 standards
- Mise à jour mémoire projet site-manager (media-converter migration terminée)
- Audit de cohérence complet + corrections critiques :
  - Renommer memory.md → memory-session-flow.md pour lever ambiguïté
  - Ajout règle "2 reviews successifs échoués" dans review-before-done.md
  - Clarification définition "strike" dans error-correction.md
  - Correction références croisées (templates/AGENTS.md, README, docs/customization.md)

### 2026-06-09 ~12:30

- Fix audit : corrections des incohérences identifiées lors de l'audit
  - Renommage memory.md → memory-session-flow.md
  - Mise à jour de toutes lesreferences (README, templates/AGENTS, docs/customization.md)
  - Ajout section "Si le review échoue encore" dans review-before-done.md
  - Clarification détaillée de la définition "strike" dans error-correction.md
  - Vérification finale : aucune référence restante à memory.md, cohérence confirmée

## Bloqué

## Prochaine action

- [ ] Pusher les changements sur le remote
- [ ] Optionnel : tester sur un nouveau projet que la mémoire docs/ai/ fonctionne correctement avec le nouveau workflow
- [x] Choisir avec l'utilisateur les ameliorations AIDD a implementer en priorite
- [x] Prioriser et corriger les findings de l'audit read-only
