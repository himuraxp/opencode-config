# WARNINGS

## Warnings actifs

- [ ] `docs/ai/` etait incomplet au demarrage de la session du 2026-06-28 : seuls `STATUS`, `CHANGELOG` et `BUFFER` existaient. Les fichiers manquants ont ete ajoutes.
- [ ] Les idees AIDD liees a Claude (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre integrees telles quelles sans adapter explicitement au fonctionnement OpenCode.

## Dettes techniques connues

- La memoire locale de ce repo doit rester alignee avec les templates injectes dans les projets utilisateurs.
- Les futures ameliorations inspirees d'AIDD doivent eviter de creer une deuxieme taxonomie concurrente avec `standards/`, `agents/`, `frameworks/`.
- **`aurora-heavy.md`** est present dans la config active (`~/.config/opencode/agents/`) mais **non versionne** dans le repo source. Perdu a la prochaine reinstall propre. A ajouter au repo ou documenter son statut.
- **`cat *: allow` sur Spark** : permet la lecture de fichiers sensibles (`.env`, `~/.ssh/id_rsa`). Spark dispose du tool `read` pour le contexte code. Restreindre `cat` aux fichiers de travail (`cat ./mr-*.md`, `cat ./*.md`) ou passer en `ask`. Non bloque pour l'instant (hors scope de la delegation).
- Le dossier `~/.config/opencode/agent/` (singulier) est maintenant vide apres suppression du doublon `vision.md`. Supprimable.

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
