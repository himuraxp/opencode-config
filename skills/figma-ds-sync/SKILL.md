---
name: figma-ds-sync
description: Synchronise le Design System Figma d'Infomaniak vers un repo git local de snapshots JSON
---

## Version: 1.0.0

# Figma Design System Sync

Outil CLI pour synchroniser et sauvegarder le Design System Figma d'Infomaniak dans un repo git local avec historique versionné.

## Quand utiliser

- **Avant de commencer un audit DS** — pour avoir une base de référence
- **Régulièrement** — pour suivre l'évolution du Design System
- **Avant une refactorisation** — pour comprendre l'historique des composants
- **Pour exporter le DS** — les JSON normalisés sont exploitables par d'autres outils

## Prérequis

- Node.js v18+ installé
- Token Figma avec accès au fichier "Manager Design System" (ou autre fichier DS)
- Le token doit être défini dans `FIGMA_TOKEN` ou dans `~/.config/opencode/.env`
- Git installé pour l'historique des snapshots

## Commandes

### 1. Vérifier si une sync est nécessaire

```bash
cd /Users/yohannlarbi/.config/opencode-config/mcp/figma-ds
npm run build
node dist/cli.js check
```

Sortie possible :
- `À JOUR` — le snapshot local est à jour (exit code 0)
- `SYNC REQUIS (lastModified X > sync du Y)` — une sync est nécessaire (exit code 1)
- `Quota Figma épuisé` — impossible de vérifier maintenant (exit code 2)

Le check fait **1 seule requête** sur `/versions` (jamais bloqué par le quota de contenu).

### 2. Lancer une synchronisation complète

```bash
node dist/cli.js sync
```

