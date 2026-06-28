# BUFFER

## Snapshot reprise — 2026-06-28

### Sujet

Analyse des idees du projet `ai-driven-dev/framework` branche `next`, dossier `plugins`, reutilisables dans `opencode-config`.

### Sources inspectees

- Local : `README.md`, `standards/workflow.md`, `standards/memory-checklist.md`, `docs/ai/STATUS.md`, `docs/ai/CHANGELOG.md`, `docs/ai/BUFFER.md`
- Externe temporaire : `/tmp/ai-driven-dev-framework/plugins`
- AIDD lu : catalogues `aidd-context`, `aidd-dev`, `aidd-refine`, `aidd-vcs`, plus extraits project-memory, sdlc, review rubric, plan status, capability signals, verification cascade

### Conclusions appliquees

- Applique : ajouter un `status` frontmatter dans `PLAN.md` et clarifier le lifecycle du plan.
- Applique : enrichir `review-before-done.md` avec axes `code`, `fonctionnel`, `pertinence`.
- Applique : rendre `docs/ai/` complet dans ce repo.
- Applique : ajouter `standards/artifact-authoring.md` pour creer standards/agents/frameworks de facon homogene.
- Applique : ajouter `standards/audit.md` pour les audits read-only multi-axes.
- A eviter : copier `.claude-plugin`, hooks Claude, ou la structure `aidd_docs/` sans adaptation.

### Fichiers impactes pendant la session

- `docs/ai/PLAN.md`
- `docs/ai/INDEX.md`
- `docs/ai/WARNINGS.md`
- `docs/ai/DECISIONS.md`
- `docs/ai/STATUS.md`
- `docs/ai/CHANGELOG.md`
- `docs/ai/BUFFER.md`
- `standards/audit.md`
- `standards/artifact-authoring.md`
- `standards/review-before-done.md`
- `standards/workflow.md`
- `standards/memory-auto-update.md`
- `standards/memory-session-flow.md`
- `agents/aurora.md`
- `agents/reviewer.md`
- `templates/PLAN.md`
- `templates/project-docs/INDEX.md`
- `templates/AGENTS.md`
- `README.md`
- `docs/workflow.md`
- `docs/code-review.md`
- `docs/customization.md`

---

# Intégration des Best Practices Claude Code → Aurora

## Date
2026-06-09

## Résumé

Analyse complète de l'article "Best Practices Claude Code" (code.claude.com/docs/fr/best-practices) appliquée à la configuration Aurora. 25 best practices mappées, 5 gaps critiques comblés par 4 nouveaux standards.

---

## Mapping complet (25 best practices)

| # | Best Practice Claude Code | État Aurora | Source |
|---|---------------------------|-------------|--------|
| 1. | **Donner un moyen de vérifier le travail** (tests, build, lint) | ✅ Couvert | `standards/verification.md` |
| 2. | **Explorer → Planifier → Coder** | ✅ Couvert | `standards/workflow.md` (cycle 6 étapes) |
| 3. | **Contexte spécifique dans les invites** | ✅ Partiel | `communication.md` (directivité) + usage naturel |
| 4. | **CLAUDE.md** (contexte persistant) | ⚠️ Équivalent | `AGENTS.md` local = source de vérité. Pas de syntaxe `@import`.
| 5. | **Permissions / Mode auto** | ❌ Hors scope | OpenCode gère les permissions via MCP. Non configurable côté agent. |
| 6. | **Outils CLI** | ✅ Implicite | Outil `bash` disponible. Usage naturel de `gh`, `git`, etc. |
| 7. | **Serveurs MCP** | 🔄 Dépend de l'implémentation OpenCode | |
| 8. | **Hooks** | ❌ Non couvert | *Potentiellement implémentable si standard ajouté. Pas prioritaire.* |
| 9. | **Skills** | ⚠️ Partiel | `task()` tool = subagents/skills. Pas de dossier `.claude/skills/` formel. |
| 10. | **Subagents** | ✅ Couvert | `task()` tool avec types : reviewer, tester, security, explore... |
| 11. | **Plugins** | ❌ Non applicable | Config textuelle, pas de marketplace. |
| 12. | **Poser des questions sur la base de code** | ✅ Couvert | Mode d'usage naturel. `INDEX.md` aide la navigation. |
| 13. | **Laissez Claude interviewer** | ❌ Non couvert | Pas d'outil `AskUserQuestion` équivalent dans OpenCode. *Limitation technique.* |
| 14. | **Corriger la trajectoire** (Esc, /rewind, /clear) | ❌ Non couvert | *Limitation technique côté OpenCode.* |
| 15. | **Gérer le contexte agressivement** | 🆕 **INTÉGRÉ** | `standards/error-correction.md` (règle 2-strikes) + reset context |
| 16. | **Subagents pour investigation** | 🆕 **INTÉGRÉ** | `standards/exploration-limits.md` : investigation > 15 fichiers = subagent |
| 17. | **Checkpoints / Rewind** | ❌ Non couvert | *Limitation technique. Git est le fallback.* |
| 18. | **Reprendre conversations** | ❌ Non couvert | *Côté OpenCode.* |
| 19. | **Mode non interactif** (claude -p) | ❌ Non couvert | *Côté OpenCode.* |
| 20. | **Sessions parallèles** | ❌ Non couvert | *Côté OpenCode.* |
| 21. | **Fan out sur fichiers** | ❌ Non couvert | *Côté OpenCode.* |
| 22. | **Mode auto** | ❌ Non couvert | *Côté OpenCode.* |
| 23. | **Examen contradictoire** (review adversarial) | 🆕 **INTÉGRÉ** | `standards/review-before-done.md` + étape REVIEW dans workflow |
| 24. | **Éviter l'exploration infinie** | 🆕 **INTÉGRÉ** | `standards/exploration-limits.md` : limites de profondeur, objectifs précis |
| 25. | **Anti-patterns** | 🆕 **INTÉGRÉ** | `standards/anti-patterns.md` : 5 patterns à reconnaître et corriger |

