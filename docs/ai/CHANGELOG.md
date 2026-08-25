# CHANGELOG

## 2026-08-25 — READMEs MCP + corrections cohérence

### Contexte

Création d'un README pour le MCP angular-elements, puis analyse complète du projet pour identifier tous les répertoires manquant un README. 12 READMEs créés, puis corrections de cohérence (agents, skills, MCP servers, env vars).

### Changements

- **`mcp/angular-elements/README.md`** créé — architecture, 7 tools, config, dev, caching
- **12 READMEs créés** :
  - `agents/README.md` — 18 agents, rôles, modèles, architecture de collaboration, délégation
  - `standards/README.md` — 16 standards par catégorie, ordre d'application
  - `skills/README.md` — 17 skills par catégorie, structure, ajout
  - `scripts/README.md` — 8 scripts, usage, dépendances, ui.sh
  - `config/README.md` — opencode.json, .env, variables, sécurité
  - `mcp/README.md` — 5 MCP servers (2 locaux + 3 npx), config, dev, ajout
  - `frameworks/README.md` — 4 frameworks, détection auto, application
  - `templates/README.md` — 5 templates, workflow init/sync, structure générée
  - `docs/README.md` — 6 guides, navigation, relation avec standards
  - `scripts/hooks/README.md` — pre-commit-secrets, patterns, installation
  - `templates/project-docs/README.md` — BUFFER/INDEX/WARNINGS, cycle de vie
  - `config/plugins/README.md` — rtk.ts, API Plugin, ajout
- **`config/.env.example`** — `GITLAB_TOKEN` ajouté (requis par MCP angular-elements)
- **`README.md`** root — MCP servers (5 au lieu de 2), env vars (+INFOMANIAK_API_TOKEN, +GITLAB_TOKEN), structure repo (+mcp/), skills (17 au lieu de 15 avec allow-command + radio-tag-genres)
- **`AGENTS.md`** root — agents (18 avec cybersec, explorer, fixer, librarian, oracle), skills (17), +dossier mcp/ dans les dossiers de support (5 au lieu de 4)
- **`docs/customization.md`** — cybersec ajouté à la table agents (17 → 18)
- **`docs/ai/INDEX.md`** — 18 agents (cybersec ajouté), mcp/ dans la structure

### Corrections de cohérence identifiées

| # | Fichier | Avant | Après |
|---|---------|-------|-------|
| 1 | README.md | 2 MCP servers | 5 MCP servers |
| 2 | README.md | 5 env vars | 7 env vars |
| 3 | README.md | pas de mcp/ dans structure | mcp/ ajouté |
| 4 | README.md | 15 skills listés | 17 skills listés |
| 5 | AGENTS.md | 17 agents listés | 18 agents listés |
| 6 | AGENTS.md | 15 skills listés | 17 skills listés |
| 7 | AGENTS.md | 4 dossiers de support | 5 dossiers (+mcp/) |
| 8 | customization.md | 17 agents (cybersec absent) | 18 agents |
| 9 | INDEX.md | 17 agents | 18 agents |
| 10 | INDEX.md | mcp/ absent de la structure | mcp/ ajouté |
| 11 | .env.example | GITLAB_TOKEN absent | GITLAB_TOKEN ajouté |

### Permissions bash aurora (allow-command)

- `config/opencode.json` — 5 patterns ajoutés à l'agent aurora : `cut *`, `exit *`, `git config *`, `git describe *`, `git remote *`

## 2026-08-21 — Scripts d'installation animés (Aurora UI)

### Contexte

Les scripts `setup.sh` et `install.sh` étaient fonctionnels mais visuellement plats — juste des `echo` avec des couleurs basiques. L'utilisateur voulait donner du style tout en restant en mode console pur, avec "Aurora" comme logo principal et "(OpenCode Config)" comme sous-titre.

### Changements

