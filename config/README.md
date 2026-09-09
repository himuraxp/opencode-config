# config/

Configuration globale OpenCode. Ce dossier contient la config principale, les variables d'environnement, les plugins et la config du plugin oh-my-opencode-slim.

## Fichiers

| Fichier | Description |
|---------|-------------|
| `opencode.json` | Configuration principale — providers, modèles, agents, permissions, MCP servers |
| `.env.example` | Template des variables d'environnement (sans secrets). Copier vers `~/.config/opencode/.env` |
| `oh-my-opencode-slim.json` | Configuration du plugin oh-my-opencode-slim (presets, modèles, skills) |
| `package.json` | Dépendances npm pour les plugins |

## Sous-dossiers

| Dossier | Description |
|---------|-------------|
| `plugins/` | Plugins OpenCode (voir `plugins/README.md`) |

## Variables d'environnement

OpenCode ne charge **pas** les fichiers `.env` : les références `{env:VAR}` dans `opencode.json`
lisent uniquement l'environnement du shell. D'où le modèle :

- **Clé API Infomaniak AI** : une seule copie, exportée dans le shell rc de l'utilisateur
  (`~/.zshrc`, bloc managé écrit par `setup.sh`, idempotent). Lue via
  `{env:OPENAI_API_KEY_INFOMANIAK}`. Pas de duplication (ni `.env`, ni fichier séparé).
- **Autres variables** : dans `~/.config/opencode/.env` (template `.env.example`),
  lues par les MCP servers (fallback manuel dans leur code) et les outils (figma-ds).

> **Important** : ne **jamais** dupliquer la clé ailleurs (pas de copie dans `.env`
> ni dans un fichier `secrets/`). Pour changer la clé : `setup.sh --force` (Enter
> pour garder, ou nouvelle valeur).
>
> **Export préexistant** : si la clé est déjà exportée librement dans le rc (sans le
> bloc managé), `setup.sh` la **déplace** dans le bloc — elle n'est jamais dupliquée.
> Une référence `$VAR` (ex. `"$OPENAI_API_KEY"`) est préservée telle quelle ; la
> variable source elle-même reste intouchée.

### Requises (shell rc, bloc managé par setup.sh)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY_INFOMANIAK` | Clé API Infomaniak AI (console Infomaniak) — exportée dans le shell rc |
| `IDB_UDID` | UDID du simulateur iOS (MCP ios-simulator — lit uniquement l'environnement, pas de fallback `.env`) |
| `IDB_PATH` | PATH vers les binaires idb (MCP ios-simulator) |

### Optionnelles (dans `~/.config/opencode/.env`)

| Variable | Description |
|----------|-------------|
| `INFOMANIAK_API_TOKEN` | Token API Infomaniak (MCP infomaniak — fallback `.env` dans son code) |
| `GITLAB_TOKEN` | Token GitLab (MCP angular-elements — fallback `.env` dans son code) |
| `FIGMA_TOKEN` | Token Figma (figma-ds) |

Les endpoints API Infomaniak (standard + B300) sont définis directement dans `opencode.json`
(valeurs non secrètes, stables).

**Trade-off connu** : un OpenCode lancé depuis une GUI qui n'hérite pas du shell
(launcher, Spotlight) n'aura pas la clé → 401 sur le provider Infomaniak. Les
terminaux (TUI, VS Code) sont des login shells et fonctionnent.

## Sécurité

- La clé API Infomaniak AI vit dans le shell rc de l'utilisateur (bloc managé par `setup.sh`, une seule copie) et est lue via `{env:...}` dans `opencode.json`
- Le fichier `.env` réel est stocké dans `~/.config/opencode/.env` (jamais dans le repo)
- `setup.sh --force` reconfigure les variables interactivement
- Le hook `pre-commit-secrets.sh` détecte les fuites accidentelles

## Installation

```bash
# setup copie la config interactivement
npm run setup
# ou: ~/.config/opencode-config/scripts/setup.sh

# install met à jour sans interaction
npm run update
# ou: ~/.config/opencode-config/scripts/install.sh
```

La config est copiée vers `~/.config/opencode/opencode.json`.
