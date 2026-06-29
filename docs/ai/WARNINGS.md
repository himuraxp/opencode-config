# WARNINGS

## Warnings actifs

- [ ] `docs/ai/` etait incomplet au demarrage de la session du 2026-06-28 : seuls `STATUS`, `CHANGELOG` et `BUFFER` existaient. Les fichiers manquants ont ete ajoutes.
- [ ] Les idees AIDD liees a Claude (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre integrees telles quelles sans adapter explicitement au fonctionnement OpenCode.

## Dettes techniques connues

- La memoire locale de ce repo doit rester alignee avec les templates injectes dans les projets utilisateurs.
- Les futures ameliorations inspirees d'AIDD doivent eviter de creer une deuxieme taxonomie concurrente avec `standards/`, `agents/`, `frameworks/`.
- `install.sh --prune` supprime les `.md` orphelins dans les dossiers installes ; a utiliser seulement quand `~/.config/opencode/{agents,standards,frameworks}` est gere par ce repo.

## Zones sensibles du projet

- `AGENTS.md`
- `standards/memory-*.md`
- `templates/AGENTS.md`
- `scripts/init-project.sh`
- `scripts/sync-project.sh`

## Workarounds existants

- Aucun workaround actif identifie.

## Historique des warnings clotures

### 2026-06-28 — Artefact `memory.md` obsolete installe

- Warning : la config installee contenait encore `~/.config/opencode/standards/memory.md`.
- Resolution : ajout de `install.sh --prune` et execution sur ce Mac.
- Date cloture : 2026-06-28

### 2026-06-28 — Exemples en retard

- Warning : `examples/angular-app` documentait encore un workflow sans Review.
- Resolution : exemple Angular aligne, exemples Node/monorepo clarifies comme structures cibles.
- Date cloture : 2026-06-28

### 2026-06-28 — `.new` ecrasable

- Warning : `sync-project.sh` pouvait ecraser un fichier `.new` existant.
- Resolution : creation de propositions horodatees si `.new` existe deja.
- Date cloture : 2026-06-28
