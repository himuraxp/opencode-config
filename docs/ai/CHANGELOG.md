# CHANGELOG

## 2026-06-28 — Analyse inspirations AIDD plugins

### Contexte

- Inspection du repo externe `ai-driven-dev/framework`, branche `next`, dossier `plugins`.
- Comparaison avec l'architecture locale `standards/`, `agents/`, `frameworks/`, `templates/`, `docs/ai/`.

### Observations

- AIDD apporte une taxonomie utile : `context`, `dev`, `refine`, `pm`, `vcs`, `orchestrator`.
- Les apports les plus pertinents pour OpenCode sont conceptuels : lifecycle de plan, review en axes, audit read-only, memoire par capacites detectees, generation encadree de rules/agents/skills.
- Les mecanismes Claude-specifiques (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre importes tels quels.

### Memoire

- Ajout des fichiers manquants dans `docs/ai/` : `PLAN.md`, `INDEX.md`, `WARNINGS.md`, `DECISIONS.md`.

## 2026-06-28 — Integration recommandations AIDD adaptees OpenCode

### Standards

- `standards/audit.md` : nouveau standard d'audit read-only multi-axes.
- `standards/artifact-authoring.md` : nouveau standard pour creer standards, agents, frameworks et templates sans doublons.
- `standards/review-before-done.md` : review structuree en axes code, fonctionnel, pertinence.
- `standards/workflow.md` : lifecycle explicite de `PLAN.md` et mode audit read-only.
- `standards/memory-auto-update.md` et `standards/memory-session-flow.md` : statut de plan et capacites prouvees.

### Agents, templates, docs

- `agents/aurora.md` : cycle avec Review et audit read-only.
- `agents/reviewer.md` : checklist alignee sur les trois axes.
- `templates/PLAN.md` : frontmatter `status: pending`.
- `templates/project-docs/INDEX.md` : section capacites prouvees.
- `templates/AGENTS.md`, `README.md`, `docs/workflow.md`, `docs/code-review.md`, `docs/customization.md` : documentation synchronisee.

### Verification

- `bash -n scripts/install.sh`
- `bash -n scripts/init-project.sh`
- `bash -n scripts/sync-project.sh`
- `scripts/init-project.sh --dry-run` depuis `/private/tmp`
- `scripts/sync-project.sh --dry-run` depuis `/private/tmp`

## 2026-06-09 ~12:00 — Intégration Claude Code Best Practices

### Standards créés

- `standards/review-before-done.md` (67→75 lignes)
  - Examen contradictoire obligatoire avant fin de tâche
  - Méthodes : skill `code-review` ou subagent `reviewer`
  - Traitement du retour avec max 1 itération
  - Section "Si le review échoue encore" ajoutée (2 reviews successifs échoués)
  
- `standards/exploration-limits.md` (66 lignes)
  - Limite de profondeur : <5 fichiers, 5-15 fichiers (plan court), >15 fichiers (subagent)
  - Subagent obligatoire pour investigation lourde
  - Objectif précis + portée + résultat attendu
  - Limite tokens : >100 lignes sans réponse → stopper
  - Pas de lecture globale inutile (fnide | xargs cat interdit)

- `standards/error-correction.md` (74 lignes)
  - Règle du 2-strikes
  - Définition clarifiée de "strike" (types spécifiques + contre-exemples)
  - Action de reset : constater, réinitialiser, réécrire l'invite
  - Cas spécifiques : correction sans cause profonde, supprimer un test, modifier un fichier >3 fois
  - Contrôles de cohérence systématiques

- `standards/anti-patterns.md` (68 lignes)
  - 5 patterns d'échec à reconnaître et corriger immédiatement
  - Session fourre-tout, correction en spirale, config sur-spécifiée
  - Écart confiance-puis-vérification, exploration infinie
  - Règle générale : stopper immédiatement, même si perte de travail récent

### Fichiers mis à jour

- `standards/workflow.md` : ajout étape REVIEW (6 étapes au lieu de 5)
- `AGENTS.md` (global) : 4 nouvelles obligations de comportement
- `templates/AGENTS.md` : même obligations + liste 9 standards
- `README.md` : cycle avec REVIEW, 10 standards documentés, architecture à jour

### Claud Code Best Practices couverts

| Claude Code BP | Couverture |
|---------------|------------|
| Examen contradictoire | ✅ review-before-done.md + workflow.md REVIEW |
| Gestion agressive du contexte | ✅ error-correction.md (2-strikes) |
| Délimiter l'exploration | ✅ exploration-limits.md |
| Reconnaître anti-patterns | ✅ anti-patterns.md |
| Éviter correction en boucle | ✅ error-correction.md + workflow.md |

### Non couvert (dépend OpenCode)

- `/clear`, `/compact`, `/rewind`
- Mode auto
- Mode headless (-p)
- Sessions parallèles
- AskUserQuestion

## 2026-06-09 ~12:30 — Fix audit post-intégration

### Corrections

- Renommer `memory.md` → `memory-session-flow.md` pour lever ambiguïté avec `memory-auto-update.md`
- Mise à jour de toutes les références :
  - `README.md` : 3 références corrigées
  - `templates/AGENTS.md` : référence double remplacée par description claire des 3 memory-standards
  - `docs/customization.md` : 4 références corrigées + ajout memory-auto-update et memory-checklist
  - `standards/review-before-done.md` : ajout section "Si le review échoue encore"
  - `standards/error-correction.md` : définition de "strike" clarifiée avec types spécifiques et contre-exemples

### Vérification

- Aucune référence restante à `memory.md` (grep vérifié)
- Fichier `memory-session-flow.md` confirmé présent (3.5K)
- Fichier `memory.md` confirmé supprimé
- Cohérence globale : 8.5/10 → visé 9.5/10

## Historique antérieur

Voir commits précédents pour :
- Intégration mémoire auto-entretenue (2026-06-08)
- Découverte docs/ai/ automatique (2026-06-08)
- Scripts init-project.sh et sync-project.sh (2026-06-08)
