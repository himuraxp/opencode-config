# skills/

Skills réutilisables pour OpenCode. Chaque skill est un dossier contenant au minimum un fichier `SKILL.md` qui décrit le workflow à exécuter.

## Skills disponibles

### Git & CI

| Skill | Description |
|-------|-------------|
| `commit` | Messages de commit au format Conventional Commits + conventions Infomaniak |
| `create-mr` | Création de merge requests avec titre/description au format Infomaniak |
| `mr-review` | Review de MR GitLab avec commentaires inline (délègue à Oracle) |
| `mr-review-feedback` | Application automatique des retours de review MR |
| `pre-mr-review` | Revue de qualité pré-MR (code mort, duplications, simplifications) |
| `code-review` | Review adversariale — force à trouver de vrais problèmes |
| `deployment-changelog` | Changelog de déploiement pour les commits du jour |
| `new-worktree` | Branche + worktree en une intention (`feat podcast Gestion des...` → `feat/podcast--dynamic-form-and-config-management` + worktree prêt pour Orca), base détectée sans hardcode, jamais destructif |
| `gitlab-ci` | Interaction avec GitLab CI/CD (pipelines, jobs) via glab CLI |
| `gitlab-issues` | Gestion des issues GitLab via glab CLI |
| `gitlab-summary` | Résumé d'activité GitLab (daily standup) |
| `worktrees` | Worktrees Git comme lanes de codage isolées (protocole OMO) |

### Planification produit

| Skill | Description |
|-------|-------------|
| `gitlab-feature-planner` | Transforme un tableau d'estimation (Excel/CSV/Markdown) + maquettes Figma en proposition structurée d'issues GitLab (1 issue = 1 page/bloc fonctionnel, lignes → checklists) + suggestions de regroupement MR ; validation humaine obligatoire avant création |

### Accessibilité

| Skill | Description |
|-------|-------------|
| `accessibility` | Suite accessibilité — 17 sous-skills orchestrés via `accessibility-orchestrator` (aria, contraste, focus, clavier, formulaires, motion, structure, responsive…) |

### Documentation

| Skill | Description |
|-------|-------------|
| `readme` | Génération de README.md pour projets (approche template) |
| `translate-doc` | Traduction de documentation entre langues |
| `user-stories` | Rédaction de user stories structurées |

### Média & image

| Skill | Description |
|-------|-------------|
| `image-transparent-background` | Suppression de fond blanc via ImageMagick |
| `radio-tag-genres` | Tagging de genres musicaux pour playlists radio AutoDJ |

### Design System

| Skill | Description |
|-------|-------------|
| `figma-ds-sync` | Synchronisation du design system Figma Infomaniak vers snapshots JSON locaux (check/sync/diff/mapping) |

### Qualité & workflow de code

| Skill | Description |
|-------|-------------|
| `codemap` | Cartes de code hiérarchiques pour se repérer dans un repo inconnu (opération coûteuse, sur demande) |
| `clonedeps` | Cloner les sources des dépendances dans un workspace local pour inspecter les internals des librairies |
| `deepwork` | Workflow orchestré multi-phases avec gates de review pour chantiers larges et risqués |
| `loop-engineering` | Runtime Grill + Monitor pour boucles d'ingénierie |
| `reflect` | Analyser les sessions récentes → patterns récurrents, skills/agents/config réutilisables à proposer |
| `review-gap-analyzer` | Retours de revue (MR, bots) → amélioration des règles AGENTS.md et greps de pre-mr-review, sans faux positifs |
| `simplify` | Simplification de code pour la lisibilité, sans changement de comportement |
| `verification-planning` | Planifier la vérification (chemin de preuve projet-spécifique) avant un changement de code non trivial |

### Frameworks

| Skill | Description |
|-------|-------------|
| `laravel-cruddy-by-design` | Contrôleurs et routes Laravel strictement RESTful (max 7 méthodes, routage par ressources) |

### Collaboration IA

| Skill | Description |
|-------|-------------|
| `ai-cowork` | Co-working Aurora ↔ ChatGPT : boucle de travail autonome via MCP `browser-debug` (navigateur debug :9222) — ChatGPT briefe et valide (`VERDICT: ITERATE\|APPROVED`), Aurora travaille ; veto négocié sur règles AGENTS.md, rapport final avec lien conversation |

### Configuration

| Skill | Description |
|-------|-------------|
| `allow-command` | Pré-approuver des commandes shell dans opencode.json |
| `oh-my-opencode-slim` | Configurer et améliorer le plugin oh-my-opencode-slim (agents, modèles, presets, MCP) |
| `release-smoke-test` | Validation de release oh-my-opencode-slim |

## Structure d'un skill

```
skills/
└── my-skill/
    └── SKILL.md    # Instructions + workflow (obligatoire)
```

Le fichier `SKILL.md` contient :
- **When to use** — déclencheurs et contexte
- **Procedure** — étapes détaillées
- **Examples** — cas d'usage concrets

## Utilisation

Les skills sont invoqués via le tool `skill` avec le paramètre `name`. OpenCode charge le `SKILL.md` et injecte les instructions dans le contexte.

```typescript
// Exemple : invoquer le skill commit
skill({ name: "commit" })
```

## Ajouter un skill

1. Créer un dossier `skills/<skill-name>/`
2. Écrire un fichier `SKILL.md` avec le workflow
3. Lancer `npm run update` (ou `./scripts/install.sh`) pour déployer dans `~/.config/opencode/skills/`
4. Le skill est automatiquement disponible via `skill({ name: "<skill-name>" })`

Voir `standards/artifact-authoring.md` pour les règles de création homogène.
