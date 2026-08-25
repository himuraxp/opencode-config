# mcp/

MCP (Model Context Protocol) servers pour OpenCode. Chaque serveur expose des tools spécifiques via stdio transport.

## Serveurs

| Serveur | Description | README |
|---------|-------------|--------|
| `infomaniak/` | API Infomaniak — radio, VOD, newsletter, DNS, events, AI, accounts | [README](infomaniak/README.md) |
| `angular-elements/` | Design system Angular Elements — composants, API, stories, install info | [README](angular-elements/README.md) |

## Configuration

Les MCP servers sont déclarés dans `config/opencode.json` :

```json
{
  "mcp": {
    "infomaniak": {
      "type": "local",
      "command": ["node", "{env:HOME}/.config/opencode-config/mcp/infomaniak/dist/index.js"],
      "enabled": true,
      "timeout": 30000,
      "env": {
        "INFOMANIAK_API_TOKEN": "{env:INFOMANIAK_API_TOKEN}"
      }
    },
    "angular-elements": {
      "type": "local",
      "command": ["node", "{env:HOME}/.config/opencode-config/mcp/angular-elements/dist/index.js"],
      "enabled": true,
      "timeout": 30000,
      "env": {
        "GITLAB_TOKEN": "{env:GITLAB_TOKEN}"
      }
    }
  }
}
```

## MCP servers intégrés (npx)

En plus des serveurs locaux ci-dessus, la config inclut deux serveurs auto-installés via npx :

| Serveur | Command | Description |
|---------|---------|-------------|
| `context7` | `npx -y @upstash/context7-mcp` | Documentation à jour des librairies et frameworks |
| `chrome-devtools` | `npx -y chrome-devtools-mcp@latest --headless --isolated` | Debugging navigateur, screenshots, performance traces |
| `ios-simulator` | `npx -y ios-simulator-mcp` | Contrôle du simulateur iOS (screenshots, UI, tap) |

## Développement

```bash
# Build un serveur
cd mcp/<server-name>
npm install
npm run build

# Dev mode (watch)
npm run dev

# Run
npm start
```

## Ajouter un MCP server

1. Créer un dossier `mcp/<server-name>/`
2. Initialiser un projet Node.js avec `@modelcontextprotocol/sdk`
3. Implémenter les tools (voir `angular-elements/` comme exemple)
4. Ajouter l'entrée dans `config/opencode.json` → `mcp.<server-name>`
5. Lancer `npm run update` (ou `./scripts/install.sh`) pour déployer
