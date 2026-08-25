# templates/project-docs/

Templates pour la mémoire projet auto-entretenue. Ces fichiers sont copiés dans `<project>/docs/ai/` par `scripts/init-project.sh` et ensuite maintenus dynamiquement par Aurora.

## Templates

| Template | Destination | Description |
|----------|-------------|-------------|
| `BUFFER.md` | `<project>/docs/ai/BUFFER.md` | Snapshot de reprise — contexte pour reprendre une session interrompue |
| `INDEX.md` | `<project>/docs/ai/INDEX.md` | Modules, composants et fichiers clés découverts dans le projet |
| `WARNINGS.md` | `<project>/docs/ai/WARNINGS.md` | Zones sensibles, dettes techniques, avertissements actifs |

## Cycle de vie

1. **Initialisation** — `init-project.sh` copie les templates si manquants
2. **Session** — Aurora lit les 4 fichiers de session (STATUS, PLAN, WARNINGS, INDEX) au démarrage
3. **Fin de session** — Aurora met à jour les 7 fichiers en parallèle (STATUS, PLAN, CHANGELOG, BUFFER, INDEX, WARNINGS, DECISIONS)
4. **Validation** — `validate-memory.sh` vérifie la cohérence

## Fichiers de session (non templates)

Les fichiers suivants sont créés par `templates/` directement (niveau supérieur) :

- `STATUS.md` — État courant
- `PLAN.md` — Plan d'avancement
- `CHANGELOG.md` — Historique
- `DECISIONS.md` — Décisions architecturales

## BUFFER.md — Snapshot de reprise

Contient le contexte nécessaire pour reprendre une session interrompue :
- Tâche en cours
- Fichiers impactés
- Dernière action
- Prochaine étape

Lu uniquement si : session précédente interrompue, `STATUS.md` indique un blocage, ou l'utilisateur demande explicitement de reprendre.

## INDEX.md — Cartographie du projet

Liste les modules, composants, services et fichiers clés découverts. Sert de table des matières pour le projet.

## WARNINGS.md — Zones sensibles

Documente les dettes techniques, avertissements et zones à risque. Si un warning critique actif concerne la zone de travail, Aurora bloque les modifications jusqu'à résolution.

## Validation

```bash
# Vérifier qu'un projet a une mémoire bien formée
~/.config/opencode-config/scripts/validate-memory.sh /path/to/project
```
