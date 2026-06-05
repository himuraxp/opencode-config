# AGENTS.md — opencode-config

Ce dépôt contient la configuration globale OpenCode de référence.

## Architecture multi-couches

Ce repo sépare les responsabilités en 3 couches :

```txt
standards/   Comportements universels (workflow, communication, verification...)
agents/      Personnalités spécialisées (aurora, reviewer, tester, security...)
frameworks/  Règles par stack technique (angular-20, nodejs, nestjs...)
```

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

## Configuration multi-couches

L'agent reçoit les instructions dans cet ordre (du plus général au plus spécifique) :

```txt
1. Standards globaux         ~/.config/opencode/standards/
2. Agents globaux            ~/.config/opencode/agents/
3. Frameworks globaux        ~/.config/opencode/frameworks/
4. Standards entreprise      (optionnel)
5. AGENTS.md local du projet
```

L'agent applique la **règle d'or** : le local l'emporte toujours.

Ne jamais outrepasser un `AGENTS.md` local sans justification documentée.
