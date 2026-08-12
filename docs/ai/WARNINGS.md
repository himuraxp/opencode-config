# WARNINGS

## Warnings actifs

- [ ] **Sécurité — Permissions opencode.json permissives par choix utilisateur** : `curl`, `kill`, `find`, `sed` restent en `allow` par décision utilisateur — Aurora doit rester autonome sans interaction humaine. Ce n'est pas un bug, c'est un choix délibéré. **Risques acceptés** : `curl` permet l'exfiltration silencieuse de données (POST vers un endpoint externe) ; `kill` permet de tuer n'importe quel process ; `sed -i` permet la modification in-place de fichiers arbitraires ; `find -exec` peut exécuter des commandes. **Garde-fous envisageables** (non appliqués) : `curl https://*` (HTTPS only), `kill *node*`, `sed -i` en `ask`.
- [ ] `docs/ai/` etait incomplet au demarrage de la session du 2026-06-28 : seuls `STATUS`, `CHANGELOG` et `BUFFER` existaient. Les fichiers manquants ont ete ajoutes.
- [ ] Les idees AIDD liees a Claude (`.claude-plugin`, hooks Claude, skills Claude) ne doivent pas etre integrees telles quelles sans adapter explicitement au fonctionnement OpenCode.

## Dettes techniques connues

- La memoire locale de ce repo doit rester alignee avec les templates injectes dans les projets utilisateurs.
- Les futures ameliorations inspirees d'AIDD doivent eviter de creer une deuxieme taxonomie concurrente avec `standards/`, `agents/`, `frameworks/`.
- `install.sh --prune` supprime les `.md` orphelins dans les dossiers installes ; a utiliser seulement quand `~/.config/opencode/{agents,standards,frameworks}` est gere par ce repo.
- Le dossier `~/.config/opencode/agent/` (singulier) a été supprimé (2026-08-12, était vide).

## Zones sensibles du projet

- `AGENTS.md`
- `config/opencode.json` — permissions bash permissives par choix utilisateur (curl, kill, find, sed en `allow`)
- `config/oh-my-opencode-slim.json` — preset `opencode-go` supprimé (provider non disponible)
- `standards/memory-*.md` — 3 fichiers à maintenir en sync (session-flow, auto-update, checklist)
- `templates/AGENTS.md`
- `scripts/init-project.sh`
- `scripts/sync-project.sh`

## Workarounds existants

- Aucun workaround actif identifie.

## Historique des warnings clotures

### 2026-08-12 — Preset `opencode-go` sans provider

- Warning : le preset `opencode-go` dans `oh-my-opencode-slim.json` référençait un provider non défini dans `opencode.json` → échec silencieux si sélectionné.
- Resolution : preset supprimé du JSON (provider non disponible, non utilisé).
- Date cloture : 2026-08-12

### 2026-08-12 — `cat *: allow` sur Spark

- Warning : `cat *: allow` permettait la lecture de fichiers sensibles (`.env`, `~/.ssh/id_rsa`).
- Resolution : restreint à `cat ./mr-*.md` + `cat ./*.md` via F-04 (audit 2026-08-12).
- Date cloture : 2026-08-12

### 2026-08-09 — `aurora-heavy.md` non versionné

- Warning : `aurora-heavy.md` était présent dans la config active (`~/.config/opencode/agents/`) mais non versionné dans le repo source. Perdu à la prochaine reinstall propre.
- Resolution : ajouté au repo `agents/aurora-heavy.md` (STATUS.md L118, CHANGELOG.md L25).
- Date cloture : 2026-08-09

### 2026-06-28 — Artefact `memory.md` obsolete installe

- Warning : la config installee contenait encore `~/.config/opencode/standards/memory.md`.
- Resolution : ajout de `install.sh --prune` et execution sur ce Mac.
- Date cloture : 2026-06-28

### 2026-06-28 — Exemples en retard

- Warning : `examples/angular-app` documentait encore un workflow sans Review.
- Resolution : exemple Angular aligne, exemples Node/monorepo clarifies comme structures cibles.
- Date cloture : 2026-06-28

### 2026-06-28 — `.new` ecrasable

- Warning : `sync-project.sh` pouvait ecraser un fichier `.new` existant.
- Resolution : creation de propositions horodatees si `.new` existe deja.
- Date cloture : 2026-06-28
