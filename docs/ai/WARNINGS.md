# WARNINGS

## Warnings actifs

- [ ] `docs/ai/` etait incomplet au demarrage de la session du 2026-06-28 : seuls `STATUS`, `CHANGELOG` et `BUFFER` existaient. Les fichiers manquants ont ete ajoutes.
- [ ] Les idees AIDD liees a Claude (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre integrees telles quelles sans adapter explicitement au fonctionnement OpenCode.

## Dettes techniques connues

- La memoire locale de ce repo doit rester alignee avec les templates injectes dans les projets utilisateurs.
- Les futures ameliorations inspirees d'AIDD doivent eviter de creer une deuxieme taxonomie concurrente avec `standards/`, `agents/`, `frameworks/`.

## Zones sensibles du projet

- `AGENTS.md`
- `standards/memory-*.md`
- `templates/AGENTS.md`
- `scripts/init-project.sh`
- `scripts/sync-project.sh`

## Workarounds existants

- Aucun workaround actif identifie.

## Historique des warnings clotures

- Aucun warning cloture documente.