- **`scripts/ui.sh`** créé — bibliothèque d'animations console partagée :
  - Logo ASCII art "Aurora" (6 lignes, style block, turquoise bright)
  - Sous-titre "(OpenCode Config)" centré, dim gray
  - Fade-in animé du logo (6 frames, gradient dim → full color)
  - Sections avec box-drawing Unicode (╭─╮ │ ╰─╯), titre centré gold
  - Messages : ui_info (ℹ cyan), ui_ok (✓ green), ui_warn (⚠ yellow), ui_fail (✗ red)
  - Spinner braille (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏) avec ui_run pour exécuter des commandes
  - Progress bar (█░) avec pourcentage et label
  - Typewriter effect (caractère par caractère, vitesse configurable)
  - Détection TTY automatique (couleurs et animations désactivées si non-interactif)
  - `--no-animation` flag pour CI/SSH
  - trap EXIT pour cleanup des spinners orphelins
  - Backward-compatible : aliases info/ok/warn/fail pour les scripts existants
- **`scripts/setup.sh`** refactorisé :
  - Source `ui.sh` au lieu des couleurs basiques
  - Logo Aurora + sous-titre au démarrage
  - Toutes les sections utilisent `ui_section` (System Check, External Dependencies, MCP Servers, etc.)
  - Flag `--no-animation` ajouté
  - Résumé final avec typewriter "Aurora is ready to deploy."
- **`scripts/install.sh`** refactorisé :
  - Source `ui.sh`
  - Logo Aurora + sous-titre (sauf en --dry-run)
  - Sections par catégorie (Agents, Standards, Frameworks, Skills, Scripts, Configuration)
  - Progress bar globale pendant la copie de fichiers (pre-count des fichiers)
  - Flag `--no-animation` ajouté
  - Résumé final avec typewriter "Aurora is ready."

### Décisions

- Logo variante A (block/impactant) choisie par défaut — turquoise bright (256 color code 51)
- Logo final : police `roman` de figlet (7 lignes, 61 chars, style serif élégant)
- Palette 256 ANSI pour un rendu riche sans dépendance externe
- Box-drawing Unicode pour un rendu moderne (compatible terminaux modernes)
- Spinner braille pour un rendu léger et performant
- Désactivation automatique si non-TTY (CI, SSH, pipes)
- `--no-animation` flag explicite pour forcer la désactivation

### Vérifications

- `bash -n` sur les 3 fichiers : OK
- `install.sh --dry-run --no-animation` : OK (sections affichées, logo skippé)
- `install.sh --dry-run` : OK (logo + sections + listing fichiers)
- `install.sh --no-animation --no-config` : OK (exécution réelle, 1 new = ui.sh, 70 unchanged)
- `setup.sh --help` : OK (affiche --force et --no-animation)
- Test logo seul : OK (6 lignes + sous-titre centré)
- Test sections : OK (box-drawing correct)
- Test spinner : OK (fallback non-TTY + animation TTY)
- Test progress bar : OK (remplissage progressif)
- Test typewriter : OK (caractère par caractère)
- Designer consulté pour la direction visuelle (agent-output.v1, 7 findings)

## 2026-08-12 — Création agents designer + mobile (17 agents)

### Contexte

Le repo couvrait 15 agents mais n'avait pas de spécialiste design (UX/UI/DA/DS/accessibilité) ni de spécialiste mobile (iOS/Android/RN/Flutter). Aurora ne pouvait pas déléguer ces tâches à un agent dédié.

### Changements

- **`agents/designer.md`** créé : UX, UI, direction artistique, design system, accessibilité (WCAG 2.1 AA), analyse de mockups/screenshots. Modèle Mistral-Small-4 (multimodal). Permissions : edit:allow, bash:deny, webfetch:allow.
- **`agents/mobile.md`** créé : iOS (Swift/SwiftUI), Android (Kotlin/Compose), React Native, Flutter. Performance device, offline-first, accessibilité native. Modèle euria-code. Permissions : edit:allow, bash:deny, webfetch:allow.
- **`config/oh-my-opencode-slim.json`** : 2 agents déclarés (designer, mobile) — total 9 agents dans le preset.
- **`agents/aurora.md`** : règles de délégation ajoutées (Designer pour UX/UI/DS/a11y, Mobile pour code mobile).
- **`AGENTS.md`** : section délégation mise à jour (designer, mobile ajoutés).
- **`README.md`** : 4 références mises à jour (15→17 agents).
- **`docs/customization.md`** : table des agents mise à jour.
- **`scripts/setup.sh`** : vérification 17 agents (15+2).
- **`docs/ai/INDEX.md`** : 17 agents, table complète mise à jour.

