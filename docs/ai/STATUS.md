# STATUS

## En cours

## Fait

### 2026-08-06

- Délégation sous-agents : Spark (commit/MR, modèle léger Nemotron Nano 30B) + Vision (multimodal, Mistral-Small-4)
  - Spark : `mode: primary` → `mode: all` (déléguable via `task`)
  - Spark : permissions bash complétées pour `create-mr` (git push/fetch/show-ref/rev-list, rm mr-*.md) + `skill: allow`
  - Spark : prompt enrichi (section Skills commit/create-mr)
  - Aurora : section "Délégation aux sous-agents" ajoutée (Spark par défaut + fallback, Vision pour images)
  - Vision : déjà en `mode: all`, prompt inchangé
  - Synchro repo source : `agents/spark.md` et `agents/vision.md` créés dans le repo
  - Config active `~/.config/opencode/agents/` synchronisée

### 2026-06-28

- Analyse comparative du dossier `plugins` de `ai-driven-dev/framework` branche `next`
- Integration adaptee des recommandations pertinentes :
  - `standards/audit.md`
  - `standards/artifact-authoring.md`
  - review adversarial en axes code/fonctionnel/pertinence
  - lifecycle `PLAN.md` avec `status`
  - `INDEX.md` enrichi avec capacites prouvees
- Documentation et templates synchronises
- Verifications : `bash -n` scripts + dry-runs `init-project.sh` et `sync-project.sh`

### 2026-06-09 ~12:00

- Audit Claude Code best practices : intégration de 4 nouveaux standards
  - `review-before-done.md` : examen contradictoire avant fin de tâche
  - `exploration-limits.md` : délimitation des investigations (>15 fichiers = subagent)
  - `error-correction.md` : règle du 2-strikes + reset obligatoire
  - `anti-patterns.md` : 5 patterns d'échec courants
- Workflow enrichi : ajout étape REVIEW (6 étapes)
- AGENTS.md (global + template) : 4 nouvelles obligations de comportement
- README.md mis à jour avec les 10 standards
- Mise à jour mémoire projet site-manager (media-converter migration terminée)
- Audit de cohérence complet + corrections critiques :
  - Renommer memory.md → memory-session-flow.md pour lever ambiguïté
  - Ajout règle "2 reviews successifs échoués" dans review-before-done.md
  - Clarification définition "strike" dans error-correction.md
  - Correction références croisées (templates/AGENTS.md, README, docs/customization.md)

### 2026-06-09 ~12:30

- Fix audit : corrections des incohérences identifiées lors de l'audit
  - Renommage memory.md → memory-session-flow.md
  - Mise à jour de toutes lesreferences (README, templates/AGENTS, docs/customization.md)
  - Ajout section "Si le review échoue encore" dans review-before-done.md
  - Clarification détaillée de la définition "strike" dans error-correction.md
  - Vérification finale : aucune référence restante à memory.md, cohérence confirmée

## Bloqué

## Prochaine action

- [ ] Redémarrer OpenCode pour activer Spark en mode déléguable (subagent_type `spark`)
- [ ] Tester : Aurora délègue un commit à Spark via `task`
- [ ] Tester : Aurora délègue une analyse d'image à Vision
- [ ] Pusher les changements sur le remote
- [x] Choisir avec l'utilisateur les ameliorations AIDD a implementer en priorite
