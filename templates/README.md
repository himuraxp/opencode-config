# templates/

Templates injectés dans les projets via `scripts/init-project.sh` et `scripts/sync-project.sh`. Ces fichiers sont copiés à la racine du projet cible pour initialiser ou mettre à jour la configuration OpenCode.

## Fichiers

| Template | Destination | Description |
|----------|-------------|-------------|
| `AGENTS.md` | `<project>/AGENTS.md` | Configuration principale du projet — règles, architecture, mémoire |
| `STATUS.md` | `<project>/docs/ai/STATUS.md` | État courant — tâches en cours / fait / bloqué / prochaine action |
| `PLAN.md` | `<project>/docs/ai/PLAN.md` | Avancement des étapes |
| `CHANGELOG.md` | `<project>/docs/ai/CHANGELOG.md` | Entrées datées des modifications |
| `DECISIONS.md` | `<project>/docs/ai/DECISIONS.md` | Décisions architecturales prises |

## Sous-dossiers

| Dossier | Description |
|---------|-------------|
| `project-docs/` | Templates pour la mémoire projet (voir `project-docs/README.md`) |

## Workflow

### Initialisation (nouveau projet)

```bash
cd /path/to/project
npm run init-project --prefix ~/.config/opencode-config
# ou: ~/.config/opencode-config/scripts/init-project.sh
```

Copie les templates manquants, détecte la stack, ajoute le framework. Ne remplace jamais les fichiers existants.

### Synchronisation (mise à jour)

```bash
cd /path/to/project
npm run sync --prefix ~/.config/opencode-config
# ou: ~/.config/opencode-config/scripts/sync-project.sh
```

Compare les templates avec les fichiers existants. En cas de différence, crée un fichier `.new` à côté de l'original pour review manuelle.

## Structure générée

```
project/
├── AGENTS.md              # Règles du projet
└── docs/ai/
    ├── STATUS.md          # État courant
    ├── PLAN.md            # Plan d'avancement
    ├── CHANGELOG.md       # Historique des modifications
    ├── DECISIONS.md       # Décisions architecturales
    ├── BUFFER.md          # Snapshot de reprise (project-docs/)
    ├── INDEX.md           # Modules et fichiers clés (project-docs/)
    └── WARNINGS.md        # Zones sensibles (project-docs/)
```

## Délégation des templates

La mémoire projet (`docs/ai/`) est auto-entretenue par Aurora selon `standards/memory-session-flow.md` et `standards/memory-auto-update.md`. Les templates servent de point de départ — le contenu est ensuite maintenu dynamiquement.
