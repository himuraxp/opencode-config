---
status: reviewed
---

# PLAN

## Objectif

Corriger les 7 findings issus de l'audit read-only de `opencode-config`.

## Etapes

- [x] Ajouter `install.sh --prune` et nettoyer `~/.config/opencode/standards/memory.md`
- [x] Proteger les `.new` existants dans `sync-project.sh`
- [x] Rendre `templates/AGENTS.md` generique et sortir Angular du template commun
- [x] Corriger la hierarchie de priorite du README
- [x] Clarifier la regle `docs/ai/` absent entre memory-session-flow et memory-checklist
- [x] Synchroniser les exemples avec les templates actuels ou clarifier leur statut
- [x] Corriger les typos et formulations degradees dans Astro et standards/docs
- [x] Verifier scripts, dry-runs, prune, `.new` horodate et config installee

## Risques

- `install.sh --prune` supprime les `.md` orphelins des dossiers installes ; a utiliser quand ces dossiers sont geres par ce repo.
- Le template generique impose de documenter explicitement la stack dans le `AGENTS.md` local du projet.

## Tests

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`
- `scripts/init-project.sh --dry-run` depuis `/private/tmp`
- `scripts/sync-project.sh --dry-run` depuis `/private/tmp`
- `scripts/install.sh --dry-run --prune`
- `scripts/install.sh --prune`
- test temporaire : `sync-project.sh` preserve `AGENTS.md.new` et cree `AGENTS.md.new.YYYYMMDD-HHMMSS`
- verification : `~/.config/opencode/standards/memory.md` absent
- `git diff --check`