### Impact

- Aurora peut désormais déléguer les tâches de design et mobile à des spécialistes dédiés.
- Les 2 nouveaux agents retournent un JSON au format agent-output.v1 comme tous les autres.
- `health-check.sh` validera automatiquement les nouveaux agents.

## 2026-08-11 — Standard agent-output.md (format de retour JSON des sous-agents)

### Contexte

Les sous-agents retournaient du texte libre, rendant la consolidation multi-agents manuelle et non déterministe. Aucun système de format structuré (JSON-LD, JSON schema) n'existait pour les retours de sous-agents vers Aurora.

### Changements

- **Nouveau standard** `standards/agent-output.md` :
  - Schéma JSON v1 complet (agent, task, status, summary, findings[], metrics[], conflicts[], gaps[], next_steps[], metadata)
  - 12 catégories normalisées pour les findings
  - 5 niveaux de sévérité
  - Format de transmission (bloc JSON en fin de message)
  - Règles de remplissage (obligatoire vs optionnel)
  - Procédure de consolidation multi-agents pour Aurora (parse, détection conflits, fusion, rapport unifié)
  - Mapping de compatibilité avec les formats existants de chaque agent
  - Exceptions Spark et Vision (texte libre)
- **11 agents mis à jour** avec section "Format de retour JSON" : atlas, crawler, sage, scribe, pulse, echo, beacon, reviewer, security, architect, tester
- **Spark et Vision** : initialement exemptés, l'exception a été retirée — ces 2 agents retournent aussi le format JSON (JSON minimal pour Spark, findings visuels pour Vision). Total : 13 agents.
- **`agents/aurora.md`** : 2 références au standard ajoutées (règles de délégation + liste standards obligatoires)
- **`AGENTS.md`** : référence dans "Comportement attendu" + liste standards

### Vérifications

