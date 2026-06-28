# Standard — Création d'Artefacts IA

## Principe

Les standards, agents et frameworks doivent être créés de manière homogène. Un nouvel artefact n'est justifié que s'il réduit une ambiguïté récurrente, formalise une pratique utile ou couvre une stack réellement utilisée.

## Types d'artefacts

| Type | Dossier | Rôle |
|------|---------|------|
| Standard | `standards/` | Comportement universel, indépendant d'une stack |
| Agent | `agents/` | Rôle spécialisé, personnalité ou responsabilité précise |
| Framework | `frameworks/` | Conventions techniques propres à une stack |
| Template projet | `templates/` | Fichier injecté dans les projets utilisateurs |
| Documentation | `docs/` | Explication utilisateur, exemples, adoption |

## Critères avant création

Créer un nouvel artefact seulement si :

- la règle sera réutilisée dans plusieurs projets ou sessions ;
- elle ne duplique pas un standard existant ;
- elle peut être testée ou vérifiée par un comportement observable ;
- elle reste courte et actionnable.

Sinon, enrichir un fichier existant.

## Structure recommandée

### Standard

```md
# Standard — Nom

## Principe
## Quand l'appliquer
## Procédure
## Format attendu
## Anti-patterns interdits
```

### Agent

```md
---
description: Rôle court et déclencheur clair.
mode: subagent
---

# Nom

## Mission
## Checklist
## Format de sortie
## Règles
```

### Framework

```md
# Framework — Nom

## Détection
## Conventions
## Tests
## Anti-patterns
```

## Procédure

1. Chercher un artefact existant à enrichir.
2. Définir le déclencheur exact : quand l'agent doit l'appliquer.
3. Écrire la règle la plus courte qui couvre le besoin.
4. Mettre à jour `README.md`, `templates/AGENTS.md` et `docs/customization.md` si l'artefact devient public.
5. Mettre à jour `docs/ai/INDEX.md` si un module ou fichier clé est ajouté.

## Validation

- Le nom est explicite et stable.
- Le fichier ne contient pas de règle contradictoire avec `AGENTS.md`.
- Les responsabilités ne chevauchent pas un autre artefact.
- Les exemples ne dépendent pas d'un projet privé.
