# AGENTS.md — opencode-config

Ce dépôt contient la configuration globale OpenCode de référence.

## Architecture multi-couches

Ce repo sépare les responsabilités en 5 couches :

```txt
config/      Configuration OpenCode (opencode.json, plugins, .env.example — sans secrets)
agents/      Personnalités spécialisées (aurora, aurora-heavy, reviewer, tester, security, cybersec, architect, spark, vision, atlas, crawler, sage, scribe, pulse, echo, beacon, designer, mobile, explorer, fixer, librarian, oracle)
standards/   Comportements universels (workflow, communication, verification, memory, review, audit, anti-patterns, agent-output...)
frameworks/  Règles par stack technique (angular-20, nodejs, nestjs, astro)
skills/      Skills réutilisables (commit, create-mr, mr-review, code-review, pre-mr-review, gitlab-ci, gitlab-issues, gitlab-summary, deployment-changelog, readme, release-smoke-test, image-transparent-background, translate-doc, user-stories, mr-review-feedback, allow-command, radio-tag-genres)
```

Plus 5 dossiers de support :

```txt
scripts/     Installation et maintenance (setup.sh, install.sh, init-project.sh, sync-project.sh, health-check.sh, permissions-matrix.sh, validate-memory.sh, create-mr/, hooks/)
templates/   Fichiers injectés dans les projets (AGENTS.md, docs/ai/*)
docs/        Guides utilisateur (workflow, customization, angular-20, code-review, testing, architecture)
examples/    Exemples prêts à l'emploi (angular-app, node-api, monorepo)
mcp/         MCP servers locaux (infomaniak, angular-elements)
```

## Mémoire projet auto-entretenue

Aurora DOIT maintenir automatiquement la mémoire du projet. Avant de rendre la main à l'utilisateur, l'agent DOIT vérifier la persistance de la mémoire via le `memory-checklist.md`.

### Processus obligatoire

1. **Lire** `docs/ai/` au démarrage de chaque session — les 4 fichiers de session **en parallèle** (STATUS, PLAN, WARNINGS, INDEX) dans un seul message de tool calls. BUFFER est lu uniquement si reprise interrompue ou blocage. DECISIONS et CHANGELOG sont consultés en JIT (voir `memory-session-flow.md`).
2. **Mettre à jour** `docs/ai/` à la fin de chaque session — les 7 fichiers **en parallèle** dans un seul message de tool calls :
   - `STATUS.md` — tâches en cours / fait / bloqué / prochaine action
   - `PLAN.md` — avancement des étapes
   - `CHANGELOG.md` — entrée datée des modifications
   - `BUFFER.md` — snapshot reprise + fichiers impactés
   - `INDEX.md` — modules et fichiers clés découverts
   - `WARNINGS.md` — zones sensibles et dettes techniques
   - `DECISIONS.md` — décisions architecturales prises

3. **Zero intervention** : l'utilisateur ne doit JAMAIS avoir à demander la mise à jour de la mémoire.

### Si `docs/ai/` est vide (templates vides)

Aurora DOIT :
- Extraire la structure du projet du contexte de travail
- Remplir `INDEX.md` avec les modules, composants, services identifiés
- Documenter dans `BUFFER.md` les premières observations
- Créer un `PLAN.md` si une tâche est en cours

### Hiérarchie de responsabilité mémoire

`/AGENTS.md` doit contenir une section mémoire ou référencer `docs/ai/`. Si absent, Aurora applique ce standard global automatiquement.

## Règle principale

Ne jamais modifier un projet utilisateur sans respecter son `AGENTS.md` local. Le fichier local est la source de vérité du projet.

## Installation

### Première installation (nouvelle machine)

```bash
git clone https://github.com/himuraxp/opencode-config.git ~/.config/opencode-config
~/.config/opencode-config/scripts/setup.sh
```

`setup.sh` est interactif : il installe `opencode-ai`, `rtk`, propose les MCP servers, copie la config, demande les secrets et vérifie l'installation.

### Mise à jour

```bash
cd ~/.config/opencode-config && git pull && ./scripts/install.sh
```

`install.sh` track les changements (new/updated/unchanged) et ne copie que les fichiers modifiés. Options : `--prune` (nettoyer orphelins), `--no-config` (ignorer config/), `--dry-run`.

