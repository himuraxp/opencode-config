# Exemple Node.js API

Exemple de projet Node.js / Express avec `AGENTS.md` et documentation IA.

Initialisé via :

```bash
~/.config/opencode-config/scripts/init-project.sh
```

## Structure

```txt
node-api/
  AGENTS.md          → conventions du projet
  docs/
    ai/
      PLAN.md        → plan technique courant
      STATUS.md      → état d'avancement
      DECISIONS.md   → décisions structurantes
      CHANGELOG.md   → historique des agents
      BUFFER.md      → mémoire tampon de session
      INDEX.md       → cartographie du projet
      WARNINGS.md    → alertes et dettes techniques
  src/               → sources Node.js
```

## Standards appliqués

Ce projet suit les conventions du framework `nodejs.md` :

- Séparation routes / services / repositories
- Validation des entrées
- Gestion d'erreurs centralisée
- Tests Jest (unitaires + intégration)
- Logs structurés
- Pas de `any`
