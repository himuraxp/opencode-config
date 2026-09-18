---
name: review-gap-analyzer
description: Analyser les retours de revue (MR comments, bot feedback) pour déterminer si chaque commentaire aurait pu être évité par une meilleure règle dans AGENTS.md ou un meilleur grep dans le skill pre-mr-review. Propose des améliorations concrètes et évite les false positives.
---

# Skill: Review Gap Analyzer

Analyser les retours de revue de code (commentaires de MR, feedback de bot automatique, retours de reviewer humain) pour identifier les gaps dans les règles de qualité AGENTS.md et le skill `pre-mr-review`.

## Quand utiliser ce skill

Quand l'utilisateur fournit des retours de revue (commentaires de MR GitLab, feedback de Dev Bot, retours de Joe, etc.) et demande si on aurait pu les éviter avec de meilleures règles ou détections.

## Prérequis

Le skill a besoin de :

1. **AGENTS.md** du projet courant (règles, conventions, critical rules)
2. **Skill `pre-mr-review`** (`~/.config/opencode/skills/pre-mr-review/SKILL.md`) — ses greps et patterns de détection
3. **Les retours de revue** fournis par l'utilisateur (collés dans le prompt)

## Processus

### Étape 1: Charger les références

Lire les deux fichiers de référence :

```bash
# AGENTS.md du projet courant
cat AGENTS.md

# Skill pre-mr-review (chemin standard)
cat ~/.config/opencode/skills/pre-mr-review/SKILL.md
```

Extraire :
- Toutes les **Lessons** d'AGENTS.md (numérotées)
- Toutes les **Critical Rules** d'AGENTS.md (numérotées)
- Toutes les **sections conventionnelles** d'AGENTS.md (§1, §2, §10, §12, etc.)
- Tous les **greps** du skill pre-mr-review
- Tous les **patterns** du tableau BLOCKER du skill
- Toutes les **checklists** du skill

### Étape 2: Parser les retours de revue

L'utilisateur fournit les retours dans le prompt. Ces retours peuvent prendre plusieurs formes :

- Commentaires GitLab avec auteur, fichier, ligne, et texte
- Feedback de bot automatique (Dev Bot, Euria AI)
- Retours de reviewer humain (Joe, etc.)

Pour chaque commentaire, extraire :

1. **Auteur** (Dev Bot, Joe Teixeira, etc.)
2. **Fichier** concerné
3. **Ligne(s)** concernée(s)
4. **Texte** du commentaire
5. **Catégorie** inférée du commentaire :
   - `typing` — typage TypeScript (null/undefined, casts, generics)
   - `imports` — ordre/tri des imports
   - `dom` — manipulation directe du DOM
   - `i18n` — strings sans transloco/translate
   - `naming` — conventions de nommage (I prefix, etc.)
   - `tests` — couverture, guard branches, tautological tests
   - `dead-code` — code mort, unused exports
   - `duplication` — logique dupliquée
   - `semantic` — bug logique, design, cohérence
   - `style` — lisibilité, style de code
   - `security` — sécurité
   - `perf` — performance
   - `ux` — expérience utilisateur, wording

### Étape 3: Analyser chaque commentaire

Pour chaque commentaire, déterminer :

#### 3.1. Couverture AGENTS.md

Vérifier si le pattern signalé est couvert par une règle existante d'AGENTS.md :

- Y a-t-il une **Lesson** qui couvre ce pattern ?
- Y a-t-il une **Critical Rule** qui couvre ce pattern ?
- Y a-t-il une **section conventionnelle** (§1, §2, §10, §12, etc.) qui couvre ce pattern ?
- La règle est-elle **explicite** ou **ambiguë** sur ce cas précis ?

#### 3.2. Couverture skill pre-mr-review

Vérifier si le pattern est détecté par le skill :

- Y a-t-il un **grep** qui aurait matché ce pattern ?
- Le pattern est-il listé dans le **tableau BLOCKER** ?
- Le pattern est-il mentionné dans une **checklist** ?

#### 3.3. Faisabilité de la détection

Évaluer si le pattern est grep-able :

| Niveau | Description | Exemple |
|--------|-------------|---------|
| **grep-able** | Pattern syntaxique détectable par regex | `classList.add`, `as never`, `interface T[A-Z]` |
| **lint-able** | Détectable par ESLint mais pas par grep simple | Import order, unused imports |
| **sémantique** | Nécessite du raisonnement (cause, effet, interaction) | Bug de logique, edge case de composition |
| **UX** | Nécessite du jugement humain | Wording de tooltip, clarté d'un message |

#### 3.4. Verdict

Pour chaque commentaire, attribuer un verdict :

| Verdict | Critère | Action |
|---------|---------|--------|
| **Évitable** | Couvert par AGENTS.md mais pas détecté par le skill → **Gap skill** | Proposer un grep |
| **Évitable** | Non couvert par AGENTS.md mais pattern grep-able → **Gap AGENTS.md** | Proposer une lesson + rule |
| **Évitable** | Couvert par AGENTS.md et détecté par le skill → **Process issue** | Lint/pre-review non exécuté |
| **Non évitable** | Pattern sémantique, UX, ou non grep-able | Aucune action |

### Étape 4: Dédupliquer les patterns

Regrouper les commentaires qui pointent le même pattern (ex: 3 commentaires sur le même `classList` = 1 gap).

### Étape 5: Proposer les améliorations

Pour chaque gap identifié, proposer une amélioration concrète :

#### Pour un gap skill (grep manquant)

