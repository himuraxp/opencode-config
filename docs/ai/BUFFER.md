# BUFFER

## Snapshot reprise — 2026-08-12 (audit + corrections findings)

### Sujet

Audit read-only du repo + correction de 10 findings (3 high, 4 medium, 2 low, 1 info).

### Fichiers impactés

- `config/oh-my-opencode-slim.json` (modifié — preset opencode-go supprimé)
- `config/.env.example` (modifié — documentation B300 sans auth + différences euria-code)
- `agents/spark.md` (modifié — modèle → Ministral-3, cat restreint)
- `agents/aurora.md` (modifié — référence Spark Ministral-3)
- `docs/ai/WARNINGS.md` (modifié — warning aurora-heavy archivé, risques permissions documentés, opencode-go mis à jour)
- `docs/ai/BUFFER.md` (modifié — nettoyage snapshots anciens)
- `README.md` (modifié — clarification stubs examples)
- `docs/ai/STATUS.md` (modifié)
- `docs/ai/CHANGELOG.md` (modifié)

### Décisions clés

- F-01 : preset `opencode-go` supprimé (provider non disponible, non utilisé — choix utilisateur).
- F-03 : Ministral-3 appliqué comme modèle Spark (alignement doc ↔ code).
- F-04 : `cat *` restreint à `cat ./mr-*.md` et `cat ./*.md` sur Spark.
- F-05 : risques permissions documentés dans WARNINGS.md au lieu de modifier le choix utilisateur.
- F-07 : `websearch` et `gh_grep` confirmés fournis par le plugin (tools disponibles en runtime). Pas d'action.

### État

- Tous les fichiers modifiés et cohérents.
- Review contradictoire en attente.
- Vérifications : bash -n OK, jq OK, JSON valide.
