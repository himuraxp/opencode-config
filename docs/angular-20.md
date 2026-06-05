# Angular 20 — Conventions Infomaniak

Guide pratique pour produire du code Angular 20 moderne et maintenable.

## Templates HTML

- Utiliser `@if` / `@else` et `@for (...; track ...)`.
- Ne plus utiliser `*ngIf`, `*ngFor`, `ngSwitch`.
- Ne pas utiliser `let` dans la clause `@for`.
- S'assurer que les blocs `@if` et `@for` entourent des balises HTML complètes.
- Ne jamais utiliser `@if` ou `@for` comme attribut.
- Définir un `track` stable dans `@for`.
- Éviter les expressions complexes dans le template ; préférer `computed()` en TypeScript.

## TypeScript / Composants

### Standalone

- Tous les composants sont standalone.
- Pas de NgModule manuel.
- Les imports se déclarent dans `imports: []` du composant.

### Injection

- Utiliser `inject()` uniquement.
- Champs privés avec `#service`.
- Éviter `private`.

### Inputs / Outputs

- `input()` / `input.required<T>()` pour les données.
- `output()` pour les événements.
- Ne pas utiliser `@Input()` / `@Output()`.
- Éviter `null`, préférer `undefined`.

### Réactivité

- Utiliser `signal()`, `computed()`, `effect()`.
- Ne pas utiliser RxJS dans les composants sauf contrainte existante.
- RxJS autorisé dans les services métier.

### Typage

- Interdire `any`.
- Utiliser `unknown` si le type est réellement inconnu.
- Définir des interfaces explicites.
- Préférer `undefined` à `null`.

## Tests

- Utiliser Jest.
- `fixture.componentRef.setInput()` pour les inputs standalone.
- Tester les comportements visibles et les outputs.
- Mocks simples et lisibles.
- Ne pas tester les détails d'implémentation privés.

## Services

- Logique métier isolée dans les services.
- Les composants restent orientés présentation/orchestration.

## SCSS

- Préserver les conventions existantes.
- Éviter la duplication et les styles globaux.
- Préserver le responsive.

## Accessibilité

- Libellé ou `aria-label` sur tous les boutons.
- Actions critiques explicites.
- Préserver les états loading, empty, error.
