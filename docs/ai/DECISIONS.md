# DECISIONS

## 2026-08-12 — Durcissement `cat *` sur les sous-agents

### Contexte

Les sous-agents Search & Growth (atlas, crawler, scribe, pulse, echo, sage, beacon) et aurora-heavy (mode primary) avaient `cat *: allow` dans leurs permissions bash. `cat *` permet la lecture de fichiers sensibles (`.env`, `~/.ssh/id_rsa`). Les sous-agents n'ont pas de canal interactif pour confirmer un `ask` — un `ask` sur un sous-agent = hang silencieux.

### Décision

- **Sous-agents** (mode subagent, pas d'interaction) : `cat *` → `deny`. Les sous-agents ont le tool `read` natif pour lire des fichiers. `cat` est redondant et crée une brèche sécurité.
- **aurora-heavy** (mode primary, interactif) : `cat *` → `ask`. L'utilisateur peut confirmer interactivement.
- **Spark** (mode all) : `cat` restreint à `cat ./mr-*.md` + `cat ./*.md` (fichiers de travail MR uniquement).

### Impact

- 7 sous-agents Search & Growth : `cat *: deny` effectif.
- `aurora-heavy.md` : `cat *: ask` (confirmation interactive).
- `spark.md` : `cat` limité aux fichiers de travail.
- Aucun impact fonctionnel : le tool `read` reste disponible pour tous les agents.

## 2026-08-12 — Suppression du preset `opencode-go`

### Contexte

Le preset `opencode-go` dans `oh-my-opencode-slim.json` référençait un provider `opencode-go` non défini dans `opencode.json`. Si sélectionné, tous les agents échouaient au démarrage. Le preset n'était pas utilisé.

### Décision

Supprimer le preset `opencode-go` du fichier `oh-my-opencode-slim.json`. Le provider correspondant n'est pas disponible et le preset n'est pas utilisé. Si un futur provider `opencode-go` est configuré, le preset pourra être recréé.

### Impact

- `oh-my-opencode-slim.json` ne contient qu'un seul preset : `euria-code`.
- Aucun impact runtime (le preset n'était jamais sélectionné).
- Warning dans `WARNINGS.md` archivé.

## 2026-08-12 — Modèle Spark → Ministral-3

### Contexte

`STATUS.md` et `CHANGELOG.md` documentaient depuis le 2026-08-09 un changement de modèle Spark de Nemotron Nano 30B vers Ministral-3 (qualité commit/MR). Mais le fichier `agents/spark.md` utilisait encore `NVIDIA-Nemotron-3-Nano-30B-A3B-FP8`. Inconsistance entre la mémoire et le code.

### Décision

Appliquer le changement documenté : `model: infomaniak/mistralai/Ministral-3-14B-Instruct-2512` dans `spark.md` et mettre à jour la référence dans `aurora.md`.

### Impact

- `spark.md` : modèle aligné avec la documentation.
- `aurora.md` : référence "Spark (Ministral-3, léger)" au lieu de "Nemotron Nano 30B".
- Coût : Ministral-3 (0,30/0,40 $) vs Nemotron (0,05/0,20 $) — légère augmentation pour meilleure qualité de commit/MR.

## 2026-08-11 — Format de retour JSON structuré pour les sous-agents (agent-output.md)

### Contexte

Les sous-agents retournaient du texte libre, rendant la consolidation multi-agents manuelle et non déterministe. Aucun système de format structuré n'existait pour les retours de sous-agents vers Aurora.

### Décision

Créer un nouveau standard `standards/agent-output.md` définissant un schéma JSON v1 obligatoire pour tous les retours de sous-agents via `task`.

1. **Schéma JSON v1** : agent, task, status, summary, findings[], metrics[], conflicts[], gaps[], next_steps[], metadata.
2. **12 catégories normalisées** : seo, technical, aio, content, growth, social, analytics, code, security, performance, accessibility, tests.
3. **5 niveaux de sévérité** : critical / high / medium / low / info.
4. **Obligation** : tout sous-agent via `task` doit retourner le bloc JSON. Un retour sans JSON est un échec partiel.
5. **Obligation universelle** : tout sous-agent via `task` doit retourner le bloc JSON, **sans exception**. Spark et Vision sont inclus. Le JSON peut être minimal pour les tâches triviales (Spark) ou descriptif pour l'analyse visuelle (Vision), mais le format est identique.
6. **Consolidation** : Aurora parse les blocs JSON, détecte les conflits, fusionne les findings par sévérité et produit un rapport unifié.

### Impact

- 13 agents mis à jour avec une section "Format de retour JSON" et le mapping des champs existants vers le schéma (11 agents initiaux + Spark et Vision après suppression de l'exception).
- `aurora.md` et `AGENTS.md` référencent le standard dans les règles de délégation et le comportement attendu.
- Les formats métier existants (sévérité, niveaux de confiance, KPIs) sont préservés — le JSON est une couche de transport.
- `confidence` est unifié sur `established | reasonable | experimental` pour tous les agents (Beacon aligné).

## 2026-08-10 — Renommage Oracle → Sage pour éviter le conflit avec le preset `oracle`

### Contexte

Le plugin `oh-my-opencode-slim` définit un preset nommé `oracle` (modèle Qwen 397B, variant high) pour les skills de raisonnement critique : `code-review`, `pre-mr-review`, `verification-planning`, `simplify`. Un nouvel agent AIO/GEO devait être créé. Le nom "Oracle" était le choix naturel pour ce rôle, mais entrait en conflit avec le preset du plugin.

### Décision

Renonmer l'agent AIO/GEO en **Sage** au lieu d'Oracle. Le preset `oracle` du plugin et l'agent `sage.md` coexistent sans ambiguïté :

1. **Preset `oracle`** (plugin `oh-my-opencode-slim.json`) : gère les skills de raisonnement critique via la configuration du plugin. Invoqué par OpenCode pour `code-review`, `pre-mr-review`, `verification-planning`, `simplify`.
2. **Agent `agents/sage.md`** (AIO/GEO) : agent subagent invocable via `task` avec `subagent_type: sage`. Gère l'optimisation pour AI Overviews, ChatGPT Search, Perplexity, Gemini.

Les deux utilisent le même modèle (`Qwen/Qwen3.5-397B-A17B-FP8`) mais c'est une coïncidence, pas une dépendance.

### Impact

- Les skills `code-review`, `pre-mr-review`, `verification-planning`, `simplify` continuent d'être routés vers le preset `oracle` du plugin sans changement.
- L'agent `sage.md` est invoqué via `task` pour les tâches AIO/GEO.
- Aucune ambiguïté de nommage : "Oracle" désigne toujours le preset du plugin, "Sage" désigne l'agent AIO/GEO.

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
