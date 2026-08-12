# STATUS

## En cours

## Fait

### 2026-08-12 — Audit + corrections + durcissement sécurité + synchro docs

- Audit read-only : 11 findings identifiés (3 high, 5 medium, 2 low, 1 info)
- 10 findings corrigés (voir CHANGELOG.md pour le détail)
- Preset `opencode-go` supprimé (provider non disponible)
- Modèle Spark aligné → Ministral-3 (doc ↔ code)
- `cat *` restreint sur Spark, mis en `deny` sur 7 sous-agents, `ask` sur aurora-heavy
- `memory.md` orphelin supprimé de la config active (`install.sh --prune`)
- BUFFER.md nettoyé (304 → 33 lignes)
- STATUS.md allégé (263 → 42 lignes, historique archivé dans CHANGELOG)
- Examples `node-api` et `monorepo` complétés avec AGENTS.md
- `docs/testing.md` mis à jour (Angular-only → multi-stack)
- INDEX.md mis à jour (15 agents, 16 standards, config, conventions)
- DECISIONS.md enrichi (3 décisions : cat *, opencode-go, Spark modèle)
- `docs/workflow.md` : référence à `agent-output.md` ajoutée
- `examples/angular-app/AGENTS.md` synchronisé avec le template actuel
- Documentation enrichie : B300 sans auth, risques permissions, différences euria-code

### 2026-08-11 — Standard agent-output.md

- Format de retour JSON structuré pour tous les sous-agents (schéma v1, 12 catégories, 5 sévérités)
- 13 agents mis à jour avec section "Format de retour JSON"

### 2026-08-10 — Fix auth + Search & Growth + audit 54 findings

- Fix collision `OPENAI_API_KEY` → `OPENAI_API_KEY_INFOMANIAK`
- 7 agents Search & Growth créés (atlas, crawler, sage, scribe, pulse, echo, beacon)
- Routing Search & Growth automatique + mots-clés déclencheurs + multi-agents
- 54 findings d'audit corrigés sur 55 (sécurité permissions = choix utilisateur)

> Historique complet : voir `CHANGELOG.md`

## Bloqué

## Prochaine action

- [ ] Redémarrer OpenCode pour activer les nouveaux modèles et agents
- [ ] Tester : Aurora délègue un commit à Spark via `task`
- [ ] Tester : Aurora délègue une analyse d'image à Vision
- [ ] Tester : Aurora délègue une stratégie SEO à Atlas via `task`
