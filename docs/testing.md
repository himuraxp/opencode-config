# Testing

> Ce guide couvre les tests Angular et Node.js/NestJS. Pour Astro, voir `frameworks/astro.md`.

Guide pour écrire des tests utiles, lisibles et maintenables.

## Principes généraux

- Tester le comportement public, pas l'implémentation privée.
- Garder les mocks simples et explicites.
- Réutiliser les patterns de tests existants du projet.
- Un test = un comportement attendu.
- Nommer explicitement : `should emit updated event when button clicked`.
- Isoler les dépendances externes via des stubs simples.
- Privilégier les tests d'intégration légère aux tests unitaires trop mocks.

## Jest + Angular standalone

- Utiliser `fixture.componentRef.setInput()` pour les inputs standalone.
- Tester les outputs et les états conditionnels visibles.
- Tester les interactions utilisateur.
- Ne pas sur-mocker Angular.

## Node.js / NestJS

- Tests Jest unitaires et d'intégration.
- Mocker les dépendances externes (DB, API) via des stubs.
- Tester les routes/controlleurs en intégration légère.
- Voir `frameworks/nodejs.md` et `frameworks/nestjs.md` pour les détails.

## Anti-patterns

- Tests fragiles basés sur le DOM interne.
- Mocks inutilement complexes.
- Tests qui ne cassent pas quand le comportement change.
- Couverture de code sans valeur métier.
