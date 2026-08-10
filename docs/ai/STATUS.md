# STATUS

## En cours

## Fait

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

- [ ] Lancer `./scripts/install.sh` sur ce Mac pour synchroniser la config active avec le repo (modèles optimisés + 7 nouveaux agents)
- [ ] Redémarrer OpenCode pour activer les nouveaux modèles et agents
- [ ] Tester : Aurora délègue un commit à Spark (Ministral-3) via `task`
- [ ] Tester : Aurora délègue une analyse d'image à Vision
- [ ] Tester : Aurora délègue une stratégie SEO à Atlas via `task`
- [ ] Tester : Aurora délègue un audit technique SEO à Crawler via `task`
- [x] Pusher les changements sur le remote
- [x] Choisir avec l'utilisateur les ameliorations AIDD a implementer en priorite
- [x] Prioriser et corriger les findings de l'audit read-only
