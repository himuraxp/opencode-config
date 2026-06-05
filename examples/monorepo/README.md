# Exemple Monorepo

Exemple de monorepo avec `AGENTS.md` et documentation IA.

Initialisé via :

```bash
~/.config/opencode-config/scripts/init-project.sh
```

## Structure

```txt
monorepo/
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
  packages/          → packages du monorepo
```

## Standards appliqués

Ce monorepo suit les standards : framework Angular 20+

- Séparation des concerns
- Tests par package
- Scripts build/lint/test au niveau root
