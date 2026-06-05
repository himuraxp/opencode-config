# Code Review

Guide pour la revue de code assistée par agents.

## Checklist obligatoire

- Le changement répond-il exactement au besoin ?
- Y a-t-il un breaking change ?
- Les conventions projet sont-elles respectées ?
- Les tests couvrent-ils la logique modifiée ?
- Le code est-il plus simple ou plus complexe qu'avant ?
- Y a-t-il une régression UI/accessibilité ?
- Y a-t-il un risque sécurité ?
- Y a-t-il une dette technique introduite ?

## Verdict attendu

Mergeable / À corriger / À clarifier

## Format de sortie

```md
## Verdict

## Points bloquants

- ...

## Suggestions

- ...

## Tests recommandés

- ...
```

## Règles de conduite

- Être strict mais pragmatique.
- Ne jamais demander de refactoring hors scope.
- Prioriser les vrais risques (sécurité, régression, maintenance).
