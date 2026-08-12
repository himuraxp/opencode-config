# BUFFER

## Snapshot reprise — 2026-08-12 (audit + corrections + durcissement)

### Sujet

Audit read-only du repo + correction de 10 findings + durcissement sécurité (cat *) + nettoyage mémoire + complétion examples + synchro docs.

### Fichiers impactés

- `config/oh-my-opencode-slim.json` (modifié — preset opencode-go supprimé)
- `config/.env.example` (modifié — documentation B300 + différences euria-code)
- `agents/spark.md` (modifié — modèle Ministral-3, cat restreint)
- `agents/aurora.md` (modifié — référence Spark)
- `agents/{atlas,crawler,scribe,pulse,echo,sage,beacon}.md` (modifié — cat * → deny)
- `agents/aurora-heavy.md` (modifié — cat * → ask)
- `docs/ai/WARNINGS.md` (modifié — 3 warnings archivés, risques documentés)
- `docs/ai/BUFFER.md` (modifié — nettoyage)
- `docs/ai/STATUS.md` (modifié — allégement)
- `docs/testing.md` (modifié — multi-stack)
- `examples/node-api/AGENTS.md` (créé)
- `examples/monorepo/AGENTS.md` (créé)
- `README.md` (modifié)
- `docs/ai/STATUS.md` (modifié)
- `docs/ai/CHANGELOG.md` (modifié)

### Décisions clés

- `cat *` sur sous-agents → `deny` (tool `read` natif suffit, `cat` est redondant et crée une brèche sécurité)
- `cat *` sur aurora-heavy → `ask` (agent primary interactif, utilisateur peut confirmer)
- Examples complétés avec AGENTS.md au lieu d'être supprimés (valeur pédagogique)
- STATUS.md allégé : historique archivé dans CHANGELOG, ne garder que récent + en cours + bloqué

### État

- Tous les fichiers modifiés et cohérents.
- Review contradictoire en attente.
- Vérifications : jq OK, bash -n OK, install.sh --prune OK.
