# opencode-config

> **La référence OpenCode pour les développeurs Angular, TypeScript et les workflows IA en production.**

Forkable. Multi-couches. Prête à l'emploi.

---

## Je suis développeur — Pourquoi ce repo ?

Les agents IA (OpenCode, Cursor, Claude...) ne savent pas quel standard utiliser à moins que vous le leur disiez.

Ce repo fournit :

- **Standards universels** : workflow, communication, vérification, escalation, commits
- **Agents spécialisés** : aurora (principal), reviewer, tester, security, architect
- **Frameworks** : Angular 20+, Node.js, NestJS, Astro (extensible)
- **Templates de projet** : AGENTS.md, plans, décisions, changelog
- **Scripts d'installation** : synchronisez les règles sur toutes les machines
- **Un modèle multi-couches** : global → organisation → projet

## Que va-t-il m'apporter ?

| Bénéfice | Description |
|----------|-------------|
| **Cohérence** | Même comportement des agents sur toutes les machines |
| **Gain de temps** | Initialisation d'un projet en 3 secondes |
| **Qualité** | Standards Angular 20+ intégrés dès le départ |
| **Traçabilité** | Chaque agent documente son plan, ses décisions et son avancement |
| **Sécurité** | Checklist sécurité automatique à chaque review |
| **Mémoire de session** | BUFFER, INDEX et WARNINGS pour les projets longs et complexes |
| **Travailler en équipe** | Workflow universel : Explorer → Planifier → Implémenter → Vérifier → Committer |


## Installation rapide

### 1. Installation globale (une seule fois par machine)

```bash
git clone <ce-repo> ~/.config/opencode-config
cd ~/.config/opencode-config
./scripts/install.sh
```

Cela installe dans `~/.config/opencode/` :

```txt
~/.config/opencode/
├── agents/        # Personnalités IA (aurora, reviewer, tester, security...)
├── standards/     # Comportements universels (workflow, communication, verification...)
└── frameworks/    # Règles de framework (angular-20, nodejs, nestjs...)
```

### 2. Initialiser un projet

Depuis la racine du projet :

```bash
~/.config/opencode-config/scripts/init-project.sh
```

Cela ajoute :

```txt
AGENTS.md
└── docs/
    └── ai/
        ├── PLAN.md        → plan technique courant
        ├── STATUS.md      → état d'avancement
        ├── DECISIONS.md   → décisions structurantes
        ├── CHANGELOG.md   → historique des sessions IA
        ├── BUFFER.md      → mémoire tampon de session
        ├── INDEX.md       → cartographie du projet
        └── WARNINGS.md    → alertes et dettes techniques

```

### 3. Synchroniser un projet existant

```bash
~/.config/opencode-config/scripts/sync-project.sh
```

Par défaut, le script n'écrase pas les fichiers existants. Il crée des fichiers `.new` si une version existe déjà.

## Comment l'utiliser ?

Après installation, l'agent Aurora (principal) charge automatiquement :

```txt
1. Standards globaux (workflow, communication, verification...)
2. Framework ciblé (Angular 20 +, Node.js, etc.)
3. Standards entreprise (si configurés)
4. Standards projet (AGENTS.md local + docs/ai/)
```

La règle d'or : **le local l'emporte toujours**. `AGENTS.md` à la racine du projet est la source de vérité ultime.

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
├── angular-20.md   # Existant
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

Modifiez `standards/workflow.md` et `standards/memory.md` pour adapter le cycle de travail et la gestion de la mémoire de session.

## Structure du repo

```txt
opencode-config/
│
├── README.md
├── LICENSE
├── CHANGELOG.md
│
├── standards/               Comportements universels
│   ├── workflow.md            Cycle Explorer→Planifier→Implémenter→Vérifier→Committer
│   ├── memory.md              Gestion de la session IA
│   ├── verification.md        Vérifications build/lint/test obligatoires
│   ├── communication.md       Directivité, ownership, pushback
│   ├── escalation.md         Gestion des blocages
│   └── commits.md            Format et règles de commit
│
├── agents/                    Personnalités spécialisées
│   ├── aurora.md              Agent principal et coordinateur
│   ├── reviewer.md            Code review stricte
│   ├── tester.md              Tests Jest + Angular
│   ├── security.md            Risques et remédiations
│   └── architect.md           Découpage technique
│
├── frameworks/                Règles par stack technique
│   ├── angular-20.md          Conventions Angular 20 stand-alone
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
    ├── angular-20.md          Règles Angular 20 détaillées
    ├── code-review.md         Guide de revue de code
    ├── testing.md             Guide de tests
    └── architecture.md        Guide architectural
```

## Principe de priorité

L'agent reçoit et applique dans cet ordre (le dernier l'emporte) :

1. Instructions explicites de la tâche en cours.
2. **`AGENTS.md`** local du projet.
3. Agents `.opencode/agents/` du projet.
4. **Standards** globaux `~/.config/opencode/standards/`.
5. **Frameworks** globaux `~/.config/opencode/frameworks/`.
6. **Agents** globaux `~/.config/opencode/agents/`.
7. Bonnes pratiques générales.

## Licence

MIT
