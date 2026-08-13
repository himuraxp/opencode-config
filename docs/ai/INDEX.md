# INDEX

## Structure générale

```txt
racine/
├── config/      Config OpenCode (opencode.json, plugins, .env.example — sans secrets)
├── agents/      Personnalités spécialisées (17 agents)
├── standards/   Comportements universels (16 standards)
├── frameworks/  Règles par stack technique (4 frameworks)
├── templates/   Fichiers injectés dans les projets (AGENTS.md, docs/ai/*)
├── scripts/     Installation, initialisation et synchronisation projet
├── docs/        Documentation utilisateur
└── examples/    Exemples d'intégration (angular-app, node-api, monorepo)
```

## Modules principaux

| Module | Chemin | Responsabilité |
|--------|--------|----------------|
| Config | `config/` | Providers, models, permissions, MCP servers, presets oh-my-opencode-slim |
| Standards | `standards/` | Workflow, verification, communication, memoire, review, audit, creation d'artefacts, limites d'exploration, format de retour JSON des sous-agents, delegation-failure |
| Agents | `agents/` | 17 agents : aurora, aurora-heavy, reviewer, tester, security, architect, spark, vision, atlas, crawler, sage, scribe, pulse, echo, beacon, designer, mobile |
| Frameworks | `frameworks/` | Conventions Angular 20, Node.js, NestJS, Astro |
| Templates | `templates/` | AGENTS.md et documents `docs/ai/` pour projets utilisateurs |
| Scripts | `scripts/` | setup.sh (install), install.sh (sync), init-project.sh (auto-détection stack), sync-project.sh, health-check.sh, permissions-matrix.sh, validate-memory.sh, hooks/pre-commit-secrets.sh |
| Examples | `examples/` | angular-app (complet), node-api (AGENTS.md + README), monorepo (AGENTS.md + README) |

## Fichiers clés

| Fichier | Role |
|---------|------|
| `AGENTS.md` | Instructions racine du repo |
| `README.md` | Documentation principale |
| `config/opencode.json` | Providers (infomaniak, infomaniak-b300), models, permissions bash, MCP (context7, chrome-devtools, ios-simulator) |
| `config/oh-my-opencode-slim.json` | Presets sous-agents (euria-code), 9 agents déclarés (7 Search & Growth + designer + mobile) |
| `standards/workflow.md` | Cycle Explorer → Planifier → Implémenter → Review → Vérifier → Committer |
| `standards/agent-output.md` | Format de retour JSON structuré pour les sous-agents |
| `standards/memory-checklist.md` | Checklist obligatoire de persistance memoire |
| `standards/review-before-done.md` | Review adversarial avant fin de tache |
| `standards/audit.md` | Audit read-only multi-axes |
| `standards/artifact-authoring.md` | Creation homogene de standards, agents, frameworks et templates |
| `standards/delegation-failure.md` | Procedure obligatoire après echec de sous-agent |
| `scripts/setup.sh` | Installation complète interactive (première fois) |
| `scripts/install.sh` | Synchronisation config globale (mise à jour) |
| `scripts/init-project.sh` | Initialisation d'un projet avec AGENTS.md et docs/ai |
| `scripts/sync-project.sh` | Synchronisation non destructive des templates |

## Agents (17)

| Agent | Rôle | Modèle |
|-------|------|--------|
| `aurora.md` | Agent principal et coordinateur | euria-code |
| `aurora-heavy.md` | Tâches complexes (mode primary) | Qwen 397B |
| `reviewer.md` | Code review stricte | euria-code |
| `tester.md` | Tests Jest + Angular | euria-code |
| `security.md` | Risques et remédiations | euria-code |
| `architect.md` | Découpage technique | euria-code |
| `spark.md` | Sous-agent léger (commit, MR) | Ministral-3 |
| `vision.md` | Sous-agent multimodal (images) | Mistral-Small-4 |
| `atlas.md` | SEO Strategy | Qwen 397B |
| `crawler.md` | Technical SEO | euria-code |
| `sage.md` | AIO / GEO | Qwen 397B |
| `scribe.md` | SEO Content | euria-code |
| `pulse.md` | Growth Marketing | euria-code |
| `echo.md` | Social Distribution | Mistral-Small-4 |
| `beacon.md` | Analytics | euria-code |
| `designer.md` | UX/UI Designer, DA, DS, accessibilité | Mistral-Small-4 |
| `mobile.md` | Mobile Engineer (iOS/Android/RN/Flutter) | euria-code |

## Standards (16)

| Standard | Role |
|----------|------|
| `workflow.md` | Cycle de travail (6 étapes) |
| `communication.md` | Style de réponse |
| `verification.md` | Vérifications build/lint/test |
| `memory-session-flow.md` | Lecture mémoire en début de session |
| `memory-auto-update.md` | Persistance mémoire en fin de session |
| `memory-checklist.md` | Checklist de fin de session |
| `review-before-done.md` | Examen contradictoire avant fin |
| `audit.md` | Audit read-only multi-axes |
| `exploration-limits.md` | Délimitation des investigations |
| `error-correction.md` | Règle des 2 corrections échouées |
| `anti-patterns.md` | Détection des 5 patterns d'échec |
| `artifact-authoring.md` | Création homogène d'artefacts |
| `delegation-failure.md` | Procédure après échec de sous-agent |
| `agent-output.md` | Format de retour JSON des sous-agents |
| `escalation.md` | Gestion des blocages |
| `commits.md` | Format et règles de commit |

## Points d'entrée applicatifs

- `scripts/setup.sh` — Première installation
- `scripts/install.sh` — Mise à jour config globale
- `scripts/init-project.sh` — Initialisation projet
- `scripts/sync-project.sh` — Sync templates projet

## Conventions locales importantes

- Le `AGENTS.md` local du projet utilisateur l'emporte toujours.
- La mémoire projet attendue vit dans `docs/ai/`.
- Les changements doivent rester simples, maintenables, et compatibles avec OpenCode.
- Permissions bash permissives (curl, kill, sed, find en `allow`) par choix utilisateur documenté.
- `cat *` en `deny` sur les sous-agents (tool `read` natif suffit), `ask` sur aurora-heavy.

## Commandes de recherche utiles

```bash
rg --files standards agents frameworks templates scripts docs
rg "docs/ai|memory|REVIEW|review" .
```
