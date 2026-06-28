# DECISIONS

## 2026-06-28 — Analyse AIDD sans import direct

### Contexte

Le projet externe `ai-driven-dev/framework` propose des plugins Claude structures autour de skills, agents, hooks, catalogues et templates. L'utilisateur a demande quelles idees pourraient ameliorer `opencode-config`.

### Decision

Aucune integration n'est decidee a ce stade. Les idees doivent etre traitees comme inspirations de conception, pas comme import direct, car `opencode-config` cible OpenCode et repose deja sur `standards/`, `agents/`, `frameworks/` et `docs/ai/`.

### Impact

Les candidats prioritaires a discuter sont : lifecycle de plan avec statut, review en axes explicites, memoire par capacites detectees, audit read-only multi-piliers, et generateurs de standards/agents.

## 2026-06-28 — Integration adaptee des recommandations AIDD

### Contexte

L'utilisateur a valide l'application des recommandations pertinentes issues de l'analyse AIDD.

### Decision

Integrer uniquement les concepts compatibles OpenCode :

- audit read-only multi-axes ;
- creation homogene d'artefacts IA ;
- review adversarial structuree en axes code, fonctionnel, pertinence ;
- statut explicite dans `PLAN.md` ;
- capacites prouvees dans `INDEX.md`.

Ne pas importer `.claude-plugin`, hooks Claude, structure `aidd_docs/` ou workflows AIDD complets.

### Impact

Ajout de `standards/audit.md` et `standards/artifact-authoring.md`, mise a jour des standards memoire/workflow/review, des agents Aurora/reviewer, des templates projet et de la documentation utilisateur.
