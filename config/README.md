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

Définies dans `~/.config/opencode/.env` (jamais versionné). Template dans `.env.example`.

### Requises

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY_INFOMANIAK` | Clé API Infomaniak AI (console Infomaniak) |
| `OPENAI_BASE_URL` | Endpoint API Infomaniak AI |

### Optionnelles

| Variable | Description |
|----------|-------------|
| `OPENAI_B300_BASE_URL` | Endpoint B300 (instance Kimi K2.6 dédiée, agent `build-b300`) |
| `IDB_UDID` | UDID du simulateur iOS (MCP ios-simulator) |
| `IDB_PATH` | PATH vers les binaires idb (MCP ios-simulator) |
| `INFOMANIAK_API_TOKEN` | Token API Infomaniak (MCP infomaniak) |
| `GITLAB_TOKEN` | Token GitLab (MCP angular-elements) |

## Sécurité

- Les secrets sont externalisés via `{env:...}` dans `opencode.json`
- Le fichier `.env` réel est stocké dans `~/.config/opencode/.env` (jamais dans le repo)
- `setup.sh --force` reconfigure les variables interactivement
- Le hook `pre-commit-secrets.sh` détecte les fuites accidentelles

## Installation

```bash
# setup.sh copie la config interactivement
~/.config/opencode-config/scripts/setup.sh

# install.sh met à jour sans interaction
~/.config/opencode-config/scripts/install.sh
```

La config est copiée vers `~/.config/opencode/opencode.json`.
