# Architecture — Conventions Infomaniak

Guide pour découper les fonctionnalités et prendre des décisions architecturales en contexte Angular / TypeScript.

## Principes

- **KISS** avant tout (Keep It Simple, Stupid).
- Éviter les abstractions prématurées.
- Respecter l'architecture existante.
- Isoler les risques.
- Préférer des incréments mergeables.

## Livrable attendu

Pour toute fonctionnalité non triviale, produire :

```md
## Objectif

## Fichiers probablement concernés

## Plan d'implémentation

## Risques

## Tests
```

## Questions à se poser

- Est-ce que ça complexifie plus qu'il n'en faut ?
- Ce changement peut-il être découpé en étapes indépendantes ?
- Y a-t-il un risque de régression ?
- Les conventions du projet seraient-elles violées ?

## Anti-patterns

- Patterns over-engineerés sans justification métier.
- Modification massive sans plan intermédiaire.
- Ignorer les standards de testing et de typage.
