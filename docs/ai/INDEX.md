# INDEX

## Structure generale

```txt
racine/
├── standards/   comportements universels Aurora/OpenCode
├── agents/      agents specialises
├── frameworks/  regles par stack technique
├── templates/   fichiers injectes dans les projets
├── scripts/     installation, initialisation et synchronisation projet
├── docs/        documentation utilisateur
└── examples/    exemples d'integration
```

## Modules principaux

| Module | Chemin | Responsabilite |
|--------|--------|----------------|
| Standards | `standards/` | Workflow, verification, communication, memoire, review, audit, creation d'artefacts, limites d'exploration |
| Agents | `agents/` | Roles Aurora, reviewer, tester, security, architect |
| Frameworks | `frameworks/` | Conventions Angular, Node.js, NestJS, Astro |
| Templates | `templates/` | AGENTS.md et documents `docs/ai/` pour projets utilisateurs |
| Scripts | `scripts/` | Installation globale et bootstrap/sync de projets |

## Fichiers cles

| Fichier | Role |
|---------|------|
| `AGENTS.md` | Instructions racine du repo |
| `README.md` | Documentation principale |
| `standards/workflow.md` | Cycle Explorer -> Planifier -> Implementer -> Review -> Verifier -> Committer |
| `standards/memory-checklist.md` | Checklist obligatoire de persistance memoire |
| `standards/review-before-done.md` | Review adversarial avant fin de tache |
| `standards/audit.md` | Audit read-only multi-axes |
| `standards/artifact-authoring.md` | Creation homogene de standards, agents, frameworks et templates |
| `scripts/init-project.sh` | Initialisation d'un projet avec AGENTS.md et docs/ai |
| `scripts/sync-project.sh` | Synchronisation non destructive des templates |

## Points d'entree applicatifs

- `scripts/install.sh`
- `scripts/init-project.sh`
- `scripts/sync-project.sh`

## Conventions locales importantes

- Le `AGENTS.md` local du projet utilisateur l'emporte toujours.
- La memoire projet attendue vit dans `docs/ai/`.
- Les changements doivent rester simples, maintenables, et compatibles avec OpenCode.

## Commandes de recherche utiles

```bash
rg --files standards agents frameworks templates scripts docs
rg "docs/ai|memory|REVIEW|review" .
```
