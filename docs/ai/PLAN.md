---
status: reviewed
---

# PLAN

## Objectif

Evaluer les idees du projet `ai-driven-dev/framework` branche `next`, dossier `plugins`, qui pourraient ameliorer `opencode-config`.

## Etapes

- [x] Lire la memoire locale disponible (`STATUS`, `CHANGELOG`, `BUFFER`)
- [x] Inspecter la structure locale `standards/`, `agents/`, `frameworks/`, `templates/`
- [x] Inspecter le dossier externe `plugins` en clone temporaire read-only
- [x] Identifier les apports transposables sans copier le modele Claude plugin tel quel
- [x] Decider avec l'utilisateur quelles ameliorations implementer
- [x] Implementer les standards et templates retenus
- [x] Verifier les scripts et dry-runs
- [x] Effectuer une review contradictoire manuelle

## Risques

- Ne pas importer tel quel des concepts Claude (`.claude-plugin`, hooks Claude) dans OpenCode sans verifier le support reel.
- Eviter de dupliquer la memoire existante : privilegier une evolution de `docs/ai/` et des standards actuels.

## Tests

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`
- `scripts/init-project.sh --dry-run` depuis `/private/tmp`
- `scripts/sync-project.sh --dry-run` depuis `/private/tmp`
