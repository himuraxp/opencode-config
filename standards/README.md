# standards/

Comportements universels appliqués systématiquement par Aurora et tous les sous-agents. Ces standards définissent le cycle de travail, les règles de communication, la vérification, la mémoire et la gestion des erreurs.

## Standards

### Cycle de travail

| Standard | Description |
|----------|-------------|
| `workflow.md` | Cycle complet : Explorer → Planifier → Implémenter → Parallel Gate (Review + Vérifier) → Committer |
| `verification.md` | Vérifications build/lint/test obligatoires avant validation |
| `review-before-done.md` | Examen contradictoire (adversarial) avant de déclarer une tâche terminée |

### Communication & style

| Standard | Description |
|----------|-------------|
| `communication.md` | Style de réponse — direct, synthétique, structuré, orienté action |

### Mémoire projet

| Standard | Description |
|----------|-------------|
| `memory-session-flow.md` | Lecture mémoire en début de session (STATUS → PLAN → WARNINGS → INDEX) |
| `memory-auto-update.md` | Persistance mémoire en fin de session (7 fichiers en parallèle) |
| `memory-checklist.md` | Checklist de fin de session — vérifier que la mémoire est persistée |

### Qualité & erreurs

| Standard | Description |
|----------|-------------|
| `error-correction.md` | Règle des 2 corrections échouées — stopper et reset après 2 échecs |
| `anti-patterns.md` | Détection des patterns d'échec (session fourre-tout, exploration infinie...) |
| `escalation.md` | Gestion des blocages — quand et comment escalader |
| `delegation-failure.md` | Procédure après échec de sous-agent — constater, diagnostiquer, agir |

### Audit & exploration

| Standard | Description |
|----------|-------------|
| `audit.md` | Audit read-only multi-axes (qualité, architecture, dépendances, performance) |
| `exploration-limits.md` | Délimitation des investigations — pas de scan global sans objectif précis |

### Artefacts & format

| Standard | Description |
|----------|-------------|
| `artifact-authoring.md` | Création homogène de nouveaux standards/agents/frameworks |
| `agent-output.md` | Format de retour JSON structuré pour les sous-agents |
| `commits.md` | Format et règles de commit (Conventional Commits + conventions Infomaniak) |

## Ordre d'application

Les standards sont appliqués par ordre décroissant de spécificité :

```
Standards globaux → Agents globaux → Frameworks globaux → AGENTS.md projet → docs/ai/
```

Le `AGENTS.md` local du projet est la source de vérité — le local l'emporte toujours.
