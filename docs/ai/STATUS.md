# STATUS

## En cours

## Fait

### 2026-08-11 — Standard agent-output.md (format de retour JSON des sous-agents)

- **Problème** : les sous-agents retournaient du texte libre, rendant la consolidation multi-agents manuelle et non déterministe
- **Solution** : nouveau standard `standards/agent-output.md` définissant un schéma JSON structuré pour tous les retours de sous-agents
  - Schéma JSON v1 : agent, task, status, summary, findings[], metrics[], conflicts[], gaps[], next_steps[], metadata
  - 12 catégories normalisées (seo, technical, aio, content, growth, social, analytics, code, security, performance, accessibility, tests)
  - 5 niveaux de sévérité (critical / high / medium / low / info)
  - Rapport de consolidation pour Aurora (tableau de bord, findings fusionnés, conflits détectés, métriques agrégées)
  - Mapping des champs existants de chaque agent vers le schéma
  - Exceptions : aucune (Spark et Vision inclus après correction)
- **Fichiers modifiés** :
  - `standards/agent-output.md` — nouveau standard (créé)
  - `agents/aurora.md` — références au standard dans les règles de délégation + liste standards obligatoires
  - `AGENTS.md` — référence dans "Comportement attendu" + liste standards
  - `agents/atlas.md` — section "Format de retour JSON"
  - `agents/crawler.md` — section "Format de retour JSON"
  - `agents/sage.md` — section "Format de retour JSON" (confidence obligatoire)
  - `agents/scribe.md` — section "Format de retour JSON"
  - `agents/pulse.md` — section "Format de retour JSON"
  - `agents/echo.md` — section "Format de retour JSON"
  - `agents/beacon.md` — section "Format de retour JSON"
  - `agents/reviewer.md` — section "Format de retour JSON"
  - `agents/security.md` — section "Format de retour JSON"
  - `agents/architect.md` — section "Format de retour JSON"
  - `agents/tester.md` — section "Format de retour JSON"
  - `agents/spark.md` — section "Format de retour JSON" (JSON minimal pour tâches triviales)
  - `agents/vision.md` — section "Format de retour JSON" (findings visuels + tags ["visual"])

### 2026-08-10 — Fix auth Infomaniak + displayName plugin compat

- **Problème 1 — Collision de variable** : `OPENAI_API_KEY` (globale, autre fournisseur) écrasait la clé Infomaniak → `AI_APICallError: Invalid Authentication`
  - `config/opencode.json` : header Authorization → `OPENAI_API_KEY_INFOMANIAK`
  - `config/.env.example` : variable renommée + commentaire de séparation
  - `scripts/setup.sh` : `env_is_complete`, prompt, write .env migrés + migration auto idempotente de l'ancienne variable + cleanup de l'ancienne ligne
  - `README.md` : table des variables mise à jour
- **Problème 2 — displayName incompatibles** : 7 displayName avec espaces/tirets cadratins/majuscules → regex `^[a-z][a-z0-9_-]*$` du plugin échouait au démarrage
  - `config/oh-my-opencode-slim.json` : 7 displayName normalisés en kebab-case lowercase
- **Review contradictoire** : subagent Reviewer — APPROVED (2 suggestions LOW appliquées : cleanup `OPENAI_API_KEY` + entrée CHANGELOG)
- **Vérifications** : `jq` valide, `bash -n` OK, regex displayName OK, migration testée en temporaire (first-run + idempotency), diff hors scope = 0

### 2026-08-10 — Correction des 54 findings d'audit (sur 55, hors sécurité permissions)

- **Scope** : 54 findings sur 55 corrigés (le point 1 sécurité permissions curl/kill/find/sed laissé en `allow` par choix utilisateur — Aurora doit rester autonome)
- **Priorité 2 (H4)** : `aurora.md` — `angular-20` corrigé comme framework (pas agent), ajout section "Standards obligatoires", référence workflow.md, hiérarchie d'autorité corrigée (Standards → Agents → Frameworks), clarification Oracle preset, référence memory en fin de cycle
- **Priorité 4 (H9/H10/H11/M21/M22)** :
  - `docs/customization.md` — 15 agents (table) + 15 standards listés
  - `README.md` — ordre de priorité corrigé (Standards → Agents → Frameworks), section "Comment l'utiliser" alignée
  - `CHANGELOG.md` racine — 6 entrées ajoutées (06-05 à 08-10)
  - `docs/workflow.md` — "Mise à jour en fin de session" complétée (7 étapes)
- **Priorité 5 (H6/H7/H8/M13)** :
  - `memory-checklist.md` — titre `Standard — Memory Checklist`, critère docs/ai/ absent clarifié, référence templates précisée
  - `memory-auto-update.md` — titre `Standard — Mémoire...` corrigé
  - `memory-session-flow.md` — titre `Standard — Memory Session Flow`, section fin de session remplacée par référence vers memory-auto-update.md, règle langue → référence communication.md