- Schéma JSON valide (structure cohérente)
- Mapping des champs existants vérifié pour chaque agent
- Pas de contradiction avec les standards existants
- Spark et Vision inclus (pas d'exception)

## 2026-08-10 — Fix auth Infomaniak + displayName plugin compat

### Contexte

Deux bugs causaient des échecs au démarrage : (1) collision entre `OPENAI_API_KEY` (globale, autre fournisseur) et la clé Infomaniak, (2) `displayName` avec espaces/tirets cadratins incompatibles avec la regex `^[a-z][a-z0-9_-]*$` du plugin oh-my-opencode-slim.

### Changements

- `config/opencode.json` : `OPENAI_API_KEY` → `OPENAI_API_KEY_INFOMANIAK` dans le header Authorization
- `config/.env.example` : variable renommée + commentaire expliquant la séparation
- `scripts/setup.sh` : `env_is_complete` check, prompt, write .env migrés vers `OPENAI_API_KEY_INFOMANIAK` + logique de migration automatique de l'ancienne variable (idempotente, secret masqué) + cleanup de l'ancienne ligne
- `config/oh-my-opencode-slim.json` : 7 displayName normalisés en kebab-case lowercase
- `README.md` : table des variables d'environnement mise à jour

### Vérifications

- `jq` valide sur `opencode.json` et `oh-my-opencode-slim.json`
- `bash -n scripts/setup.sh` OK
- 7 displayName respectent `^[a-z][a-z0-9_-]*$`
- Migration testée en temporaire (first-run + idempotency)
- Review contradictoire via subagent Reviewer — APPROVED (2 suggestions LOW appliquées)

## 2026-08-10 — Correction des 54 findings d'audit

### Contexte

Correction des 54 findings de l'audit complet read-only (sur 55 — la sécurité des permissions opencode.json a été laissée en `allow` par choix utilisateur pour garder Aurora autonome).

### Changements

- `agents/aurora.md` : angular-20 corrigé comme framework (H4), section "Standards obligatoires" ajoutée (M12), référence workflow.md et memory en fin de cycle (M17), hiérarchie d'autorité corrigée (B10), clarification Oracle preset (M6)
- `docs/customization.md` : 15 agents (table) + 15 standards listés (H9, H10)
- `README.md` : ordre de priorité corrigé Standards → Agents → Frameworks (H11), section "Comment l'utiliser" alignée
- `CHANGELOG.md` racine : 6 entrées ajoutées (M21)
- `docs/workflow.md` : "Mise à jour en fin de session" complétée — 7 étapes (M22)
- `standards/memory-checklist.md` : titre `Standard — Memory Checklist` (H6), critère docs/ai/ absent clarifié (M13), chemin templates précisé (B14)
- `standards/memory-auto-update.md` : titre corrigé (H7), "Anti-patterns" (M18)
- `standards/memory-session-flow.md` : titre corrigé, section fin de session → référence memory-auto-update.md (H8), règle langue → référence communication.md (M15), condition docs/ai/ absent clarifiée (M13)
- `standards/artifact-authoring.md` : template mis à jour — guides flexibles reflétant la pratique (C1, H12)
- `agents/vision.md` : permission ajoutée edit/bash/webfetch deny (M10)
- `agents/architect.md`, `reviewer.md`, `tester.md`, `security.md` : permissions ajoutées (B7), reviewer titre corrigé (B5)
- `agents/aurora-heavy.md` : accents corrigés (M7, B9), `refactore` → `refactoré`
- `agents/spark.md` : accents corrigés (B9)
- `scripts/setup.sh` : liste agents vérifiés étendue à 15 (M3)
- `standards/review-before-done.md` : stack-agnostic (M14), "Anti-patterns" (M18)
- `standards/verification.md` : section Langue supprimée — déjà dans communication.md (M15)
- `standards/delegation-failure.md` : typo "délèue" → "délègue" (B13)
- `standards/workflow.md` : étape 5 simplifiée → référence verification.md (M16), étape 6 ajoute référence memory-auto-update.md (M17)
- `standards/error-correction.md`, `exploration-limits.md` : "Anti-patterns" (M18)
- `.gitignore` : patterns corrigés (B1)
- `config/package.json` : `~1.4.7` (B2)
- `docs/testing.md` : renommé "Angular Testing" (B18)
- `docs/angular-20.md` : note vers framework détaillé (B16)
- `frameworks/nestjs.md` : note héritage nodejs.md (B11)
- `frameworks/nodejs.md`, `astro.md` : checklists référence verification.md (B12)
- `examples/angular-app/AGENTS.md` : section "Rôle" ajoutée (M19), exception SEO/AIO (M20), delegation-failure ajouté
- `templates/AGENTS.md` : delegation-failure ajouté à la liste standards
- `AGENTS.md` : tables routing SEO remplacées par référence aurora.md (M9)

### Vérification

- Review contradictoire via subagent Reviewer (4 gaps trouvés et corrigés)
- bash -n scripts OK, JSON valide, frontmatter YAML 15 agents valides
- Pas de références cassées, pas de "Anti-patterns interdits" restant

## 2026-08-10 — Audit complet read-only du repo

### Contexte

Audit read-only du repo complet sur 4 zones (Scripts & Config, Agents, Standards & Frameworks, Templates & Docs & Examples). 4 subagents Reviewer lancés en parallèle, puis consolidation.

### Résultats

- **Verdict** : À corriger
- **55 findings** : 1 critique, 12 hautes, 22 moyennes, 20 basses
- **Sécurité** (6 findings) : `curl`, `kill`, `find`, `sed` en `allow` dans `opencode.json` — risque d'exfiltration, kill process, suppression fichiers. `git push *: allow` sur Spark (agent léger sans confirmation)
- **Cohérence** (14 findings) : template `artifact-authoring.md` ignoré par tous les standards/frameworks, 3 fichiers mémoire se chevauchent, titres incohérents, `aurora-heavy.md` sans accents
- **Références** (5 findings) : `aurora.md` délègue à `angular-20` comme agent (c'est un framework), standards non référencés depuis aurora.md
- **Doublons** (7 findings) : tables routing SEO dupliquées aurora.md ↔ AGENTS.md, bloc `## Boundaries` dupliqué 7 fois, gestion langue dans 3 standards
- **Permissions** (3 findings) : Vision sans section permission, agents Engineering sans permission explicite
- **Docs** (6 findings) : `docs/customization.md` (5 agents sur 15, 10 standards sur 15), README contradiction ordre priorité, CHANGELOG racine (1 entrée), `docs/testing.md` Angular-spécifique
- **Sync** (4 findings) : `examples/angular-app/AGENTS.md` en retard vs template (section "Rôle" + exception SEO/AIO absentes)
- **Rapport** livré à l'utilisateur en format `standards/audit.md`

### Vérifications recommandées

- Confirmer précédence patterns bash (curl, find -exec, sed -i) dans OpenCode runtime
- Valider schémas JSON (`ajv`)
- Confirmer qu'Angular-20 n'est pas un agent (`ls ~/.config/opencode/agents/angular-20.md`)
- Vérifier permissions par défaut de Vision en runtime

## 2026-08-10 — Correction du routing Search & Growth (automatique + multi-agents)

### Contexte

Le prompt "Tu peux vérifier qu'on est bon niveau SEO & AIO ?" ne déclenchait pas la délégation aux bons agents (Atlas + Crawler + Sage). Causes : délégation "sur demande" non automatique, pas de routing multi-agents, conflit avec l'instruction audit générique, mots-clés déclencheurs absents.

### Changements

- `agents/aurora.md` : section "Délégation Search & Growth (sur demande)" → "(automatique)" avec mots-clés déclencheurs (8 domaines), routing multi-agents (10 patterns dont Audit Growth), 6 règles de délégation, exception SEO/AIO/Growth sur la ligne audit
- `AGENTS.md` : sync des mêmes tables (mots-clés, routing multi-agents, règles), suppression phrase "ne sont pas invoqués automatiquement", exception SEO/AIO/Growth dans "Comportement attendu"
- `standards/audit.md` : section "Exception — audits SEO / AIO / Growth" qui redirige vers les agents spécialistes
- `templates/AGENTS.md` : exception SEO/AIO/Growth ajoutée dans le Mode AUDIT
- Mots-clés trop larges retirés : "article", "données", "mesure", "performance", "newsletter", "calendrier éditorial social", "stratégie SEO", "performance SEO", "AIO/GEO", "optimisation contenu"
- Tables de mots-clés synchronisées entre `aurora.md` et `AGENTS.md` (identiques)
- Review contradictoire effectué via subagent Reviewer (6 findings corrigés)
- Config active `~/.config/opencode/` synchronisée

## 2026-08-10 — Équipe Search & Growth Agents

### Contexte

Extension du repository avec une équipe spécialisée SEO / AIO / Growth orchestrée par Aurora. 7 nouveaux agents pour couvrir le périmètre search & growth.

### Changements

- `agents/atlas.md` : créé — SEO Strategist (stratégie, keyword research, content gaps, roadmap). Qwen 397B, edit: deny, webfetch: allow.
- `agents/crawler.md` : créé — Technical SEO Engineer (audit et correction SEO technique, SSR/SSG, Angular/React/Vue). edit: allow, webfetch: allow. Modèle par défaut (euria-code).
- `agents/sage.md` : créé — AIO/GEO Specialist (AI Overviews, ChatGPT Search, Perplexity, Gemini). Qwen 397B, edit: ask, webfetch: allow. Renommé Sage (au lieu d'Oracle) pour éviter le conflit avec le preset `oracle` du plugin `oh-my-opencode-slim`.
- `agents/scribe.md` : créé — SEO Content Strategist (copywriting, content briefs, meta, H1/H2/H3, FAQ). edit: allow, webfetch: allow. Modèle par défaut (euria-code).
- `agents/pulse.md` : créé — Growth Marketing Strategist (acquisition, conversion, funnel, A/B testing). edit: deny, webfetch: allow. Modèle par défaut (euria-code).
- `agents/echo.md` : créé — Social & Distribution Strategist (LinkedIn, Instagram, X, YouTube, TikTok, Reddit, Discord, newsletter). Mistral-Small-4, edit: allow, webfetch: ask.
- `agents/beacon.md` : créé — Analytics & Intelligence (GSC, GA4, PageSpeed, rank tracking, conversion, engagement). edit: deny, webfetch: allow. Modèle par défaut (euria-code).
- `AGENTS.md` : section "Search & Growth Agents" ajoutée (table des 7 agents, architecture de collaboration, workflow SEO complet, séparation des responsabilités, routing rapide, note renommage Sage).
- `README.md` : table des agents (8 → 15), structure du repo, architecture, principe de priorité mis à jour.
- `agents/aurora.md` : table de délégation Search & Growth ajoutée (7 agents) + clarification preset Oracle vs agent Sage.
- `docs/ai/DECISIONS.md` : décision de renommage Oracle → Sage documentée.

### Décisions

- Renommage Oracle → Sage pour éviter le conflit avec le preset `oracle` du plugin `oh-my-opencode-slim`.
- Permissions par moindre privilège : Atlas/Pulse/Beacon en read-only (stratégie/analyse), Crawler/Scribe/Echo en edit (implémentation/contenu), Sage en edit:ask.
- Models : Qwen 397B pour Atlas et Sage (raisonnement stratégique/AIO nuancé), Mistral-Small-4 pour Echo (créativité multi-canal), euria-code par défaut pour Crawler/Scribe/Pulse/Beacon (cohérent avec les subagents existants reviewer/architect/tester/security).
- Tous les agents en `mode: subagent`, invoqués via `task` par Aurora.

### Vérification

- Review contradictoire via subagent Reviewer : frontmatter, cohérence, frontières, délégation, conflit de nom, models.
- Greppé toutes les références à "Oracle" → restantes sont des mentions explicites du preset du plugin ou des notes de renommage.

## 2026-08-06 — Délégation sous-agents Spark & Vision

### Contexte

Aurora (euria-code, text-only) ne peut pas déléguer les tâches répétitives (commit, MR) à un modèle léger, ni traiter les images. Spark existait mais en `mode: primary` (non déléguable). Vision existait déjà en `mode: all`.

### Changements

- `agents/spark.md` : `mode: primary` → `mode: all` (déléguable via `task` + sélectionnable manuellement)
- `agents/spark.md` : permissions bash complétées pour le skill `create-mr` (git push/fetch/show-ref/rev-list/rev-parse, rm ./mr-*.md) + `skill: allow`
- `agents/spark.md` : ajout section "Skills" (charge et suit commit/create-mr)
- `agents/aurora.md` : section "Chargement des agents spécialisés" → "Délégation aux sous-agens" avec tableau délégation par défaut (Spark commit/MR, Vision images) + sur demande + règles de fallback
- `agents/vision.md` : créé dans le repo source (déjà présent en config active, mode all, Mistral-Small-4)
- Synchro config active `~/.config/opencode/agents/` effectuée

### Décisions

- Spark en `mode: all` (pas `subagent`) : garde la possibilité d'utilisation manuelle dans le TUI
- Délégation Spark par défaut + fallback Aurora (si message incohérent ou MR complexe)
- Délégation Vision obligatoire pour toute image (Aurora text-only)
- `git push` en `allow` pour Spark (le sous-agent n'a pas de canal interactif pour confirmer un `ask`)

## 2026-06-28 — Correction findings audit

### Scripts

- `scripts/install.sh` : ajout `--prune`, `--dry-run`, `--help`, affichage des orphelins, suppression optionnelle des `.md` installes mais absents du repo.
- `scripts/sync-project.sh` : ajout `--help`, rejet des arguments inconnus, creation de `.new.YYYYMMDD-HHMMSS` si `.new` existe deja.

### Templates et exemples

- `templates/AGENTS.md` : template generique, sans conventions Angular injectees par defaut.
- `examples/angular-app/AGENTS.md` : workflow avec Review, standards recents, mode Audit.
- `examples/angular-app/docs/ai/PLAN.md` : frontmatter `status: pending`.
- `examples/angular-app/docs/ai/INDEX.md` : section capacites prouvees.
- `examples/node-api/README.md` et `examples/monorepo/README.md` : clarification de structure cible.

### Documentation et standards

- `README.md` : ordre de priorite corrige, documentation `install.sh --prune`, `.new` horodates, stack explicite.
- `docs/customization.md` : ajout `install.sh --prune` et comportement `.new` horodate.
- `standards/memory-session-flow.md` et `standards/memory-checklist.md` : clarification du cas `docs/ai/` absent.
- `frameworks/astro.md`, `standards/error-correction.md`, `standards/escalation.md`, `docs/workflow.md` : corrections de typos/formulations.

### Verification

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`
- `scripts/install.sh --dry-run --prune`
- `scripts/install.sh --prune`
- `init-project.sh --dry-run`
- `sync-project.sh --dry-run`
- test temporaire `.new` existant preserve et proposition horodatee creee
- `git diff --check`

## 2026-06-28 — Audit read-only opencode-config

### Perimetre

- Scripts : `install.sh`, `init-project.sh`, `sync-project.sh`
- Standards, agents, frameworks, templates, docs et exemples
- Etat installe dans `~/.config/opencode`

### Findings

- `install.sh` copie les fichiers mais ne supprime pas les artefacts obsoletes ; `~/.config/opencode/standards/memory.md` reste installe.
- `sync-project.sh` ecrit `dest.new` sans proteger un `.new` deja present.
- `templates/AGENTS.md` contient des conventions Angular 20 injectees dans tous les projets.
- README : la section priorite dit "le dernier l'emporte" mais place `AGENTS.md` local avant les standards globaux.
- `standards/memory-checklist.md` demande de creer `docs/ai/` si absent, tandis que `memory-session-flow.md` dit qu'aucune action n'est requise.
- `examples/angular-app` et ses `docs/ai` ne sont pas synchronises avec les templates actuels.
- `frameworks/astro.md` contient plusieurs fautes et formulations degradant la qualite du standard.

### Verification

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`

## 2026-06-28 — Analyse inspirations AIDD plugins

### Contexte

- Inspection du repo externe `ai-driven-dev/framework`, branche `next`, dossier `plugins`.
- Comparaison avec l'architecture locale `standards/`, `agents/`, `frameworks/`, `templates/`, `docs/ai/`.

### Observations

- AIDD apporte une taxonomie utile : `context`, `dev`, `refine`, `pm`, `vcs`, `orchestrator`.
- Les apports les plus pertinents pour OpenCode sont conceptuels : lifecycle de plan, review en axes, audit read-only, memoire par capacites detectees, generation encadree de rules/agents/skills.
- Les mecanismes Claude-specifiques (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre importes tels quels.

### Memoire

- Ajout des fichiers manquants dans `docs/ai/` : `PLAN.md`, `INDEX.md`, `WARNINGS.md`, `DECISIONS.md`.

## 2026-06-28 — Integration recommandations AIDD adaptees OpenCode

### Standards

- `standards/audit.md` : nouveau standard d'audit read-only multi-axes.
- `standards/artifact-authoring.md` : nouveau standard pour creer standards, agents, frameworks et templates sans doublons.
- `standards/review-before-done.md` : review structuree en axes code, fonctionnel, pertinence.
- `standards/workflow.md` : lifecycle explicite de `PLAN.md` et mode audit read-only.
- `standards/memory-auto-update.md` et `standards/memory-session-flow.md` : statut de plan et capacites prouvees.

### Agents, templates, docs

- `agents/aurora.md` : cycle avec Review et audit read-only.
- `agents/reviewer.md` : checklist alignee sur les trois axes.
- `templates/PLAN.md` : frontmatter `status: pending`.
- `templates/project-docs/INDEX.md` : section capacites prouvees.
- `templates/AGENTS.md`, `README.md`, `docs/workflow.md`, `docs/code-review.md`, `docs/customization.md` : documentation synchronisee.

### Verification

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`
- `scripts/init-project.sh --dry-run` depuis `/private/tmp`
- `scripts/sync-project.sh --dry-run` depuis `/private/tmp`

## 2026-06-09 ~12:00 — Intégration Claude Code Best Practices

### Standards créés

- `standards/review-before-done.md` (67→75 lignes)
  - Examen contradictoire obligatoire avant fin de tâche
  - Méthodes : skill `code-review` ou subagent `reviewer`
  - Traitement du retour avec max 1 itération
  - Section "Si le review échoue encore" ajoutée (2 reviews successifs échoués)
  
- `standards/exploration-limits.md` (66 lignes)
  - Limite de profondeur : <5 fichiers, 5-15 fichiers (plan court), >15 fichiers (subagent)
  - Subagent obligatoire pour investigation lourde
  - Objectif précis + portée + résultat attendu
  - Limite tokens : >100 lignes sans réponse → stopper
  - Pas de lecture globale inutile (fnide | xargs cat interdit)

- `standards/error-correction.md` (74 lignes)
  - Règle du 2-strikes
  - Définition clarifiée de "strike" (types spécifiques + contre-exemples)
  - Action de reset : constater, réinitialiser, réécrire l'invite
  - Cas spécifiques : correction sans cause profonde, supprimer un test, modifier un fichier >3 fois
  - Contrôles de cohérence systématiques

- `standards/anti-patterns.md` (68 lignes)
  - 5 patterns d'échec à reconnaître et corriger immédiatement
  - Session fourre-tout, correction en spirale, config sur-spécifiée
  - Écart confiance-puis-vérification, exploration infinie
  - Règle générale : stopper immédiatement, même si perte de travail récent

### Fichiers mis à jour

- `standards/workflow.md` : ajout étape REVIEW (6 étapes au lieu de 5)
- `AGENTS.md` (global) : 4 nouvelles obligations de comportement
- `templates/AGENTS.md` : même obligations + liste 9 standards
- `README.md` : cycle avec REVIEW, 10 standards documentés, architecture à jour

### Claud Code Best Practices couverts

| Claude Code BP | Couverture |
|---------------|------------|
| Examen contradictoire | ✅ review-before-done.md + workflow.md REVIEW |
| Gestion agressive du contexte | ✅ error-correction.md (2-strikes) |
| Délimiter l'exploration | ✅ exploration-limits.md |
| Reconnaître anti-patterns | ✅ anti-patterns.md |
| Éviter correction en boucle | ✅ error-correction.md + workflow.md |

### Non couvert (dépend OpenCode)

- `/clear`, `/compact`, `/rewind`
- Mode auto
- Mode headless (-p)
- Sessions parallèles
- AskUserQuestion

## 2026-06-09 ~12:30 — Fix audit post-intégration

### Corrections

- Renommer `memory.md` → `memory-session-flow.md` pour lever ambiguïté avec `memory-auto-update.md`
- Mise à jour de toutes les références :
  - `README.md` : 3 références corrigées
  - `templates/AGENTS.md` : référence double remplacée par description claire des 3 memory-standards
  - `docs/customization.md` : 4 références corrigées + ajout memory-auto-update et memory-checklist
  - `standards/review-before-done.md` : ajout section "Si le review échoue encore"
  - `standards/error-correction.md` : définition de "strike" clarifiée avec types spécifiques et contre-exemples

### Vérification

- Aucune référence restante à `memory.md` (grep vérifié)
- Fichier `memory-session-flow.md` confirmé présent (3.5K)
- Fichier `memory.md` confirmé supprimé
- Cohérence globale : 8.5/10 → visé 9.5/10

## Historique antérieur

Voir commits précédents pour :
- Intégration mémoire auto-entretenue (2026-06-08)
- Découverte docs/ai/ automatique (2026-06-08)
- Scripts init-project.sh et sync-project.sh (2026-06-08)
