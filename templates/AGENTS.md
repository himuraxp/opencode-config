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

## Standards globaux

Les standards suivants sont chargés automatiquement par l'agent principal (Aurora) :

- **workflow** : cycle Explorer → Planifier → Implémenter → Vérifier → Committer
- **memory** : gestion de la session et de la documentation IA
- **verification** : vérifications build/lint/test obligatoires avant considérer fini
- **communication** : directivité, ownership, pushback constructif
- **escalation** : gestion des blocages et arrêt propre
- **commits** : format et règles de commit

Ces standards sont stockés dans `~/.config/opencode/standards/` par l'installation globale.

## Angular 20 — Conventions

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

1. Lire le contexte existant (code, docs/ai/).
2. Identifier les fichiers concernés.
3. Proposer un plan court (pour >2 fichiers).
4. Implémenter par petits changements.
5. Lancer ou indiquer les tests pertinents.
6. Résumer clairement les modifications.

## Session IA

### Début de session

1. Lire `docs/ai/STATUS.md`.
2. Lire `docs/ai/PLAN.md`.

### Fin de session

1. Mettre à jour `docs/ai/STATUS.md` (fait, à faire, bloqueurs, prochaine étape).
2. Ajouter une entrée dans `docs/ai/CHANGELOG.md` si adaptations significatives.

## Documentation IA

Utiliser `docs/ai/` pour conserver le contexte long terme :

- `PLAN.md` : plan technique courant.
- `STATUS.md` : état d'avancement.
- `DECISIONS.md` : décisions structurantes.
- `CHANGELOG.md` : changements réalisés par les agents.
