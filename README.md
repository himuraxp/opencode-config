# opencode-config

> **La référence OpenCode pour les développeurs Angular 20 / TypeScript**

Forkable. Multi-couches. Prête à l'emploi.

---

## Pourquoi ce repo ?

Les agents IA (OpenCode, Cursor, Claude...) ne savent pas quel standard utiliser à moins que vous le leur disiez.

Ce repo fournit :

- **Agents spécialisés** (Angular 20 +, architecture, review, tests, sécurité)
- **Templates de projet** (AGENTS.md, plans, décisions, changelog)
- **Scripts d'installation** pour synchroniser ces règles sur toutes les machines et tous les projets
- **Un modèle multi-couches** : global → organisation → projet

## Que va-t-il m'apporter ?

| Bénéfice | Description |
|----------|-------------|
| **Cohérence** | Même comportement des agents sur toutes les machines |
| **Gain de temps** | Initialisation d'un projet en 3 secondes |
| **Qualité** | Standards Angular 20 + intégrés dès le départ |
| **Traçabilité** | Chaque agent documente son plan, ses décisions et son avancement |
| **Sécurité** | Checklist sécurité automatique à chaque review |

## Installation

### 1. Installation globale (une seule fois par machine)

```bash
git clone <ce-repo> ~/.config/opencode-config
cd ~/.config/opencode-config
./scripts/install.sh
```

Cela installe les agents globaux dans `~/.config/opencode/agents/`.

### 2. Initialiser un projet

Depuis la racine du projet :

```bash
~/.config/opencode-config/scripts/init-project.sh
```

Cela ajoute :

```txt
AGENTS.md
├── .opencode/
│   ├── agents/
│   └── rules/
└── docs/
    └── ai/
        ├── PLAN.md
        ├── STATUS.md
        ├── DECISIONS.md
        └── CHANGELOG.md
```

### 3. Synchroniser un projet existant

```bash
~/.config/opencode-config/scripts/sync-project.sh
```

Par défaut, le script n'écrase pas les fichiers existants. Il crée des fichiers `.new` si une version existe déjà.

## Structure multi-couches

OpenCode permet de charger des instructions et des agents depuis plusieurs niveaux :

```txt
Niveau global          ~/.config/opencode/
                       ├── agents/
                       ├── prompts/
                       └── standards/

Niveau organisation    (optionnel)
                       ├── agents/
                       └── rules/

Niveau projet          ./
                       ├── AGENTS.md
                       ├── .opencode/
                       │   ├── agents/
                       │   └── rules/
                       └── docs/ai/
```

L'agent reçoit alors :

```txt
1. Standards globaux
2. Standards Angular 20 +
3. Standards entreprise (si configurés)
4. Standards projet (AGENTS.md local)
```

La règle d'or : **le local l'emporte toujours**. `AGENTS.md` à la racine du projet est la source de vérité ultime.

## Structure du repo

```txt
opencode-config/
│
├── README.md
├── LICENSE
├── CHANGELOG.md
│
├── agents/
│   ├── angular-20.md              Conventions Angular 20 stand-alone
│   ├── architect.md               Découpage technique et décisions
│   ├── reviewer.md                Code review stricte
│   ├── tester.md                  Tests Jest + Angular
│   └── security.md                Risques et remédiations
│
├── templates/
│   ├── AGENTS.md                  Template racine pour chaque projet
│   ├── PLAN.md                    Plan technique courant
│   ├── STATUS.md                  État d'avancement
│   ├── DECISIONS.md               Décisions structurantes
│   └── CHANGELOG.md               Journal des agents
│
├── examples/
│   ├── angular-app/               Exemple Angular 20 complet
│   ├── node-api/                  Exemple API Node.js (placeholder)
│   └── monorepo/                  Exemple monorepo (placeholder)
│
├── scripts/
│   ├── install.sh                 Installer les agents globaux
│   ├── init-project.sh            Initialiser un nouveau projet
│   └── sync-project.sh            Synchroniser les templates
│
└── docs/
    ├── angular-20.md              Guide Angular 20
    ├── code-review.md             Guide de revue de code
    ├── testing.md                 Guide de tests
    └── architecture.md            Guide architecturale
```

## Principe de priorité

1. Instructions explicites de la tâche en cours.
2. **`AGENTS.md`** local du projet.
3. Agents `.opencode/agents/` du projet.
4. Agents globaux `~/.config/opencode/agents/`.
5. Bonnes pratiques générales.

## Licence

MIT
