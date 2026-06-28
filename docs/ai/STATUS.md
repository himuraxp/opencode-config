# STATUS

## En cours

## Fait

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

- [ ] Pusher les changements sur le remote
- [ ] Optionnel : tester sur un nouveau projet que la mémoire docs/ai/ fonctionne correctement avec le nouveau workflow
- [x] Choisir avec l'utilisateur les ameliorations AIDD a implementer en priorite