---

## Nouveaux standards créés

### 1. `standards/review-before-done.md`

**Problème couvert** : L'agent qui code valide son propre travail → biais de confirmation, défauts non détectés.

**Règle** : Avant de considérer terminé, lancer un subagent `reviewer` ou le skill `code-review` avec un contexte vierge.

**Intégration** : Ajouté comme étape REVIEW dans le cycle workflow :
```
Explorer → Planifier → Implémenter → [REVIEW] → Vérifier → Committer
```

### 2. `standards/exploration-limits.md`

**Problème couvert** : Exploration sans objectif qui remplit la fenêtre de contexte et dégrade les performances.

**Règles** :
- Limite de profondeur : > 15 fichiers = subagent obligatoire
- Chaque investigation a un objectif précis, une portée, un résultat attendu
- Si > 100 lignes lues sans réponse → stopper et affiner la recherche
- Pas de lecture globale (`find | xargs cat` interdit)

### 3. `standards/error-correction.md`

**Problème couvert** : Correction en boucle sur le même problème pollue le contexte et dégrade la qualité.

**Règle du 2-strikes** :
- Strike 1 : correction échouée
- Strike 2 : 2ème échec
- Strike 3 → **RESET OBLIGATOIRE** : réécrire l'invite et repartir propre

**Interdit** : 3+ tentatives sans reset, corriger sans cause profonde, supprimer un test échouant.

### 4. `standards/anti-patterns.md`

**Problème couvert** : 5 patterns d'échec courants non reconnus.

**Patterns** :
1. Session fourre-tout (mélange de sujets) → une tâche = une session
2. Correction en spirale (2-strikes → reset)
3. AGENTS.md sur-spécifié (si ça ne cause pas d'erreur sans → supprimer)
4. Écart confiance-puis-vérification → toujours vérifier avec preuve
5. Exploration infinie → objectif + portée + subagent

---

## Mises à jour apportées

### `standards/workflow.md`

- Cycle modifié : `Explorer → Planifier → Implémenter → [REVIEW] → Vérifier → Committer`
- Section REVIEW ajoutée avec procédure de subagent reviewer
- Règles absolues : ajout de "Ne jamais merger sans vérification NI sans review adversarial"
- Référence à `exploration-limits.md` pour les investigations lourdes
- Référence à `error-correction.md` pour le reset après 2 échecs

### `AGENTS.md` (global)

- Section "Comportement attendu" enrichie avec 4 nouvelles règles :
  1. Examen contradictoire avant fin de tâche
  2. Limites d'exploration (subagent pour investigation lourde)
  3. Reset après 2 corrections échouées
  4. Reconnaissance des anti-patterns

### `templates/AGENTS.md` (template injecté dans les projets)

- Règles générales enrichies avec les mêmes 4 obligations
- Liste des standards globaux actualisée (9 standards au lieu de 6)
- Section "Modes de travail" : exécution mentionne explicitement le review adversarial et le reset

---

## Ce qui reste hors scope (dépend d'OpenCode)

Ces fonctionnalités sont contrôlées par l'implémentation d'OpenCode, non par la config agent :

- Permissions / Mode auto
- Checkpoints / Rewind
- /clear, /compact, /btw (gestion du contexte conversation)
- Mode non interactif (headless)
- Sessions parallèles / worktrees
- Fan out sur fichiers
- AskUserQuestion (interview utilisateur)
- Plugins / marketplace

**Recommandation** : Vérifier avec l'équipe OpenCode si ces fonctionnalités sont roadmap.

---

## Validation

### Vérification rapide (commandes)

```bash
# Lister les standards disponibles
ls ~/.config/opencode/standards/*.md

# Vérifier que le workflow inclut REVIEW
grep "REVIEW" ~/.config/opencode/standards/workflow.md

# Vérifier les anti-patterns
grep "anti-patterns" ~/.config/opencode/AGENTS.md
```

### Checklist d'intégration

- [x] Standard `review-before-done.md` créé
- [x] Standard `exploration-limits.md` créé
- [x] Standard `error-correction.md` créé
- [x] Standard `anti-patterns.md` créé
- [x] `workflow.md` mis à jour avec étape REVIEW
- [x] `AGENTS.md` global mis à jour avec références
- [x] `templates/AGENTS.md` mis à jour pour nouveaux projets
- [x] `templates/AGENTS.md` référence les 9 standards
- [x] Mémoire projet (`memory-auto-update.md`) conservé et enrichi

---

## Prochaines étapes recommandées (optionnelles)

1. **Hooks post-édition** : Créer un standard `hooks.md` pour suggérer (non imposer) l'exécution automatique de lint après chaque édition de fichier.
2. **Skills custom** : Formaliser la création de skills dans un dossier projet (équivalent `.claude/skills/`).
3. **Tests adversariaux** : Enrichir le subagent `reviewer` avec des prompts de review spécifiques par langage/framework.