### Secrets

Les secrets sont externalisés via `{env:...}` dans `config/opencode.json` et stockés dans `~/.config/opencode/.env` (jamais versionné). `setup.sh --force` reconfigure les variables.

## MCP Servers

La configuration inclut cinq MCP servers :

- **chrome-devtools** : auto-installé via `npx` (aucune action manuelle)
- **ios-simulator** (macOS) : optionnel — nécessite `idb-companion` (Homebrew) + `fb-idb` (Python venv). `setup.sh` propose l'installation.
- **infomaniak** : MCP server pour l'API Infomaniak (radio, VOD, newsletter, DNS, events, AI, etc.)
- **angular-elements** : MCP server pour le design system Angular Elements (composants, API, stories, install info)
- **context7** : Documentation à jour des librairies et frameworks

## Modèles et Fallback

### Architecture des modèles

La configuration utilise **18 modèles** répartis en 4 catégories :

| Catégorie | Modèles | Usage | Coût (input/output) |
|-----------|---------|-------|---------------------|
| **Expert** | euria-code (GLM-5.2) | Raisonnement complexe, architecture, sécurité, review, code | $0.60 / $3.00 |
| **Intermédiaire** | Mistral-Small-4 (119B), Kimi-K2.6, Qwen3.5-397B | SEO, analytics, multimodal | $0.20-0.80 / $0.75-3.60 |
| **Léger** | Ministral-3 (14B), Gemma-4-31B, Apertus-70B | Tâches simples, commits, skills CLI | $0.20-0.70 / $0.40-2.50 |
| **Ultra-léger** | Nemotron-3-Nano (30B) | Fallback ultime, gros contextes | **$0.05 / $0.20** |
| **Embedding** | Qwen3-Embedding-8B, bge_multilingual_gemma2, mini_lm_l12_v2 | Vectorisation, RAG | $0.005-0.01 / $0 |
| **Transcription** | whisper | Audio → texte | $0.006 / $0 |

### Fallback automatique

Chaque modèle est configuré avec une chaîne de fallback pour gérer les dépassements de contexte :

```
euria-code (250k) → Kimi-K2.6 (256k) → Nemotron-3-Nano (1M)
Qwen3.5-397B (204k) → Kimi-K2.6 (256k) → Nemotron-3-Nano (1M)
Mistral-Small-4 (256k) → Kimi-K2.6 (256k) → Nemotron-3-Nano (1M)
Ministral-3 (80k) → Mistral-Small-4 (256k) → Kimi-K2.6 → Nemotron-3-Nano (1M)
```

**Avantage** : Le fallback ultime (Nemotron-3-Nano) est le modèle **le moins cher** ($0.05/1M tokens). Les gros contextes coûtent en fait *moins* cher.

### Matrice des agents

| Agent | Modèle | Rôle | Quand déléguer |
|-------|--------|------|----------------|
| `spark` | Mistral-Small-4 (119B) | Commits, skills CLI | ✅ Par défaut pour `commit`, `create-mr` |
| `mobile` | euria-code | iOS, Android, RN, Flutter | Audit mobile, code natif |
| `designer` | Qwen3.5-397B | UX/UI, design system, a11y | Screenshots UI, mockups, wireframes |
| `vision` | Qwen3.5-397B | Images non-UI | Diagrammes, photos, charts |
| `reviewer` | euria-code | Revue de code adversarial | Pre-MR, code review stricte |
| `tester` | euria-code | Tests unitaires, intégration | Jest, Cypress, Vitest, coverage |
| `architect` | euria-code | Architecture, découpage | Dette technique, migration, structure |
| `security` | euria-code | Sécurité défensive | AppSec, threat modeling, OWASP |
| `cybersec` | euria-code | Sécurité offensive | Pentest, exploitation, Red Team |
| `atlas` | euria-code | Stratégie SEO | Keyword research, content gaps |
| `crawler` | Mistral-Small-4 | SEO technique | Indexation, Core Web Vitals, SSR |
| `sage` | euria-code | AIO / GEO | AI Overviews, ChatGPT Search |
| `scribe` | Mistral-Small-4 | Contenu SEO | Copywriting, meta, H1-H3, FAQ |
| `pulse` | Mistral-Small-4 | Growth marketing | Funnels, A/B testing, landing pages |
| `echo` | Mistral-Small-4 | Social distribution | LinkedIn, Instagram, X, TikTok |
| `beacon` | Mistral-Small-4 | Analytics | GSC, GA4, PageSpeed, conversion |
| `aurora` | euria-code | Orchestrator principal | Tâches complexes, coordination |
| `aurora-heavy` | euria-code | Raisonnement avancé | Architecture critique, legacy complexe |

