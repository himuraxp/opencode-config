# DECISIONS

## 2026-08-06 — Délégation sous-agents Spark & Vision

### Contexte

Aurora utilise `infomaniak/euria-code` (text-only). Les tâches répétitives (commit, MR) consomment du contexte sur un modèle coûteux. Les images ne peuvent pas être traitées. Spark (Nemotron Nano 30B, léger) existait mais en `mode: primary`, non déléguable via `task`. Vision (Mistral-Small-4, multimodal) était déjà en `mode: all`.

### Décision

1. **Spark** : passer en `mode: all` (déléguable + manuel). Déléguer par défaut les commits et MR depuis Aurora, avec fallback Aurora si Spark échoue.
2. **Vision** : déjà déléguable. Aurora DOIT déléguer toute image à Vision (Aurora est text-only).
3. **Permissions Spark** : `edit: deny` (lecture seule), `git push: allow` (le sous-agent n'a pas de canal interactif pour confirmer un `ask` ; le push est limité à la branche courante, le skill commit garantit qu'on n'est pas sur main), `skill: allow` (charge commit/create-mr), `glab` restreint à `mr`/`repo view`/`api`.
4. **Pas de standard séparé** : la règle de délégation vit dans le prompt Aurora (2 skills, un standard serait over-engineering).

### Impact

- Aurora délègue automatiquement commit/MR à Spark et images à Vision.
- Réduction de coût (Nemotron Nano 30B : 0,05/0,20 $ vs euria-code).
- `git push` en `allow` pour Spark (le sous-agent n'a pas de canal interactif ; le skill commit garantit qu'on n'est pas sur main). Aurora garde `git push: ask` en primary.
- Redémarrage OpenCode requis pour activer `spark` comme subagent_type.

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
