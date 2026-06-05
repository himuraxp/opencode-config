# Workflow — Comment fonctionne le cycle de travail

## Le cycle universel

Toute session IA suit impérativement le cycle défini dans `standards/workflow.md` :

```txt
Explorer → Planifier → Implémenter → Vérifier → Committer
```

### 1. Explorer

Lisez le code existant avant toute modification. Identifiez :
- Les fichiers concernés
- Les conventions en vigueur
- Les patterns existants

**Ne jamais implémenter directement sans comprendre le contexte.**

### 2. Planifier

Si la modification touche plus de 2 fichiers, un plan est obligatoire.

Le plan doit contenir :
- Objectif
- Fichiers concernés
- Risques
- Tests attendus

Storez-le temporairement dans `docs/ai/PLAN.md`.

### 3. Implémenter

- Un changement logique à la fois
- Travail incrémental
- Préserver les comportements existants
- Ne pas casser le build volontairement

### 4. Vérifier

Avant de déclarer une tâche terminée, lancer systématiquement :

```bash
build
lint
test
```

Ne jamais affirmer qu'un changement fonctionne sans preuve exécutable.

### 5. Committer

- Un changement logique par commit
- Format : `type(scope): résumé`
- Jamais de commit cassant le build ou les tests

## Session IA complète

### Début

1. Lire `docs/ai/STATUS.md`
2. Lire `docs/ai/PLAN.md`

### Fin

1. Mettre à jour `docs/ai/STATUS.md`
2. Ajouter au `docs/ai/CHANGELOG.md` si significatif

## Anti-patterns communs

- ❌ Implémenter sans lire le code existant
- ❌ Modifier 10 fichiers sans plan
- ❌ Déclarer terminé sans vérifications
- ❌ Committer avec tests cassés
