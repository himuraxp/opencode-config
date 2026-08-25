# frameworks/

Règles et conventions par stack technique. Chaque fichier définit les patterns, structures et bonnes pratiques à appliquer quand un projet utilise la stack correspondante.

## Frameworks supportés

| Framework | Fichier | Détection |
|-----------|---------|-----------|
| Angular 20 | `angular-20.md` | `angular.json` ou `.angular-cli.json` |
| NestJS | `nestjs.md` | `nest-cli.json` |
| Astro | `astro.md` | `astro.config.*` |
| Node.js | `nodejs.md` | `package.json` (fallback) |

## Détection automatique

Le script `scripts/init-project.sh` détecte la stack du projet et ajoute automatiquement la référence au framework approprié dans le `AGENTS.md` local.

```bash
cd /path/to/project
~/.config/opencode-config/scripts/init-project.sh
```

## Application

Les frameworks sont appliqués par ordre décroissant de spécificité :

```
Standards globaux → Agents globaux → Frameworks globaux → AGENTS.md projet
```

Le framework fournit des règles spécifiques (structure de dossiers, naming, patterns de test, etc.) qui s'ajoutent aux standards globaux sans les remplacer.

## Ajouter un framework

1. Créer un fichier `<framework-name>.md`
2. Documenter : structure, conventions, patterns, tests, dépendances
3. Ajouter la détection dans `scripts/init-project.sh`
4. Lancer `scripts/install.sh` pour déployer

Voir `standards/artifact-authoring.md` pour les règles de création homogène.
