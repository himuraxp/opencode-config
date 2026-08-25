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
| `gitlab-ci` | Interaction avec GitLab CI/CD (pipelines, jobs) via glab CLI |
| `gitlab-issues` | Gestion des issues GitLab via glab CLI |
| `gitlab-summary` | Résumé d'activité GitLab (daily standup) |

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

### Configuration

| Skill | Description |
|-------|-------------|
| `allow-command` | Pré-approuver des commandes shell dans opencode.json |
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
3. Lancer `scripts/install.sh` pour déployer dans `~/.config/opencode/skills/`
4. Le skill est automatiquement disponible via `skill({ name: "<skill-name>" })`

Voir `standards/artifact-authoring.md` pour les règles de création homogène.