```
**Gap skill**: [description du gap]
**Grep proposé**: [commande grep exacte]
**Tableau patterns**: [ligne à ajouter au tableau BLOCKER]
**Checklists**: [sections à mettre à jour]
```

#### Pour un gap AGENTS.md (règle manquante)

```
**Gap AGENTS.md**: [description du gap]
**Lesson proposée**: [numéro, titre, contenu avec exemples ❌/✅]
**Rule proposée**: [numéro, texte de la critical rule]
**Skill**: [grep à ajouter + mise à jour checklists]
```

### Étape 6: Évaluer les false positives

Pour chaque grep proposé, évaluer le risque de false positives :

| Risque | Description | Action |
|--------|-------------|--------|
| **Faible** | Pattern spécifique, peu de false positives | Proposer tel quel |
| **Modéré** | Quelques false positives possibles | Ajouter des exclusions (`grep -v`) |
| **Élevé** | Pattern trop générique, avalanche de false positives | Ne pas proposer, marquer comme **Non évitable** |

Si le risque de false positives est trop élevé, ne pas proposer le grep et expliquer pourquoi.

### Étape 7: Générer le rapport

Produire le rapport au format suivant :

```markdown
## Analyse des retours de revue

**Source**: [auteur(s) des retours]
**Commentaires analysés**: [nombre]

### Analyse commentaire par commentaire

| # | Fichier | Catégorie | Couvert par AGENTS.md | Détecté par le skill | Verdict |
|---|---------|-----------|---------------------|---------------------|---------|
| 1 | [fichier] | [catégorie] | [Oui/Non/Ambigu] | [Oui/Non] | [Évitable/Non évitable] |
| ... | ... | ... | ... | ... | ... |

### Synthèse

| Catégorie | Commentaires | Action |
|-----------|-------------|--------|
| Gap skill | [nb] | [liste des greps à ajouter] |
| Gap AGENTS.md | [nb] | [liste des lessons/rules à ajouter] |
| Process issue | [nb] | [lint/pre-review non exécuté] |
| Non évitable | [nb] | [bugs sémantiques, UX, etc.] |

### Améliorations proposées

[Pour chaque gap, la proposition concrète]

### Améliorations rejetées (false positives)

[Pour les patterns non grep-ables, expliquer pourquoi]
```

## Règles d'analyse

### Patterns grep-ables connus (déjà couverts)

Ces patterns sont **déjà couverts** par le skill existant. Si un commentaire les signale, c'est un process issue (lint/pre-review non exécuté) :

- `as never`, `as unknown as` (double cast)
- `interface T[A-Z]` (interface avec T prefix)
- `::ng-deep`
- `Record<string, unknown>`
- `NO_ERRORS_SCHEMA`
- `whitespace-pre-line`
- `of(undefined)` + `tap(NotifyError)` dans `.state.ts`
- `as never` / `as unknown as T`
- `JSON.parse(JSON.stringify())` dans non-`.spec.ts`
- `value && value !== ''` (truthiness check)
- `=== 'PascalCase'` / `!== 'PascalCase'` (magic string)
- `export function ...: { ... }[]` (anonymous inline type)
- `\.classList\.(add|remove|toggle|contains)` (DOM manipulation)
- `{{ 'text' }}` sans transloco (interpolation)
- `[ikTooltip]="..."` sans transloco
- `localeCompare` sur dates ISO

### Patterns non grep-ables (sémantiques)

Ces patterns ne peuvent **pas** être détectés par grep. Si un commentaire les signale, c'est **Non évitable** :

- Bug de logique (condition inversée, fallback qui écrase des valeurs correctes)
- Edge case de composition fonctionnelle (ex: `||` + `trim` produit un résultat inattendu)
- Nom de variable trompeur (sémantique incorrecte)
- Message d'erreur incohérent avec le validateur
- Validation croisée entre champs (minSegmentLength <= segmentLength)
- Silent override (valeur valide acceptée par le formulaire mais rejetée par le payload)
- Dead code cross-file (constante définie dans un fichier mais utilisée dans un autre)
- Test qui ne couvre pas la logique métier (jsdom retourne 0 pour scrollWidth)
- Side effects dans le constructor (idempotence non vérifiée)
- Wording / clarté d'un message (UX)
- Icon name à vérifier dans `node_modules/@infomaniak/font-assets/`

### Critères de rejet d'un grep (false positives)

Ne pas proposer un grep si :

1. **Le pattern est trop générique** — `||` (fallback JS universel), `&&` (short-circuit universel), `return 'string'` (toutes les constantes)
2. **Le pattern nécessite du contexte cross-file** — constante non utilisée dans un autre fichier
3. **Le pattern nécessite de comprendre l'intention** — nom de variable trompeur, message incohérent
4. **Le ratio signal/bruit est < 50%** — plus de la moitié des matches sont des false positives

## Commandes d'utilisation

```
"analyse ces retours de revue"
"voici les commentaires du dev_bot, qu'est-ce qu'on aurait pu éviter ?"
"peux-tu analyser ces retours de MR ?"
"review gap analysis sur ces commentaires"
```

L'utilisateur colle les retours de revue directement dans le prompt. Le skill les parse, les analyse, et propose des améliorations concrètes.

## Notes

- Toujours charger AGENTS.md et le skill pre-mr-review avant l'analyse.
- Ne pas proposer de grep qui produirait plus de 50% de false positives.
- Regrouper les commentaires qui pointent le même pattern.
- Distinguer clairement les process issues (lint non exécuté) des vrais gaps.
- Proposer les améliorations dans un format directement actionnable (copier-coller).
