# config/plugins/

Plugins OpenCode écrits en TypeScript. Les plugins étendent le comportement d'OpenCode via des hooks sur le cycle de vie des tools.

## Plugins

### rtk.ts

Plugin RTK (Rewrite ToolKit) — réécrit les commandes bash pour économiser des tokens.

**Fonctionnement :**
1. Intercepte `tool.execute.before` pour les tools `bash`/`shell`
2. Délègue à `rtk rewrite <command>` pour la réécriture
3. Remplace la commande si `rtk` a produit une version réécrite
4. Passthrough silencieux si `rtk` n'est pas installé ou échoue

**Dépendance :**
- `rtk` >= 0.23.0 dans `PATH`

**Source de vérité :**
Toute la logique de réécriture vit dans `rtk` (Rust, `src/discover/registry.rs`). Ce plugin est un thin delegator — pour modifier les règles de réécriture, éditer le registry Rust, pas ce fichier.

**Installation :**
- `setup.sh` installe `rtk` automatiquement
- Le plugin est chargé via `config/oh-my-opencode-slim.json` → `plugin`

## Ajouter un plugin

1. Créer un fichier `<plugin-name>.ts` dans ce dossier
2. Exporter un objet `Plugin` depuis `@opencode-ai/plugin`
3. Implémenter les hooks nécessaires (`tool.execute.before`, `tool.execute.after`, etc.)
4. Ajouter les dépendances npm dans `config/package.json`
5. Lancer `scripts/install.sh` pour déployer
6. Référencer le plugin dans `config/oh-my-opencode-slim.json` si applicable

## API Plugin

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ $ }) => {
  return {
    "tool.execute.before": async (input, output) => {
      // Intercepter avant exécution
    },
    "tool.execute.after": async (input, output) => {
      // Intercepter après exécution
    },
  }
}
```
