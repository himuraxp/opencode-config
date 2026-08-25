# STATUS

## En cours

## Fait

### 2026-08-25 — CI/CD automation + Dependabot + Stale bot

- `.github/dependabot.yml` créé — 3 écosystèmes npm (config, mcp/angular-elements, mcp/infomaniak) + github-actions, weekly, grouping patch/minor
- `.github/workflows/ci.yml` créé — health-check (JSON, bash syntax, frontmatter, memory, permissions) + MCP build (matrix angular-elements + infomaniak, tsc --noEmit)
- `.github/workflows/stale.yml` créé — close issues/PRs inactifs après 30+7 jours, exempt pinned/security
- `scripts/health-check.sh` corrigé — exclusion README.md dans les 3 boucles de scan agents
- `scripts/permissions-matrix.sh` corrigé — exclusion README.md dans la boucle de génération

### 2026-08-25 — READMEs MCP + corrections cohérence

- `mcp/angular-elements/README.md` créé (architecture, 7 tools, config, dev, caching)
- 12 READMEs créés pour couvrir tous les répertoires significatifs :
  - `agents/README.md` — 18 agents, rôles, architecture de collaboration
  - `standards/README.md` — 16 standards, catégories, ordre d'application
  - `skills/README.md` — 17 skills, catégories, structure, ajout
  - `scripts/README.md` — 8 scripts, usage, dépendances, ui.sh
  - `config/README.md` — opencode.json, .env, variables, sécurité
  - `mcp/README.md` — 5 MCP servers, config, dev, ajout
  - `frameworks/README.md` — 4 frameworks, détection auto, application
  - `templates/README.md` — 5 templates, workflow init/sync, structure
  - `docs/README.md` — 6 guides, navigation, relation avec standards
  - `scripts/hooks/README.md` — pre-commit-secrets, patterns, installation
  - `templates/project-docs/README.md` — BUFFER/INDEX/WARNINGS, cycle de vie
  - `config/plugins/README.md` — rtk.ts, API Plugin, ajout
- `config/.env.example` — `GITLAB_TOKEN` ajouté (requis par MCP angular-elements)
- `README.md` root — MCP servers (5 au lieu de 2), env vars (+2), structure repo (+mcp/), skills (17 au lieu de 15)
- `AGENTS.md` root — agents (18 avec cybersec/explorer/fixer/librarian/oracle), skills (17 avec allow-command/radio-tag-genres), +dossier mcp/
- `docs/customization.md` — cybersec ajouté à la table agents
- `docs/ai/INDEX.md` — 18 agents (cybersec ajouté), mcp/ dans la structure

### 2026-08-25 — Permissions bash aurora (allow-command)

- `config/opencode.json` — patterns ajoutés à l'agent aurora : `cut *`, `exit *`, `git config *`, `git describe *`, `git remote *`

### 2026-08-21 — Scripts d'installation animés (Aurora UI)

- `scripts/ui.sh` créé — bibliothèque d'animations console (logo, sections, spinner, progress bar, typewriter)
- `scripts/setup.sh` refactorisé — logo Aurora, sections animées, `--no-animation` flag
- `scripts/install.sh` refactorisé — logo, sections, progress bar pour copie de fichiers, `--no-animation` flag
- Logo ASCII art "Aurora" en police `roman` (figlet) avec sous-titre "(OpenCode Config)" — fade-in animé
- Palette 256 couleurs ANSI (turquoise bright, gold, green, red, etc.)
- Box-drawing Unicode pour les headers de section (╭─╮ │ ╰─╯)
- Spinner braille (⠋⠙⠹) pendant les opérations longues
- Typewriter effect pour le résumé final
- Compatible macOS (bash 3.2+) et Linux (bash 4+), zéro dépendance externe
- Désactivable via `--no-animation` pour CI/SSH non-interactif
- Config active synchronisée (`~/.config/opencode/scripts/ui.sh`)

### 2026-08-12 — Création agents designer + mobile (17 agents)

- `agents/designer.md` créé (UX, UI, DA, DS, accessibilité, mockups — Mistral-Small-4 multimodal)
- `agents/mobile.md` créé (iOS, Android, React Native, Flutter — euria-code)
- `oh-my-opencode-slim.json` mis à jour (9 agents déclarés : 7 S&G + designer + mobile)
- `aurora.md` mis à jour (règles de délégation designer + mobile)
- `AGENTS.md`, `README.md`, `docs/customization.md` mis à jour (tables agents)
- `setup.sh` mis à jour (vérification 17 agents)
- `docs/ai/INDEX.md` mis à jour (17 agents)

### 2026-08-12 — Audit + corrections + durcissement + synchro + 5 scripts utilitaires

- Audit read-only : 11 findings identifiés (3 high, 5 medium, 2 low, 1 info)
- 10 findings corrigés (voir CHANGELOG.md pour le détail)
- Preset `opencode-go` supprimé (provider non disponible)
- Modèle Spark aligné → Ministral-3 (doc ↔ code)
- `cat *` restreint sur Spark, mis en `deny` sur 7 sous-agents, `ask` sur aurora-heavy
- `memory.md` orphelin supprimé de la config active (`install.sh --prune`)
- BUFFER.md nettoyé (304 → 33 lignes), STATUS.md allégé (263 → 42 lignes)
- Examples complétés (node-api, monorepo), `examples/angular-app/AGENTS.md` synchronisé
- `docs/testing.md` multi-stack, `docs/workflow.md` référence agent-output.md
- INDEX.md mis à jour (15 agents, 16 standards), DECISIONS.md enrichi (3 décisions)
- 5 nouveaux scripts utilitaires :
  - `health-check.sh` — vérifie JSON, frontmatter agents, modèles, orphelins, références
  - `permissions-matrix.sh` — génère un tableau markdown des permissions de tous les agents
  - `validate-memory.sh` — valide la structure `docs/ai/` d'un projet
  - `hooks/pre-commit-secrets.sh` — hook git anti-fuite de secrets
  - `init-project.sh` — auto-détection de stack (angular.json, nest-cli.json, astro.config.*, package.json)

### 2026-08-11 — Standard agent-output.md

- Format de retour JSON structuré pour tous les sous-agents (schéma v1, 12 catégories, 5 sévérités)
- 13 agents mis à jour avec section "Format de retour JSON"

### 2026-08-10 — Fix auth + Search & Growth + audit 54 findings

- Fix collision `OPENAI_API_KEY` → `OPENAI_API_KEY_INFOMANIAK`
- 7 agents Search & Growth créés (atlas, crawler, sage, scribe, pulse, echo, beacon)
- Routing Search & Growth automatique + mots-clés déclencheurs + multi-agents
- 54 findings d'audit corrigés sur 55 (sécurité permissions = choix utilisateur)

> Historique complet : voir `CHANGELOG.md`

## Bloqué

## Prochaine action

- [ ] Commiter les changements (scripts/ui.sh + setup.sh + install.sh)
- [ ] Redémarrer OpenCode pour activer les 17 agents
- [ ] Tester : Aurora délègue un commit à Spark via `task`
- [ ] Tester : Aurora délègue une analyse d'image à Vision
- [ ] Tester : Aurora délègue une stratégie SEO à Atlas via `task`
- [ ] Tester : Aurora délègue un design UI à Designer via `task`
- [ ] Tester : Aurora délègue du code mobile à Mobile via `task`
