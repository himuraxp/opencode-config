# Standard : Mémoire Projet Auto-Entretenue

## Principe

La mémoire projet (`docs/ai/`) DOIT être maintenue automatiquement par Aurora sans intervention utilisateur. Aucune étape manuelle ne doit être requise.

## Déclencheur

À la fin de **chaque session de travail** (quand une tâche est terminée, qu'un livrable est proposé, ou qu'Aurora s'apprête à rendre la main), Aurora DOIT exécuter la procédure de persistance mémoire ci-dessous.

## Procédure de persistance (obligatoire)

### Étape 1 : Mettre à jour STATUS.md

- Section **En cours** : liste des tâches non terminées avec leur contexte
- Section **Fait** : ce qui vient d'être accompli dans cette session (avec timestamp)
- Section **Bloqué** : tout blocage actif avec la raison
- Section **Prochaine action** : ce qu'il reste à faire

### Étape 2 : Mettre à jour PLAN.md

- Si un plan était en cours : mettre à jour l'avancement des étapes
- Si une nouvelle tâche a été identifiée : l'ajouter au plan
- Cocher `[x]` les étapes terminées
- Maintenir le champ `status` si présent :
  - `pending` : plan créé, non commencé
  - `in-progress` : implémentation en cours
  - `implemented` : implémenté, pas encore validé par review
  - `reviewed` : review et vérifications terminées
  - `blocked` : intervention humaine nécessaire

### Étape 3 : Mettre à jour CHANGELOG.md

Ajouter une entrée au format :
```
## YYYY-MM-DD HH:MM

- [Fichier modifié] : Description concise du changement
- [Autre fichier] : Autre changement
```

### Étape 4 : Mettre à jour INDEX.md

- Si de nouveaux modules/fichiers clés ont été découverts : les ajouter
- Si des conventions ont été identifiées : les documenter
- Maintenir la section "Commandes de recherche utiles" à jour
- Ajouter uniquement les capacités prouvées par le repo (UI, API, base de données, auth, CLI, package, mobile, desktop, infra, data, monorepo). Ne jamais inférer une capacité sans signal concret.

### Étape 5 : Mettre à jour BUFFER.md

- **Snapshot reprise** : résumer l'état actuel pour reprise rapide
- **Fichiers impactés localement** : liste des fichiers modifiés dans la session
- Vider les sections temporaires (micro-décisions, notes rapides)

### Étape 6 : Vérifier WARNINGS.md

- Si des zones sensibles ont été identifiées : les ajouter
- Si des dettes techniques ont été découvertes : les documenter
- Maintenir l'historique des warnings clôturés

### Étape 7 : Vérifier DECISIONS.md

- Si des décisions architecturales ont été prises : les documenter avec date et contexte

## Formats imposés

### STATUS.md

```markdown
# STATUS

## En cours

- [Nom tâche] : [Contexte court + fichiers concernés]

## Fait

### YYYY-MM-DD HH:MM

- [Nom tâche] : [Résultat + fichiers modifiés]

## Bloqué

- [Nom tâche] : [Raison du blocage]

## Prochaine action

- [ ] [Action suivante à réaliser]
```

### PLAN.md — Statut

```markdown
---
status: pending
---

# PLAN
```

Valeurs autorisées : `pending`, `in-progress`, `implemented`, `reviewed`, `blocked`.

### BUFFER.md — Snapshot reprise

```markdown
## Snapshot reprise

**Dernière session** : YYYY-MM-DD HH:MM
**Tâche en cours** : [Description]
**Fichiers ouverts** : [liste]
**État** : [Où on en est exactement]
**Prochaine étape** : [Quoi faire en priorité si reprise]
```

## Règle d'or

> Si `docs/ai/` existe, il DOIT être à jour avant de rendre la main. Vider le BUFFER des notes temporaires tout en préservant le snapshot.

## Anti-patterns interdits

- ❌ Ne JAMAIS laisser STATUS.md vide si du travail a été fait
- ❌ Ne JAMAIS oublier de cocher les étapes terminées dans PLAN.md
- ❌ Ne JAMAIS écrire dans CHANGELOG.md sans date précise
- ❌ Ne JAMAIS laisser le snapshot vide si une session a eu lieu
