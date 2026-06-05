# AGENTS.md — Projet

Ce fichier est la source de vérité pour les agents travaillant sur ce projet.

## Objectif du projet

Décrire ici le produit, le contexte métier et les contraintes principales.

## Règles générales

- Respecter le style existant.
- Garder les changements ciblés.
- Ne pas faire de refactoring massif non demandé.
- Ne pas ajouter de dépendance sans justification claire.
- Préserver les comportements existants.
- Ajouter ou adapter les tests quand la logique change.
- Toujours privilégier une solution simple, maintenable et lisible.

## Angular 20 — Conventions Infomaniak

### Templates HTML

- Utiliser `@if` / `@else`.
- Utiliser `@for (...; track ...)`.
- Ne pas utiliser `*ngIf`, `*ngFor`, `ngSwitch`.
- Ne pas utiliser `let` dans `@for`.
- Les blocs `@if` et `@for` doivent entourer des balises HTML complètes.
- Ne jamais utiliser `@if` ou `@for` comme attribut.
- Éviter les expressions complexes dans le HTML.

### TypeScript

- Composants standalone uniquement.
- Pas de NgModule manuel.
- Injection via `inject()` uniquement.
- Variables privées avec `#variable`.
- Éviter `private`.
- Inputs avec `input()` / `input.required()`.
- Outputs avec `output()`.
- Ne pas utiliser `@Input()` / `@Output()`.
- Utiliser `signal()`, `computed()`, `effect()`.
- RxJS uniquement dans les services métier, sauf contrainte existante.
- Éviter `null`, préférer `undefined`.
- Ne pas utiliser `any`.

### Tests

- Utiliser Jest.
- Pour les inputs standalone, utiliser `fixture.componentRef.setInput()`.
- Tester les comportements visibles.
- Ajouter les tests nécessaires pour toute logique modifiée.

### SCSS

- Éviter la duplication.
- Ne pas ajouter de style global sans nécessité.
- Respecter la structure SCSS existante.
- Préserver le responsive.

## Workflow attendu

Pour une tâche complexe :

1. Lire le contexte existant.
2. Identifier les fichiers concernés.
3. Proposer un plan court.
4. Implémenter par petits changements.
5. Lancer ou indiquer les tests pertinents.
6. Résumer clairement les modifications.

## Documentation IA

Utiliser `docs/ai/` pour conserver le contexte long terme :

- `PLAN.md` : plan technique courant.
- `STATUS.md` : état d'avancement.
- `DECISIONS.md` : décisions structurantes.
- `CHANGELOG.md` : changements réalisés par les agents.
