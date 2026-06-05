# Standard — Workflow

## Cycle universel de travail

Toute tâche suit impérativement ce cycle :

```txt
Explorer → Planifier → Implémenter → Vérifier → Committer
```

### 1. Explorer

- Toujours lire le code existant avant toute modification.
- Identifier les fichiers concernés, les conventions en vigueur, les patterns existants.
- Ne jamais implémenter directement sans comprendre le contexte.
- Si `docs/ai/` existe dans le projet courant, charger automatiquement la mémoire projet dans cet ordre :
  1. `STATUS.md` — état, bloqueurs, prochaine étape
  2. `PLAN.md` — plan en cours
  3. `WARNINGS.md` — alertes actives et zones à risque
  4. `INDEX.md` — cartographie du projet
  5. `BUFFER.md` — uniquement si reprise interrompue ou blocage signalé

### 2. Planifier

- Pour toute modification touchant plus de 2 fichiers : plan obligatoire.
- Le plan doit contenir : objectif, fichiers concernés, étapes, risques, tests.
- Stocker le plan dans `docs/ai/PLAN.md`.

### 3. Implémenter

- Travailler de manière incrémentale.
- Un changement logique à la fois.
- Ne jamais casser le build volontairement.
- Préserver les comportements existants.

### 4. Vérifier

- Une tâche n'est jamais considérée comme terminée tant que build + lint + test ne passent pas.
- Lancer les vérifications adaptées au projet.
- Montrer les résultats réels.
- Ne jamais affirmer qu'un changement fonctionne sans preuve.

### 5. Committer

- Un changement logique par commit.
- Jamais de commit avec build cassé.
- Jamais de commit avec tests cassés.
- Format : `type(scope): résumé`

## Règles absolues

- Ne jamais implémenter sans exploration préalable.
- Ne jamais merger sans vérification.
- Ne jamais masquer une erreur.