- **Priorité 6 (C1/H12)** : `artifact-authoring.md` — template mis à jour (guides flexibles reflétant la pratique réelle)
- **Priorité 7 (M10/B7)** : Permissions ajoutées à Vision (deny all), Architect (deny all), Reviewer (deny all), Tester (edit + bash tests), Security (deny edit + bash audit/grep)
- **Moyennes** : M2 (duplication tables AGENTS.md → référence aurora.md), M3 (setup.sh 15 agents), M6 (clarification Oracle), M7 (aurora-heavy accents), M8 (spark accents), M9 (duplication tables SEO), M12 (standards obligatoires aurora.md), M14 (review-before-done stack-agnostic), M15 (langue centralisée communication.md), M16 (workflow référence verification.md), M17 (workflow référence memory), M18 (Anti-patterns standardisé), M19/M20 (examples sync)
- **Basses** : B1 (.gitignore), B2 (package.json ~), B5 (Reviewer titre), B9 (accents), B10 (hiérarchie aurora.md), B11 (nestjs héritage nodejs), B12 (checklists référence verification.md), B13 (typo délègue), B14 (chemin templates), B16 (note angular-20.md), B18 (testing.md Angular)
- **Review contradictoire** : effectué via subagent Reviewer (4 gaps trouvés et corrigés : hiérarchie aurora.md, refactore→refactoré, delegation-failure example, README Comment l'utiliser)
- **Vérifications** : bash -n scripts OK, JSON valide, frontmatter YAML 15 agents valides, pas de références cassées, pas de "Anti-patterns interdits" restant

### 2026-08-10 — Audit complet read-only du repo

- **Périmètre** : 4 zones auditées en parallèle via subagents Reviewer (Scripts & Config, Agents, Standards & Frameworks, Templates & Docs & Examples)
- **Verdict** : À corriger (1 critique, 12 hautes, 22 moyennes, 20 basses = 55 findings)
- **Findings clés** :
  - Sécurité : `curl`, `kill`, `find`, `sed` en `allow` dans opencode.json (exfiltration, kill process, suppression fichiers)
  - Référence cassée : `aurora.md` délègue à `angular-20` comme agent (c'est un framework)
  - Permissions : Spark `git push *: allow` (agent léger sans confirmation), Vision sans section permission
  - Cohérence : template `artifact-authoring.md` ignoré par tous les standards/frameworks existants
  - Doublons : 3 fichiers mémoire se chevauchent, tables routing SEO dupliquées aurora.md ↔ AGENTS.md
  - Docs désynchronisées : `docs/customization.md` (5 agents sur 15, 10 standards sur 15), README (contradiction ordre priorité), CHANGELOG racine (1 entrée)
  - Examples : `angular-app/AGENTS.md` en retard vs template (section "Rôle" + exception SEO/AIO absentes)
- **Rapport** : livré à l'utilisateur en format audit.md (Verdict, Findings triés par sévérité, Hors scope, Vérifications recommandées, Synthèse par axe, Plan d'action)

### 2026-08-10 — Correction du routing Search & Growth

- **Problème** : le prompt "Tu peux vérifier qu'on est bon niveau SEO & AIO ?" ne déclenquait pas la délégation aux bons agents
- **Causes identifiées** : délégation "sur demande" (non automatique), pas de routing multi-agents, conflit avec l'instruction audit générique, mots-clés déclencheurs absents
- **Corrections** :
  - `aurora.md` : délégation Search & Growth → automatique + mots-clés déclencheurs (8 domaines) + routing multi-agents (10 patterns) + 6 règles de délégation + exception SEO/AIO/Growth sur audit
  - `AGENTS.md` : sync des mêmes tables + exception dans "Comportement attendu"
  - `audit.md` : section "Exception — audits SEO / AIO / Growth"
  - `templates/AGENTS.md` : exception SEO/AIO/Growth dans Mode AUDIT
  - Mots-clés trop larges retirés (article, données, mesure, performance, etc.)
  - Tables aurora.md ↔ AGENTS.md synchronisées
- **Review contradictoire** : effectué via subagent Reviewer (6 findings : 4 MEDIUM + 2 LOW, tous corrigés)
- **Config active** : `~/.config/opencode/` synchronisée

### 2026-08-10 — Équipe Search & Growth Agents

- **7 nouveaux agents créés** dans `agents/` :
  - `atlas.md` — SEO Strategist (Qwen 397B, edit: deny, webfetch: allow)
  - `crawler.md` — Technical SEO Engineer (edit: allow, webfetch: allow) — modèle par défaut (euria-code)
  - `sage.md` — AIO/GEO Specialist (Qwen 397B, edit: ask, webfetch: allow) — renommé Oracle → Sage pour éviter le conflit avec le preset `oracle` du plugin
  - `scribe.md` — SEO Content Strategist (edit: allow, webfetch: allow) — modèle par défaut (euria-code)
  - `pulse.md` — Growth Marketing Strategist (edit: deny, webfetch: allow) — modèle par défaut (euria-code)
  - `echo.md` — Social & Distribution Strategist (Mistral-Small-4, edit: allow, webfetch: ask)
  - `beacon.md` — Analytics & Intelligence (edit: deny, webfetch: allow) — modèle par défaut (euria-code)
- **Permissions** : moindre privilège appliqué (Atlas/Pulse/Beacon read-only, Crawler/Scribe/Echo edit, Sage edit:ask)
- **AGENTS.md** : section "Search & Growth Agents" ajoutée (table, architecture, workflow, routing, note renommage Sage)
- **README.md** : table des agents (15 agents), structure du repo, architecture, principe de priorité mis à jour
- **aurora.md** : table de délégation Search & Growth ajoutée (7 agents) + clarification preset Oracle vs agent Sage
- **DECISIONS.md** : décision de renommage Oracle → Sage documentée
- **Review contradictoire** : effectué via subagent Reviewer (frontmatter, cohérence, frontières, délégation, conflit de nom, models)

### 2026-08-09 — Portabilité du repo + optimisation modèles

- **Portabilité complète du repo** : `git clone + setup.sh` reproduit toute la config sur une nouvelle machine
  - `config/` créé : `opencode.json` (secrets → `{env:...}`), `oh-my-opencode-slim.json`, `package.json`, `plugins/rtk.ts`, `.env.example`
  - `scripts/setup.sh` créé : installation interactive (prérequis, opencode-ai, rtk, MCP optionnel, secrets, vérification)
  - `scripts/install.sh` modifié : copie `config/`, tracking `new/updated/unchanged`, `--no-config` flag
  - `agents/aurora-heavy.md` ajouté au repo (était installé mais non versionné)
  - `.gitignore` ajouté (`.env`, `node_modules`, etc.)
  - Aucun secret dans le repo (vérifié par scan + `git check-ignore`)
- **Détection intelligente** : `setup.sh` skip `.env` existant, check mises à jour `opencode-ai`/`rtk`, `--force` pour reconfigurer
- **MCP iOS Simulator optionnel** : `setup.sh` propose `idb-companion` (brew) + `fb-idb` (venv Python), collecte `IDB_UDID`/`IDB_PATH` adaptative
- **Standard `delegation-failure.md`** créé : procédure obligatoire après échec de sous-agent (constater → diagnostiquer → agir → informer), règle 1-retry-then-takeover, limite connue documentée (hang silencieux non détectable)
- **Optimisation modèles** par agent :
  - oracle: euria-code → Qwen3.5-397B (raisonnement stratégique)
  - explorer/librarian: euria-code-tiny → Ministral-3 (économie)
  - designer: euria-code-tiny → Mistral-Small-4 (multimodal)
  - fixer: euria-code → Qwen3.5-122B (-33% input)
  - spark: Nemotron-Nano-30B → Ministral-3 (qualité commit/MR)
- **README et AGENTS.md synchronisés** : 4 couches (config/ ajouté), 8 agents listés, section MCP, section Installation, `delegation-failure.md` référencé
- 7 commits pushés sur `origin/main` :
  - `d0bde4f` Portabilité : config/, setup.sh, secrets externalisés
  - `675a6f1` Détection intelligente : skip .env, check updates, track files
  - `3ec52e0` MCP iOS Simulator optionnel
  - `3e6bdf9` README sync (agents, MCP, standards)
  - `3380867` AGENTS.md sync (4 layers, setup.sh, MCP, sub-agents)
  - `cb274c9` Standard delegation-failure.md
  - (model optimization) perf(models): optimize model selection per agent

### 2026-08-06

- Délégation sous-agents : Spark (commit/MR, modèle léger Nemotron Nano 30B) + Vision (multimodal, Mistral-Small-4)
  - Spark : `mode: primary` → `mode: all` (déléguable via `task`)
  - Spark : permissions bash complétées pour `create-mr` (git push/fetch/show-ref/rev-list, rm mr-*.md) + `skill: allow`
  - Spark : prompt enrichi (section Skills commit/create-mr)
  - Aurora : section "Délégation aux sous-agents" ajoutée (Spark par défaut + fallback, Vision pour images)
  - Vision : déjà en `mode: all`, prompt inchangé
  - Synchro repo source : `agents/spark.md` et `agents/vision.md` créés dans le repo
  - Config active `~/.config/opencode/agents/` synchronisée

### 2026-06-28 — Correction des 7 findings d'audit

- Corrige :
  - `install.sh` : ajout `--prune`, `--dry-run`, `--help`, detection des orphelins
  - config installee : suppression de `~/.config/opencode/standards/memory.md` via `install.sh --prune`
  - `sync-project.sh` : preservation des `.new` existants via suffixe timestamp
  - `templates/AGENTS.md` : retrait des conventions Angular 20 du template generique
  - README : hierarchie de priorite corrigee, documentation `--prune`, `.new` horodates, stack explicite
  - memoire : clarification `docs/ai/` absent entre `memory-session-flow.md` et `memory-checklist.md`
  - exemples : Angular mis a jour ; Node/monorepo clarifies comme structures cibles
  - Astro/standards/docs : corrections de typos et formulations
- Verifications :
  - `bash -n scripts/install.sh`
  - `bash -n scripts/init-project.sh`
  - `bash -n scripts/sync-project.sh`
  - `scripts/install.sh --dry-run --prune`
  - `scripts/install.sh --prune`
  - `init-project.sh --dry-run`
  - `sync-project.sh --dry-run`
  - test `.new` existant preserve
  - `git diff --check`

### 2026-06-28 — Audit read-only opencode-config

- Audit complet read-only du repo :
  - scripts d'installation/synchronisation
  - standards et agents
  - templates projet
  - documentation utilisateur
  - exemples
  - config installee dans `~/.config/opencode`
- Verifications :
  - `bash -n scripts/install.sh`
  - `bash -n scripts/init-project.sh`
  - `bash -n scripts/sync-project.sh`
- Findings principaux :
  - `install.sh` ne nettoie pas les anciens fichiers installes ; `~/.config/opencode/standards/memory.md` est encore present
  - `sync-project.sh` peut ecraser un `.new` existant
  - `templates/AGENTS.md` injecte Angular 20 dans tous les projets
  - README : hierarchie de priorite contradictoire avec la regle locale
  - exemples non synchronises avec les templates actuels
  - contradictions/typos dans standards et docs

### 2026-06-28

- Analyse comparative du dossier `plugins` de `ai-driven-dev/framework` branche `next`
- Integration adaptee des recommandations pertinentes :
  - `standards/audit.md`
  - `standards/artifact-authoring.md`
  - review adversarial en axes code/fonctionnel/pertinence
  - lifecycle `PLAN.md` avec `status`
  - `INDEX.md` enrichi avec capacites prouvees
- Documentation et templates synchronises
- Verifications : `bash -n` scripts + dry-runs `init-project.sh` et `sync-project.sh`

### 2026-06-09 ~12:00

- Audit Claude Code best practices : intégration de 4 nouveaux standards
  - `review-before-done.md` : examen contradictoire avant fin de tâche
  - `exploration-limits.md` : délimitation des investigations (>15 fichiers = subagent)
  - `error-correction.md` : règle du 2-strikes + reset obligatoire
  - `anti-patterns.md` : 5 patterns d'échec courants
- Workflow enrichi : ajout étape REVIEW (6 étapes)
- AGENTS.md (global + template) : 4 nouvelles obligations de comportement
- README.md mis à jour avec les 10 standards
- Mise à jour mémoire projet site-manager (media-converter migration terminée)
- Audit de cohérence complet + corrections critiques :
  - Renommer memory.md → memory-session-flow.md pour lever ambiguïté
  - Ajout règle "2 reviews successifs échoués" dans review-before-done.md
  - Clarification définition "strike" dans error-correction.md
  - Correction références croisées (templates/AGENTS.md, README, docs/customization.md)

### 2026-06-09 ~12:30

- Fix audit : corrections des incohérences identifiées lors de l'audit
  - Renommage memory.md → memory-session-flow.md
  - Mise à jour de toutes lesreferences (README, templates/AGENTS, docs/customization.md)
  - Ajout section "Si le review échoue encore" dans review-before-done.md
  - Clarification détaillée de la définition "strike" dans error-correction.md
  - Vérification finale : aucune référence restante à memory.md, cohérence confirmée

## Bloqué

## Prochaine action

- [ ] Lancer `./scripts/install.sh` sur ce Mac pour synchroniser la config active avec le repo
- [ ] Redémarrer OpenCode pour activer les nouveaux modèles et agents
- [ ] Tester : Aurora délègue un commit à Spark via `task`
- [ ] Tester : Aurora délègue une analyse d'image à Vision
- [ ] Tester : Aurora délègue une stratégie SEO à Atlas via `task`
- [ ] Tester : Aurora délègue un audit technique SEO à Crawler via `task`
- [x] Correction des 54 findings d'audit (sécurité permissions laissées en allow par choix utilisateur)
- [x] Pusher les changements sur le remote
- [x] Choisir avec l'utilisateur les ameliorations AIDD a implementer en priorite
- [x] Prioriser et corriger les findings de l'audit read-only
- [x] Audit complet read-only du repo (55 findings sur 4 zones)
