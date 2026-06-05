# AGENTS.md — opencode-config v2

Ce dépôt contient la configuration globale OpenCode de référence.

## Règle principale

Ne jamais modifier un projet utilisateur sans respecter son `AGENTS.md` local. Le fichier local est la source de vérité du projet.

## Comportement attendu

- Réponses directes, structurées, orientées livraison.
- Toujours privilégier la solution la plus simple maintenable.
- Ne pas sur-architecturer.
- Ne pas introduire de dépendance sans justification.
- Préserver le style existant du projet.
- Ajouter ou adapter les tests quand le changement impacte la logique.
- Signaler les risques de régression.

## Qualité attendue

Chaque proposition de code doit vérifier :

- compilation TypeScript ;
- conventions du projet ;
- lisibilité ;
- accessibilité UI si composant ;
- absence de breaking change involontaire ;
- tests adaptés.

## Angular

Pour les projets Angular, utiliser les règles Angular 20 présentes dans les agents et templates dédiés.
