# Testing — Conventions Infomaniak

Guide pour écrire des tests utiles, lisibles et maintenables.

## Principes

- Tester le comportement public, pas l'implémentation privée.
- Garder les mocks simples et explicites.
- Réutiliser les patterns de tests existants du projet.

## Jest + Angular standalone

- Utiliser `fixture.componentRef.setInput()` pour les inputs standalone.
- Tester les outputs et les états conditionnels visibles.
- Tester les interactions utilisateur.
- Ne pas sur-mocker Angular.

## Anti-patterns

- Tests fragiles basés sur le DOM interne.
- Mocks inutilement complexes.
- Tests qui ne cassent pas quand le comportement change.
- Couverture de code sans valeur métier.

## Stratégie

1. Un test = un comportement attendu.
2. Nommer explicitement : `should emit updated event when button clicked`.
3. Isoler les dépendances externes via des stubs simples.
4. Privilégier les tests d'intégration légère aux tests unitaires trop mocks.
