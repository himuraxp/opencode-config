# Standard — Workflow

## Cycle universel de travail

Toute tâche suit impérativement ce cycle :

```txt
Explorer → Planifier → Implémenter → [REVIEW] → Vérifier → Committer
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
- **Si l'exploration touche > 15 fichiers potentiels** : utiliser un subagent `explore` pour l'investigation (voir `exploration-limits.md`).

### 2. Planifier

- Pour toute modification touchant plus de 2 fichiers : plan obligatoire.
- Le plan doit contenir : objectif, fichiers concernés, étapes, risques, tests.
- Stocker le plan dans `docs/ai/PLAN.md`.

### 3. Implémenter

- Travailler de manière incrémentale.
- Un changement logique à la fois.
- Ne jamais casser le build volontairement.
- Préserver les comportements existants.

### 4. Review (Examen contradictoire)

Avant de considérer le code comme terminé, exécuter un **examen adversarial** dans un subagent frais.

- L'agent qui code ne peut pas être celui qui valide.
- Utiliser le skill `code-review` ou un subagent `reviewer`.
- Le reviewer examine la diff contre `PLAN.md` et signale les gaps critiques uniquement.
- Voir `review-before-done.md` pour la procédure complète.
- Corriger les gaps, puis passer à Vérifier (1 itération max si gaps identifiés).

### 5. Vérifier

- Une tâche n'est jamais considérée comme terminée tant que build + lint + test ne passent pas.
- Lancer les vérifications adaptées au projet.
- Montrer les résultats réels.
- Ne jamais affirmer qu'un changement fonctionne sans preuve.

### 6. Committer

- Un changement logique par commit.
- Jamais de commit avec build cassé.
- Jamais de commit avec tests cassés.
- Format : `type(scope): résumé`

## Règles absolues

- Ne jamais implémenter sans exploration préalable.
- Ne jamais merger sans vérification NI sans review adversarial.
- Ne jamais masquer une erreur.
- Après 2 corrections échouées sur le même problème : reset obligatoire (voir `error-correction.md`).
- Jamais de correction en boucle sans comprendre la cause profonde (voir `error-correction.md`).
