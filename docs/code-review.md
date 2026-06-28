# Code Review

Guide pour la revue de code assistée par agents.

## Checklist obligatoire

### Code

- Le changement répond-il exactement au besoin ?
- Y a-t-il un breaking change ?
- Les conventions projet sont-elles respectées ?
- Les tests couvrent-ils la logique modifiée ?
- Le code est-il plus simple ou plus complexe qu'avant ?
- Y a-t-il un risque sécurité ?
- Y a-t-il une dette technique introduite ?

### Fonctionnel

- Tous les critères du plan sont-ils implémentés ?
- Les edge cases importants sont-ils traités ou explicitement hors scope ?
- Les vérifications proposées prouvent-elles le comportement ?
- Y a-t-il une régression UI/accessibilité ?

### Pertinence

- La solution répond-elle au besoin réel ?
- Des fichiers hors scope ont-ils été modifiés ?
- La solution introduit-elle de la sur-ingénierie ?
- Une clarification humaine est-elle nécessaire ?

## Verdict attendu

Mergeable / À corriger / À clarifier / Bloqué

## Format de sortie

```md
## Verdict

## Points bloquants

- ...

## Axes

- Code : ...
- Fonctionnel : ...
- Pertinence : ...

## Suggestions

- ...

## Tests recommandés

- ...
```

## Règles de conduite

- Être strict mais pragmatique.
- Ne jamais demander de refactoring hors scope.
- Prioriser les vrais risques (sécurité, régression, maintenance).
