# Architecture

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

## Utiliser INDEX.md pour naviguer

Avant de proposer un plan, consulter `docs/ai/INDEX.md` pour identifier les modules et fichiers clés du projet sans scanner le code entier.
Aurora charge automatiquement `INDEX.md` et `WARNINGS.md` au démarrage si `docs/ai/` existe.

Mettre à jour `INDEX.md` si la structure du projet ou les conventions changent significativement.

## Questions à se poser

- Est-ce que ça complexifie plus qu'il n'en faut ?
- Ce changement peut-il être découpé en étapes indépendantes ?
- Y a-t-il un risque de régression identifié dans `WARNINGS.md` ?
- Les conventions du projet seraient-elles violées ?
- Ai-je consulté `INDEX.md` avant de proposer ?

## Anti-patterns

- Patterns over-engineerés sans justification métier.
- Modification massive sans plan intermédiaire.
- Lister des fichiers sans consulter `INDEX.md` d'abord.

- Ignorer les standards de testing et de typage.
