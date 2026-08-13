# BUFFER

## Snapshot reprise — 2026-08-12 (création agents designer + mobile)

### Sujet

Création de 2 nouveaux agents spécialisés (designer, mobile) et mise à jour de toutes les références.

### Fichiers impactés

- `agents/designer.md` (créé — UX/UI/DA/DS/accessibilité, Mistral-Small-4 multimodal)
- `agents/mobile.md` (créé — iOS/Android/RN/Flutter, euria-code)
- `config/oh-my-opencode-slim.json` (modifié — 2 agents déclarés)
- `agents/aurora.md` (modifié — règles de délégation designer + mobile)
- `AGENTS.md` (modifié — 17 agents, délégation mise à jour)
- `README.md` (modifié — 4 références 15→17 agents, table agents)
- `docs/customization.md` (modifié — table agents)
- `scripts/setup.sh` (modifié — vérification 17 agents)
- `docs/ai/INDEX.md` (modifié — 17 agents)
- `docs/ai/STATUS.md` (modifié)
- `docs/ai/CHANGELOG.md` (modifié)

### Décisions clés

- Designer utilise Mistral-Small-4 (multimodal) pour analyser mockups et screenshots
- Mobile utilise euria-code (code generation performant)
- Permissions identiques aux autres sous-agents : edit:allow, bash:deny, webfetch:allow
- Format de retour JSON agent-output.v1 comme tous les autres agents

### État

- Tous les fichiers créés et modifiés.
- health-check.sh à lancer.
- Review contradictoire en attente.
