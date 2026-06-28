# Workflow — Comment fonctionne le cycle de travail

## Le cycle universel

Toute session IA suit impérativement le cycle défini dans `standards/workflow.md` :

```txt
Explorer → Planifier → Implémenter → Review → Vérifier → Committer
```

### Lecture en début de session

Ordre obligatoire lorsque `docs/ai/` est découvert :

```txt
1. STATUS.md   → état actuel, bloqueurs, prochaine étape
2. PLAN.md     → plan en cours
3. WARNINGS.md → alertes actives avant de toucher quoi que ce soit
4. INDEX.md    → comprendre la structure du projet sans scanner
5. BUFFER.md   → seulement si reprise de session interrompue, blocage, ou demande explicite
```

Aurora détecte automatiquement `docs/ai/` au démarrage et applique cet ordre sans configuration dans `AGENTS.md`.

### Mise à jour en fin de session

Ordre recommandé :

```txt
1. STATUS.md    → résumer le travail fait
2. BUFFER.md    → noter les sujets hors-scope, micro-décisions
3. CHANGELOG.md → uniquement si changements significatifs
```

### Utiliser INDEX.md pour éviter le scan global

- Avant de chercher dans le projet, vérifier si `INDEX.md` contient déjà le module/fichier visé.
- Ne jamais scanner tout le code si une recherche ciblée ou l'INDEX.md suffisent.
- Mettre à jour INDEX.md seulement si la structure du projet change significativement.

### Gérer le BUFFER.md

- Utiliser pour les micro-décisions prises en session, les découvertes hors-scope, le snapshot si interruption.
- Vider ou archiver en fin de session si résolu ou vide.
- **Promouvoir tout risque persistant** de `BUFFER.md` vers `WARNINGS.md`.
- Ne jamais mettre les micro-décisions dans `DECISIONS.md`.

### Explorer

Lisez le code existant avant toute modification. Identifiez :
- Les fichiers concernés
- Les conventions en vigueur
- Les patterns existants
- Les zones dangereuses via `WARNINGS.md`

**Ne jamais implémenter directement sans comprendre le contexte.**

### Planifier

Si la modification touche plus de 2 fichiers, un plan est obligatoire.

Le plan doit contenir :
- Objectif
- Fichiers concernés
- Risques
- Tests attendus
- Statut : `pending`, `in-progress`, `implemented`, `reviewed` ou `blocked`

Storez-le dans `docs/ai/PLAN.md`.

### Implémenter

- Un changement logique à la fois
- Travail incrémental
- Préserver les comportements existants
- Ne pas casser le build volontairement

### Review

Avant de déclarer terminé, exécuter un examen contradictoire sur trois axes :

- **Code** : correction, maintenabilité, sécurité, conventions
- **Fonctionnel** : respect du plan, critères d'acceptation, edge cases
- **Pertinence** : réponse au besoin réel, absence de hors-scope, pas de sur-ingénierie

Le plan ne passe à `reviewed` qu'après review et vérifications.

### Vérifier

Avant de déclarer une tâche terminée, lancer systématiquement :

```bash
build
lint
test
```

Ne jamais affirmer qu'un changement fonctionne sans preuve exécutable.

### Committer

- Un changement logique par commit
- Format : `type(scope): résumé`
- Jamais de commit cassant le build ou les tests

## Modes de travail

### Mode EXECUTION (par défaut)

Appliquer le plan. Modifier les fichiers dans le scope, vérifier, documenter les écarts dans `BUFFER.md`.

### Mode BRAINSTORM

Conception uniquement. Aucun code modifié. Autorisé à modifier `PLAN.md`, `DECISIONS.md`, `INDEX.md`. Sortir quand le plan est validé.

### Mode AUDIT

Diagnostic read-only. Aucun code modifié. Choisir les axes pertinents : qualité, architecture, sécurité, dépendances, performance, tests, UI/accessibilité. Produire un rapport priorisé avec preuves.

## Anti-patterns communs

- ❌ Implémenter sans lire le code existant
- ❌ Modifier 10 fichiers sans plan
- ❌ Déclarer terminé sans vérifications
- ❌ Déclarer terminé sans review contradictoire
- ❌ Corriger du code pendant un audit read-only
- ❌ Committer avec tests cassés
- ❌ Scanner le projet entier si INDEX.md suffit
- ❌ Mettre micro-décisions dans DECISIONS.md
- ❌ Lire un fichier `.new` automatiquement (propositions de fusion manuelle uniquement)