Cette commande :
1. Capture les métadonnées du fichier (1 appel `/files?depth=2` réutilisé pour la structure ; si Figma le bloque par quota → fallback `/versions`)
2. Capture les styles (~118 : fill, text, effect, grid) — valeurs résolues uniquement si `/nodes` est accessible
3. Capture les composants (~1992) et component sets (~224) via les endpoints dédiés
4. Tente de capturer les variables (peut échouer en 403 si le token n'a pas le scope)
5. Écrit les fichiers JSON normalisés dans `~/dev/infomaniak-ds-snapshots/` **uniquement si un changement est détecté**
6. Génère un CHANGELOG.md avec le diff
7. Commit dans le repo git si des changements sont détectés (sinon rien n'est écrit)

### Exit codes

| Code | Signification |
|------|---------------|
| 0 | OK (sync fait, ou à jour, ou aucun changement) |
| 1 | Sync requise (check) ou erreur (sync) |
| 2 | Quota Figma épuisé (check) |

### Comportement quand le quota Figma est épuisé

Figma bloque les endpoints de **contenu** (`/files/{key}`, `/nodes`) avec un quota lié au plan du compte (429 + Retry-After long). Le CLI :
- **ne boucle jamais** : fail-fast avec `FigmaQuotaError` et la date de reset estimée
- bascule sur les endpoints dédiés (jamais bloqués) : `/versions`, `/styles`, `/components`, `/component_sets`
- marque `meta.contentStatus: "gated"` et exclut la structure des pages du diff (pas de faux « pages supprimées »)
- se réactive automatiquement quand le quota est restauré

### 3. Voir le diff entre snapshots

```bash
node dist/cli.js diff
```

Affiche les métadonnées du snapshot actuel et du précédent commit git.

## Options

### Fichier Figma personnalisé

Par défaut, le CLI utilise le fichier `J09Rdl0amcTh5VetJmnUL5` (Manager Design System).

Pour utiliser un autre fichier :

```bash
node dist/cli.js sync --file=YOUR_FILE_KEY
```

### Répertoire de snapshots personnalisé

Par défaut, les snapshots sont stockés dans `~/dev/infomaniak-ds-snapshots`.

Pour changer le répertoire :

```bash
export FIGMA_DS_SNAPSHOTS_DIR=/path/to/snapshots
node dist/cli.js sync
```

## Structure de sortie

Le repo de snapshots contient :

```
~/dev/infomaniak-ds-snapshots/
├── meta.json              # Métadonnées (file_key, lastModified, counts, contentStatus, variables status)
├── structure.json         # Arborescence des pages (depth 2) — { status, pages: [] } si quota gated
├── styles.json            # Liste des styles normalisés (+ resolvedValue si /nodes accessible)
├── components.json        # Composants, component sets, component properties + componentPropertiesStatus
├── variables.json         # Statut des variables (available/unavailable)
├── CHANGELOG.md           # Historique des syncs avec diffs
└── raw/                   # Payloads API bruts (pour debug, non commités)
    ├── file-*.json
    ├── styles-meta-*.json
    ├── components-meta-*.json
    ├── component-sets-meta-*.json
    └── nodes-batch-*.json
```

## Format des données normalisées

### styles.json

```json
[
  {
    "key": "abc123",
    "file_key": "def456",
    "node_id": "0:123",
    "name": "Primary / Large",
    "style_type": "fill",
    "description": "Main brand color"
  }
]
```

### components.json

```json
{
  "components": [
    {
      "key": "xyz789",
      "node_id": "1:456",
      "name": "Button / Primary",
      "description": "Primary action button"
    }
  ],
  "componentSets": [...],
  "componentProperties": [...]
}
```

### meta.json

```json
{
  "file_key": "J09Rdl0amcTh5VetJmnUL5",
  "file_name": "Manager Design System",
  "lastModified": "2026-08-31T08:35:32Z",
  "version": "2393807010337623540",
  "syncedAt": "2026-09-03T12:00:00.000Z",
  "contentStatus": "gated",
  "counts": {
    "pages": 0,
    "styles": 118,
    "components": 1992,
    "componentSets": 224
  },
  "variables": {
    "status": "unavailable",
    "reason": "Token missing variables scope"
  }
}
```

`contentStatus` : `"available"` si `/files` était accessible (structure + lastModified exacts), `"gated"` si Figma a bloqué le contenu par quota (fallback `/versions`, structure vide).

## Lecture du CHANGELOG.md

Le CHANGELOG est généré automatiquement à chaque sync. Exemple :

```markdown
## Sync du 2026-09-03

**Fichier**: Manager Design System (J09Rdl0amcTh5VetJmnUL5)
**Dernière modification**: 2026-08-31T08:47:36Z
**Variables**: ✗ (Token missing variables scope)

### Changelog

#### Styles (3 changements)
- ✚ 1 ajouté(s)
- ~ 2 modifié(s)

#### Composants (5 changements)
- ✚ 2 ajouté(s)
- ✖ 1 supprimé(s)
- ~ 2 modifié(s)

---
```

## Questions fréquentes

### Les variables sont "unavailable" — c'est normal ?

Oui, si votre token Figma n'a pas le scope `variables:read`. Pour activer la capture des variables :

1. Régénérez votre token Figma avec le scope `variables:read`
2. Mettez à jour `FIGMA_TOKEN` dans `~/.config/opencode/.env`
3. Relancez `sync` — la capture s'activera automatiquement

### Combien de temps prend une sync ?

Typiquement 5-10 secondes et ~8 requêtes (endpoints dédiés) tant que `/files` est gated. Le CLI throttle à 100 req/min.

### Peut-on planifier des syncs automatiques ?

Pas nativement, mais vous pouvez utiliser un cron (le CLI ne suspend jamais : fail-fast sur quota) :

```bash
# Exemple : sync quotidienne à 8h
0 8 * * * cd /Users/yohannlarbi/.config/opencode-config/mcp/figma-ds && node dist/cli.js sync
```

## Limitations connues

- **Variables** : Nécessite le scope `variables:read` sur le token Figma
- **Contenu du fichier** (`/files`, `/nodes`) : bloqué par un quota lié au plan (429 + Retry-After long) → structure et valeurs résolues absentes du snapshot tant que le quota est actif ; le reste continue
- **Component properties** : budget de 60 sets max (tronqué à 50 ids/run) — `componentPropertiesStatus: "partial"` dans components.json si tronqué, `"skipped"` au-delà du budget
- **Rate limit** : throttle client 100 req/min, Retry-After respecté pour les bursts (max 3), fail-fast sur quota long

## Dépannage

### Erreur "FIGMA_TOKEN not found"

```bash
# Vérifier la variable d'environnement
echo $FIGMA_TOKEN

# Ou ajouter dans ~/.config/opencode/.env
echo "FIGMA_TOKEN=figd_..." >> ~/.config/opencode/.env
```

### Erreur "403 Invalid scope(s)" sur les variables

C'est normal si le token n'a pas le scope `variables:read`. La sync continue quand même avec les autres données.

### Git commit échoue

Vérifiez que git est configuré :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```
