# OpenCode Config

[![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/himuraxp/opencode-config/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/himuraxp/opencode-config.svg)](https://github.com/himuraxp/opencode-config/commits/main)
[![OpenCode Compatible](https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg)](https://opencode.ai)

> **La référence OpenCode pour les développeurs Angular, TypeScript et les workflows IA en production.**

Forkable. Multi-couches. Prête à l'emploi.

---

## Agent State Layer

Les agents IA perdent le contexte à chaque nouvelle session. Ce repository résout ce problème avec une couche de mémoire persistante :

| Document | Problème résolu |
|----------|---------------|
| **BUFFER.md** | Interruptions de session — snapshot de reprise |
| **INDEX.md** | Lectures inutiles — cartographie du projet en un coup d'œil |
| **WARNINGS.md** | Régressions — alertes actives avant tout changement |
| **STATUS.md** | Continuité — état d'avancement entre sessions |
| **PLAN.md** | Direction — plan technique courant |
| **DECISIONS.md** | Traçabilité — décisions structurantes justifiées |

Cycle de session (mis à jour avec l'étape REVIEW) :

```txt
EXPLORER → PLANIFIER → IMPLÉMENTER → [REVIEW] → VÉRIFIER → COMMITTER
```

Avec l'étape **REVIEW** (examen contradictoire) obligatoire avant de considérer une tâche comme terminée.

---

## Why this project?

Les agents IA (OpenCode, Cursor, Claude...) ne savent pas quel standard utiliser à moins que vous le leur disiez.

Ce repo apporte :

- **Agents spécialisés** : aurora (principal), reviewer, tester, security, architect
- **Standards de développement** : workflow, communication, vérification, escalation, commits, audit, création d'artefacts
- **Conventions Angular 20+** : standalone, signals, inject(), tests Jest
- **Review adversarial** : examen contradictoire obligatoire avant déclaration de fin de tâche
- **Audit read-only** : health-check multi-axes sans modification de code
- **Limites d'exploration** : délimitation stricte des investigations, subagents pour les recherches lourdes (> 15 fichiers)
- **Mémoire persistante pour agents IA** : 7 documents de session (PLAN, STATUS, DECISIONS, CHANGELOG, BUFFER, INDEX, WARNINGS)
- **Anti-patterns** : détection des 5 patterns d'échec courants (session fourre-tout, correction en spirale, sur-spécification, confiance sans vérification, exploration infinie)
- **Création homogène d'artefacts** : règles pour ajouter standards, agents, frameworks et templates sans doublons
- **Structure reproductible** : même comportement sur toutes les machines et tous les projets

---

## Quick Start

### 1. Installer la configuration globale

```bash
git clone https://github.com/himuraxp/opencode-config.git ~/.config/opencode-config
cd ~/.config/opencode-config
./scripts/install.sh
```

Après un renommage ou une suppression de standard, nettoyer les anciens fichiers installés :

```bash
./scripts/install.sh --prune
```

Cela installe dans `~/.config/opencode/` :

```txt
~/.config/opencode/
├── agents/        # Personnalités IA
├── standards/     # Comportements universels
└── frameworks/    # Règles par stack technique
```

### 2. Initialiser un projet

```bash
cd mon-projet
~/.config/opencode-config/scripts/init-project.sh
```

Pour prévisualiser sans rien modifier :

```bash
~/.config/opencode-config/scripts/init-project.sh --dry-run
```

Résultat :

```txt
mon-projet/
├── AGENTS.md
└── docs/
    └── ai/
        ├── PLAN.md       → plan technique courant
        ├── STATUS.md     → état d'avancement
        ├── DECISIONS.md  → décisions structurantes
        ├── CHANGELOG.md  → historique des sessions
        ├── BUFFER.md     → mémoire tampon de session
        ├── INDEX.md      → cartographie du projet
        └── WARNINGS.md   → alertes et dettes techniques
```

### 3. Synchroniser un projet existant

```bash
~/.config/opencode-config/scripts/sync-project.sh
```

Pour prévisualiser sans rien modifier :

```bash
~/.config/opencode-config/scripts/sync-project.sh --dry-run
```

Par défaut, le script n'écrase pas les fichiers existants. Il crée des fichiers `.new` si une version existe déjà. Si un `.new` existe déjà, il crée un fichier horodaté pour ne pas écraser une fusion en cours.

Opérationnel en moins de 2 minutes.

---

## Automatic Project Memory Discovery

Aurora détecte automatiquement le dossier `docs/ai/` à la racine du projet dès le début de chaque session.

### Lecture automatique au bootstrap

Si `docs/ai/` existe, Aurora charge immédiatement :

1. `STATUS.md` — état actuel, bloqueurs, prochaine étape
2. `PLAN.md` — plan technique en cours
3. `WARNINGS.md` — alertes actives et zones à risque
4. `INDEX.md` — cartographie du projet

### Lecture conditionnelle

- **BUFFER.md** : chargé uniquement en cas de reprise de session interrompue, de blocage signalé dans `STATUS.md`, ou si l'utilisateur demande explicitement de reprendre une tâche.
- **DECISIONS.md** : consulté en JIT (Just-In-Time) si une décision structurante, une contradiction ou une refonte d'architecture est détectée.
- **CHANGELOG.md** : consulté en JIT si une régression est suspectée ou si l'utilisateur demande l'historique.

### Pourquoi les fichiers `.new` ne sont pas lus

Lors d'une synchronisation (`sync-project.sh`), les fichiers existants ne sont pas écrasés. Le script génère des fichiers `.new` comme propositions de mise à jour, ou `.new.YYYYMMDD-HHMMSS` si une proposition existe déjà.
**OpenCode ne lit jamais les fichiers `.new` automatiquement.** Ils doivent être fusionnés manuellement dans les fichiers officiels.

### Existing Project Adoption Checklist

Pour adopter la mémoire projet sur un projet existant possédant déjà `docs/ai/` :

1. Lancer `init-project.sh` dans le projet existant.
2. Vérifier les fichiers créés dans `docs/ai/`.
3. Comparer les éventuels fichiers `.new` générés.
4. Fusionner manuellement les sections utiles.
5. Supprimer les `.new` une fois traités.
6. Lancer OpenCode avec Aurora.
7. Vérifier qu'Aurora annonce la mémoire projet détectée.

---

## Architecture

```txt
Global Configuration
        ↓
     Standards    (workflow, memory, memory-auto-update, memory-checklist, verification, communication, escalation, commits, review-before-done, audit, exploration-limits, error-correction, anti-patterns, artifact-authoring)
        ↓
      Agents       (aurora, reviewer, tester, security, architect)
        ↓
    Frameworks     (angular-20, nodejs, nestjs, astro...)
        ↓
 Project AGENTS.md (source de vérité locale)
        ↓
   Project Docs    (PLAN, STATUS, DECISIONS, CHANGELOG, BUFFER, INDEX, WARNINGS)
```

**Standards** : comportements universels applicables à tout projet.
**Agents** : personnalités spécialisées pour des tâches spécifiques.
**Frameworks** : règles techniques par stack (Angular, Node.js, NestJS, Astro).
**Project AGENTS.md** : source de vérité ultime, le local l'emporte toujours.
**Project Docs** : mémoire persistante de session entre les conversations IA.

---

## Que va-t-il m'apporter ?

| Bénéfice | Description |
|----------|-------------|
| **Cohérence** | Même comportement des agents sur toutes les machines |
| **Gain de temps** | Initialisation d'un projet en 3 secondes |
| **Qualité** | Standards Angular 20+ intégrés + review adversarial + audit read-only + limite d'exploration |
| **Traçabilité** | Chaque agent documente son plan, ses décisions et son avancement |
| **Sécurité** | Checklist sécurité automatique à chaque review |
| **Mémoire de session** | BUFFER, INDEX et WARNINGS pour les projets longs et complexes |
| **Travailler en équipe** | Workflow universel : Explorer → Planifier → Implémenter → Review → Vérifier → Committer |

---

## Comment l'utiliser ?

Après installation, l'agent Aurora (principal) charge automatiquement :

```txt
1. Standards globaux (workflow, communication, verification...)
2. Framework ciblé (Angular 20+, Node.js, etc.)
3. Standards entreprise (si configurés)
4. Standards projet (AGENTS.md local + docs/ai/)
```

La règle d'or : **le local l'emporte toujours**. `AGENTS.md` à la racine du projet est la source de vérité ultime.

---

## Comment personnaliser ?

### Personnaliser les agents

Modifiez les fichiers dans le repo cloné, puis relancez `./scripts/install.sh`.

Les agents disponibles sont dans `agents/` :

| Agent | Rôle |
|-------|------|
| `aurora.md` | Agent principal — chargement et coordination |
| `reviewer.md` | Code review stricte |
| `tester.md` | Tests qualité |
| `security.md` | Risques sécurité |
| `architect.md` | Découpage technique |

### Ajouter un framework

Créez un fichier `frameworks/<mon-framework>.md` dans le repo :

```txt
frameworks/
├── angular-20.md   # Angular 20+ stand-alone
├── nodejs.md       # API Node.js / Express
├── nestjs.md       # Architecture modulaire NestJS
└── astro.md        # Sites statiques Astro, SEO, i18n
```

Le nom du fichier sera le nom du framework. Relancez `./scripts/install.sh` pour le déployer.

### Créer une nouvelle règle

1. Dans le repo `~/.config/opencode-config`
2. Créez un fichier dans `standards/` (universel) ou `agents/` (rôle spécialisé)
3. Relancez `./scripts/install.sh`
4. Référencez-le dans le `AGENTS.md` du projet concerné

### Personnaliser le workflow de session

Modifiez `standards/workflow.md` et `standards/memory-session-flow.md` pour adapter le cycle de travail et la gestion de la mémoire de session.

### Adapter la stack d'un projet

Le template `AGENTS.md` est volontairement générique. Ajoutez dans le `AGENTS.md` local les conventions de stack utiles, ou référencez un framework global :

- `frameworks/angular-20.md`
- `frameworks/nodejs.md`
- `frameworks/nestjs.md`
- `frameworks/astro.md`

---

## Structure du repo

```txt
opencode-config/
│
├── README.md
├── LICENSE
├── CHANGELOG.md
│
├── standards/               Comportements universels
│   ├── workflow.md            Cycle Explorer→Planifier→Implémenter→Review→Vérifier→Committer
│   ├── error-correction.md    Arrêt après 2 échecs pour éviter la spirale
│   ├── anti-patterns.md       Stopper les 5 patterns de session types
│   ├── artifact-authoring.md  Créer standards/agents/frameworks sans doublons
│   ├── audit.md               Audit read-only multi-axes
│   ├── review-before-done.md  Examen contradictoire avant déclaration de fin
│   ├── exploration-limits.md  Exploration ciblée et subagents
│   ├── memory-session-flow.md     Ordre de lecture automatique des docs/ai/ en début de session
│   ├── memory-checklist.md        Checklist mémoire en fin de session
│   ├── memory-auto-update.md      Standard de persistance mémoire
│   ├── verification.md            Vérifications build/lint/test obligatoires
│   ├── communication.md           Directivité, ownership, pushback
│   ├── escalation.md              Gestion des blocages
│   └── commits.md                 Format et règles de commit
│
├── agents/                    Personnalités spécialisées
│   ├── aurora.md              Agent principal et coordinateur
│   ├── reviewer.md            Code review stricte
│   ├── tester.md              Tests Jest + Angular
│   ├── security.md            Risques et remédiations
│   └── architect.md           Découpage technique
│
├── frameworks/                Règles par stack technique
│   ├── angular-20.md          Conventions Angular 20+ stand-alone
│   ├── nodejs.md              Conventions Node.js API
│   ├── nestjs.md              Conventions NestJS
│   └── astro.md               Conventions Astro
│
├── templates/                 Ce que chaque projet reçoit
│   ├── AGENTS.md              Template racine pour chaque projet
│   ├── PLAN.md                Plan technique courant
│   ├── STATUS.md              État d'avancement
│   ├── DECISIONS.md           Décisions structurantes
│   ├── CHANGELOG.md           Journal des agents
│   └── project-docs/
│       ├── BUFFER.md          Mémoire tampon de session
│       ├── INDEX.md           Cartographie du projet
│       └── WARNINGS.md        Alertes et dettes techniques
│
├── examples/                  Exemples prêts à l'emploi
│   ├── angular-app/           Projet Angular 20+ complet
│   ├── node-api/              Projet API Node.js
│   └── monorepo/              Monorepo exemple
│
├── scripts/                   Automatisation
│   ├── install.sh             Installer la config globale
│   ├── init-project.sh         Initialiser un nouveau projet
│   └── sync-project.sh         Synchroniser les templates
│
└── docs/                      Guides utilisateur
    ├── workflow.md            Comment fonctionne le cycle de travail
    ├── customization.md        Comment personnaliser et étendre
    ├── angular-20.md          Règles Angular 20+ détaillées
    ├── code-review.md         Guide de revue de code
    ├── testing.md             Guide de tests
    └── architecture.md        Guide architectural
```

---

## Principe de priorité

L'agent reçoit et applique dans cet ordre (le dernier l'emporte) :

1. Bonnes pratiques générales.
2. **Agents** globaux `~/.config/opencode/agents/` (aurora, reviewer, tester, security, architect).
3. **Frameworks** globaux `~/.config/opencode/frameworks/` (angular-20, nodejs, nestjs...).
4. **Standards** globaux `~/.config/opencode/standards/` (workflow, memory, memory-auto-update, memory-checklist, verification, communication, escalation, commits, review-before-done, audit, exploration-limits, error-correction, anti-patterns, artifact-authoring).
5. Agents spécialisés enregistrés dans la session.
6. **`AGENTS.md`** local du projet.
7. Instructions explicites de la tâche en cours.

---

## Licence

MIT
