# Standard — Memory

## Documentation IA par projet

Chaque projet doit maintenir la mémoire de session dans `docs/ai/` :

```txt
docs/
├── ai/
│   ├── PLAN.md        → plan d'implémentation courant
│   ├── STATUS.md      → état actuel, prochaine étape, bloqueurs
│   ├── DECISIONS.md   → décisions d'architecture
│   └── CHANGELOG.md   → historique significatif des sessions IA
```

## Début de session

L'agent doit systématiquement :

1. Lire `docs/ai/STATUS.md` pour comprendre l'état actuel.
2. Lire `docs/ai/PLAN.md` pour connaître le plan en cours.

## Fin de session

L'agent doit systématiquement :

1. Mettre à jour `docs/ai/STATUS.md` avec :
   - ce qui a été fait
   - ce qui reste à faire
   - les bloqueurs éventuels
   - la prochaine étape recommandée

2. Ajouter une entrée dans `docs/ai/CHANGELOG.md` si des changements significatifs ont été réalisés.

## Rôle de chaque document

- **PLAN.md** : plan technique courant, objectifs, étapes, risques.
- **STATUS.md** : état d'avancement dynamique, en cours/fait/bloqué/prochaine action.
- **DECISIONS.md** : décisions structurantes (pourquoi, alternative rejetée, impact).
- **CHANGELOG.md** : historique des sessions (quoi, quand, contexte).

## Règles

- Écrire dans la langue du projet (français recommandé pour les projets francophones).
- Ne pas documenter les micro-corrections (unif, typo, formatage).
- Documenter les décisions d'architecture, les pivots, les découvertes importantes.
- Garder STATUS.md concis et à jour.