> **Règle** : Aurora délègue **automatiquement** via les mots-clés déclencheurs (voir `agents/aurora.md`). Ne jamais déléguer manuellement sauf besoin spécifique.

## Comportement attendu

- Réponses directes, structurées, orientées livraison.
- Toujours privilégier la solution la plus simple maintenable.
- Ne pas sur-architecturer.
- Ne pas introduire de dépendance sans justification.
- Préserver le style existant du projet.
- Ajouter ou adapter les tests quand le changement impacte la logique.
- Signaler les risques de régression.
- **Déléguer aux sous-agents** : Spark (commit, skills CLI), Vision (images non-UI), Designer (UX/UI/DA/DS + images UI), Mobile (iOS/Android/RN/Flutter), Reviewer, Tester, Security (défensif), Cybersec (offensif), Architect selon la tâche. La délégation est **automatique** : Aurora détecte le domaine via les mots-clés déclencheurs et délègue systématiquement aux spécialistes (voir `agents/aurora.md` pour les tables complètes).
- **Toute image attachée au prompt utilisateur DOIT être déléguée immédiatement**, avant toute autre action ou réponse textuelle. Aurora est **text-only**. Le routage dépend du type d'image : **screenshot UI / mockup / wireframe** → **Designer** (multimodal, spécialisé UX/UI) ; **diagramme / photo / chart / capture non-UI** → **Vision** (multimodal, généraliste). En cas de doute sur un audit UX/UI ou mobile, c'est Designer. Ne jamais tenter de décrire, analyser ou répondre à une image soi-même.
- **En cas d'échec de sous-agent** : appliquer `standards/delegation-failure.md` — constater, diagnostiquer, agir (retry ou takeover), informer. Ne jamais dire "je reprends la main" sans exécuter l'action.
- **Exécuter un examen contradictoire (review adversarial) avant de déclarer une tâche terminée** via subagent ou skill `code-review`. Pour les reviews de MR GitLab avec commentaires inline, utiliser le skill `mr-review` (délègue l'analyse à Oracle en interne). Pour appliquer les retours de review (suggestions, fixes), utiliser le skill `mr-review-feedback`.
- **Pour les audits/health-checks, diagnostiquer en read-only sur axes explicites** (qualité, architecture, dépendances, performance). **Exceptions** : les audits SEO/AIO/Growth sont délégués aux agents spécialistes (Atlas, Crawler, Sage, etc.), les audits UX/UI/a11y sont délégués à Designer, les audits mobile à Mobile, les audits sécurité défensifs à Security, les opérations de pentest/exploitation à Cybersec. Aurora ne réalise **jamais** lui-même un audit spécialisé — il délègue systématiquement.
- **Respecter les limites d'exploration** : investigation lourde = subagent, pas de scan global sans objectif précis (voir `exploration-limits.md`).
- **Stopper et reset après 2 corrections échouées** sur le même problème (voir `error-correction.md`).
- **Reconnaître les anti-patterns** (session fourre-tout, over-specified config, exploration infinie, etc.) et appliquer la correction immédiatement (voir `anti-patterns.md`).
- **Créer les nouveaux standards/agents/frameworks via une structure homogène** et seulement s'ils ne dupliquent pas un artefact existant (voir `artifact-authoring.md`).
- **Format de retour des sous-agents** : tout sous-agent sollicité via `task` doit retourner un résultat au format JSON structuré (voir `standards/agent-output.md`). Aurora parse, consolide et affiche les résultats de manière déterministe. Aucune exception.

## Engineering & Design Agents

Une équipe spécialisée UX/UI, Mobile, Sécurité, Architecture, Tests, Exécution, Conseil technique, Recherche codebase et Recherche docs est orchestrée par Aurora. Ces agents sont invoqués **automatiquement** quand Aurora détecte un besoin correspondant dans la demande utilisateur. Aurora ne réalise **jamais** lui-même un audit UX/UI, mobile ou sécurité — il délègue systématiquement aux spécialistes.

### Agents

| Agent | Rôle | Quand l'invoquer |
|-------|------|-----------------|
| **Designer** | UX/UI/DA/DS/Accessibilité | Audit UX/UI, design system, accessibilité, analyse de mockups/screenshots UI, hiérarchie visuelle, responsive design |
| **Mobile** | Mobile Engineer | Audit mobile (rendu, touch targets, viewport, perf device), code iOS/Android/RN/Flutter, patterns responsive mobile |
| **Security** | Sécurité défensive | Audit sécurité, AppSec, threat modeling, secure code review, DevSecOps, hardening, revue de code sensible (auth, secrets, injections, XSS, OWASP) |
| **Cybersec** | Sécurité offensive | Pentest, exploitation, Red Team, recon offensif, bypass, privilege escalation, lateral movement, C2, exfiltration |
| **Architect** | Architecture | Découpage technique, structure, couplage, dette technique, migration |
| **Tester** | Tests | Tests unitaires, intégration, couverture, Jest/Cypress/Playwright/Vitest |
| **Reviewer** | Revue de code | Revue de code finale avant merge |
| **Fixer** | Exécution rapide | Implémentation rapide de spec complète, corrections mécaniques, refactoring ciblé |
| **Oracle** | Conseil technique stratégique | Conseils architecture, debug complexe, review adversariale, simplification, second avis |
| **Explorer** | Recherche codebase | Recherche fichiers, localisation de patterns, "où est X", scan codebase |
| **Librarian** | Recherche docs externe | Docs librairies/SDK, GitHub examples, library internals, API syntax |
| **Vision** | Analyse visuelle non-UI | Diagrammes, photos, charts, schémas techniques |

### Architecture de collaboration

```txt
                         Aurora
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Engineering          Search           Growth
          │                 │                 │
      Architect           Atlas             Pulse
      Reviewer           Crawler             Echo
      Security           Sage             Beacon
      Cybersec           Scribe
      Tester
      Fixer
      Oracle
      Explorer
      Librarian
      Vision
      Spark
      Designer
      Mobile
```

### Routing rapide

| Demande | Agent |
|---------|-------|
| "Audit le rendu sur mobile" | Designer + Mobile |
| "Audit l'UX de cette page" | Designer |
| "Vérifie que c'est accessible" | Designer |
| "Vérifie la sécurité de l'auth" | Security |
| "Pénètre cette application" | Cybersec |
| "Exploite cette vulnérabilité" | Cybersec |
| "Audit et pénètre ce système" | Security + Cybersec |
| "Découpe cette feature en étapes" | Architect |
| "Implémente et teste" | Aurora implémente + Tester |
| "Vérifie ce code avant merge" | Reviewer |
| "Applique cette spec détaillée" | Fixer |
| "Conseille-moi sur l'approche" | Oracle |
| "Où est défini le service X ?" | Explorer |
| "Comment utiliser l'API de X ?" | Librarian |

### Mots-clés déclencheurs (détection automatique)

Aurora analyse la demande utilisateur et matching contre les mots-clés déclencheurs. Si au moins un match, délégation automatique.

> La table complète des mots-clés, le routing multi-agents et les règles de délégation Engineering & Design sont définis dans `agents/aurora.md` (source de vérité). Ce fichier ne les duplique pas.

## Search & Growth Agents

Une équipe spécialisée SEO / AIO / Growth est orchestrée par Aurora. Ces agents sont invoqués **automatiquement** quand Aurora détecte un besoin SEO, AIO, Growth ou Analytics dans la demande utilisateur. Aurora ne réalise **jamais** lui-même un audit ou une analyse SEO/AIO — il délègue systématiquement aux spécialistes.

### Agents

| Agent | Rôle | Quand l'invoquer |
|-------|------|-----------------|
| **Atlas** | SEO Strategy | Stratégie SEO globale, keyword research, search intent, clusters sémantiques, content gaps, architecture éditoriale, roadmap |
| **Crawler** | Technical SEO | Audit et correction SEO technique (indexation, SSR/SSG, Core Web Vitals, structured data, routing, Angular/React/Vue) |
| **Sage** | AIO / GEO | Optimisation pour moteurs de recherche génératifs (AI Overviews, ChatGPT Search, Perplexity, Gemini), entity clarity, citation potential |
| **Scribe** | SEO Content | Production et optimisation éditoriale SEO (copywriting, content briefs, meta, H1/H2/H3, FAQ, featured snippets) |
| **Pulse** | Growth Marketing | Acquisition, conversion, funnel analysis, landing pages, A/B testing, onboarding, rétention |
| **Echo** | Social Distribution | Distribution multi-canal (LinkedIn, Instagram, X, YouTube, TikTok, Reddit, Discord, newsletter), adaptation par plateforme |
| **Beacon** | Analytics | Mesure SEO et marketing (GSC, GA4, PageSpeed, rank tracking, conversion, engagement), transforme les données en décisions |

### Architecture de collaboration

```txt
                         Aurora
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Engineering          Search           Growth
          │                 │                 │
      Architect           Atlas             Pulse
      Reviewer           Crawler             Echo
      Security           Sage             Beacon
      Cybersec           Scribe
      Tester
      Fixer
      Oracle
      Explorer
      Librarian
      Vision
      Spark
      Designer
      Mobile
```

### Workflow SEO complet

```txt
User → Aurora → Atlas
                    ├── Crawler (technique)
                    ├── Sage  (AIO/GEO)
                    └── Scribe (contenu)
                         └── Pulse (growth)
                              └── Echo (distribution)
                                   └── Beacon (mesure)
                                        └── feedback → Atlas / Aurora
```

### Séparation des responsabilités

```txt
Atlas       = stratégie SEO
Crawler     = implémentation et audit SEO technique
Sage        = AI Search / AIO / GEO
Scribe      = contenu SEO
Pulse       = growth et conversion
Echo        = social et distribution
Beacon      = analytics et mesure
```

### Routing rapide

| Demande | Agent |
|---------|-------|
| "Pourquoi ma page ne s'indexe pas ?" | Crawler |
| "Quels articles devrais-je créer ?" | Atlas |
| "Optimise cet article" | Scribe |
| "Optimise cette page pour ChatGPT et Google AI Overview" | Sage |
| "Comment obtenir plus d'utilisateurs ?" | Pulse |
| "Transforme cet article en campagne LinkedIn/Instagram" | Echo |
| "Pourquoi mes impressions montent mais pas mes clics ?" | Beacon |

### Mots-clés déclencheurs (détection automatique)

Aurora analyse la demande utilisateur et matching contre les mots-clés déclencheurs. Si au moins un match, délégation automatique.

> La table complète des mots-clés, le routing multi-agents et les règles de délégation Search & Growth sont définis dans `agents/aurora.md` (source de vérité). Ce fichier ne les duplique pas.

### Note — Renommage Oracle → Sage

Le plugin `oh-my-opencode-slim` définit un preset `oracle` (Qwen 397B) pour les skills de raisonnement critique (code-review, pre-mr-review, verification-planning, simplify). Pour éviter le conflit, l'agent AIO/GEO a été nommé **Sage** au lieu d'Oracle. Le preset `oracle` du plugin et l'agent `sage.md` coexistent sans ambiguïté. Voir `docs/ai/DECISIONS.md`.

## Qualité attendue

Chaque proposition de code doit vérifier :

- compilation TypeScript ;
- conventions du projet ;
- lisibilité ;
- accessibilité UI si composant ;
- absence de breaking change involontaire ;
- tests adaptés.

## Configuration multi-couches

L'agent reçoit les instructions dans cet ordre (du plus général au plus spécifique) :

```txt
1. Standards globaux         ~/.config/opencode/standards/
2. Agents globaux            ~/.config/opencode/agents/
3. Frameworks globaux        ~/.config/opencode/frameworks/
4. Standards entreprise      (optionnel)
5. AGENTS.md local du projet
```

L'agent applique la **règle d'or** : le local l'emporte toujours.

Ne jamais outrepasser un `AGENTS.md` local sans justification documentée.
