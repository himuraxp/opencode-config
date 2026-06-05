# AGENTS.md — Projet

Ce fichier est la source de vérité pour les agents travaillant sur ce projet.

## Objectif du projet

Décrire ici le produit, le contexte métier et les contraintes principales.

## Règles générales

- Respecter le style existant.
- Garder les changements ciblés.
- Ne pas faire de refactoring massif non demandé.
- Ne pas ajouter de dépendance sans justification claire.
- Préserver les comportements existants.
- Ajouter ou adapter les tests quand la logique change.
- Toujours privilégier une solution simple, maintenable et lisible.
- Ne jamais lire globalement des fichiers énormes si une recherche ciblée suffit.
- Utiliser `INDEX.md` pour comprendre où chercher avant de scanner le projet.
- Ne pas polluer `DECISIONS.md` avec des micro-décisions temporaires.

## Standards globaux

Les standards suivants sont chargés automatiquement par l'agent principal (Aurora) :

- **workflow** : cycle Explorer → Planifier → Implémenter → Vérifier → Committer
- **memory** : gestion de la session et de la documentation IA
- **verification** : vérifications build/lint/test obligatoires avant considérer fini
- **communication** : directivité, ownership, pushback constructif
- **escalation** : gestion des blocages et arrêt propre
- **commits** : format et règles de commit

Ces standards sont stockés dans `~/.config/opencode/standards/` par l'installation globale.

## Modes de travail

### Mode EXECUTION (par défaut)

Objectif : appliquer le plan existant.

Règles :
- Modifier uniquement les fichiers dans le scope.
- Vérifier build/lint/test après chaque changement logique.
- Documenter les écarts dans `BUFFER.md`.
- Stopper immédiatement si contradiction avec `DECISIONS.md` ou `WARNINGS.md`.
- Consulter `INDEX.md` avant de toucher un fichier inconnu du projet.

### Mode BRAINSTORM

Objectif : concevoir, planifier, architecturer.

Règles :
- Aucune modification de code source.
- Documentation, architecture et planification uniquement.
- Autorisé à modifier : `PLAN.md`, `DECISIONS.md`, `INDEX.md`.
- Sortie du mode quand le plan est validé et clair.

## Documentation IA

Utiliser `docs/ai/` pour conserver le contexte long terme.

### Ordre de lecture — Début de session

```txt
1. STATUS.md   → état actuel, bloqueurs
2. PLAN.md     → plan en cours
3. WARNINGS.md → alertes actives
4. INDEX.md    → cartographie du projet
5. BUFFER.md   → si reprise de session interrompue
```

### Ordre de mise à jour — Fin de session

```txt
1. STATUS.md    → fait, à faire, bloqueurs, prochaine étape
2. BUFFER.md   → sujets hors-scope, micro-décisions, snapshot
3. CHANGELOG.md → changements significatifs uniquement
```

### Rôle de chaque document

- **PLAN.md** : plan technique courant (objectif, étapes, risques, tests).
- **STATUS.md** : état d'avancement dynamique (en cours, fait, bloqué, prochaine action).
- **DECISIONS.md** : décisions structurantes (contexte, décision, impact, alternative rejetée).
- **CHANGELOG.md** : historique significatif des sessions IA (quoi, quand, pourquoi).
- **BUFFER.md** : mémoire tampon temporaire (hors-scope, micro-décisions, snapshot de session).
- **INDEX.md** : cartographie du projet (structure, modules, fichiers clés, conventions).
- **WARNINGS.md** : alertes actives et dettes connues (zones sensibles, workarounds).

### Règles de synchronisation

- BUFFER.md : vider ou archiver en fin de session si vide.
- Un sujet hors-scope persistant dans BUFFER.md doit être promu dans WARNINGS.md.
- Ne pas mettre les micro-décisions dans DECISIONS.md (réservé aux décisions structurantes).
- Ne pas documenter les unif, typo ou micro-corrections dans CHANGELOG.md.
- Mettre à jour INDEX.md si la structure du projet change significativement.

## Angular 20 — Conventions

### Templates HTML

- Utiliser `@if` / `@else`.
- Utiliser `@for (...; track ...)`.
- Ne pas utiliser `*ngIf`, `*ngFor`, `ngSwitch`.
- Ne pas utiliser `let` dans `@for`.
- Les blocs `@if` et `@for` doivent entourer des balises HTML complètes.
- Ne jamais utiliser `@if` ou `@for` comme attribut.
- Éviter les expressions complexes dans le HTML.

### TypeScript

- Composants standalone uniquement.
- Pas de NgModule manuel.
- Injection via `inject()` uniquement.
- Variables privées avec `#variable`.
- Éviter `private`.
- Inputs avec `input()` / `input.required()`.
- Outputs avec `output()`.
- Ne pas utiliser `@Input()` / `@Output()`.
- Utiliser `signal()`, `computed()`, `effect()`.
- RxJS uniquement dans les services métier, sauf contrainte existante.
- Éviter `null`, préférer `undefined`.
- Ne pas utiliser `any`.

### Tests

- Utiliser Jest.
- Pour les inputs standalone, utiliser `fixture.componentRef.setInput()`.
- Tester les comportements visibles.
- Ajouter les tests nécessaires pour toute logique modifiée.

### SCSS

- Éviter la duplication.
- Ne pas ajouter de style global sans nécessité.
- Respecter la structure SCSS existante.
- Préserver le responsive.

## Workflow attendu

Pour une tâche complexe :

1. Lire le contexte existant (docs/ai/ puis INDEX.md).
2. Identifier les fichiers concernés.
3. Proposer un plan court (pour >2 fichiers).
4. Implémenter par petits changements.
5. Lancer ou indiquer les tests pertinents.
6. Résumer clairement les modifications.
