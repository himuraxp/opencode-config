# STATUS

## En cours

## Fait

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
