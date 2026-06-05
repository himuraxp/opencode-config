# opencode-config v2

Configuration OpenCode forkable pour standardiser le comportement des agents sur toutes les machines et tous les projets.

## Objectif

- Installer des agents globaux dans `~/.config/opencode/agent`.
- Initialiser rapidement un projet avec un `AGENTS.md` solide.
- Garder les règles locales du projet prioritaires.
- Fournir une base Angular 20 Infomaniak prête à l'emploi.

## Installation globale

```bash
git clone <ton-fork> ~/.config/opencode-config
cd ~/.config/opencode-config
./scripts/install.sh
```

## Initialiser un projet

Depuis la racine du projet :

```bash
~/.config/opencode-config/scripts/init-project.sh
```

Cela ajoute :

```txt
AGENTS.md
.opencode/agent/
docs/ai/PLAN.md
docs/ai/STATUS.md
docs/ai/DECISIONS.md
docs/ai/CHANGELOG.md
```

## Synchroniser un projet existant

```bash
~/.config/opencode-config/scripts/sync-project.sh
```

Par défaut, le script n'écrase pas les fichiers existants. Il crée des fichiers `.new` si une version existe déjà.

## Principe de priorité

1. Instructions explicites de la tâche en cours.
2. `AGENTS.md` local du projet.
3. Agents `.opencode/agent/` du projet.
4. Agents globaux `~/.config/opencode/agent/`.
5. Bonnes pratiques générales.

## Structure recommandée projet

```txt
project-root/
  AGENTS.md
  .opencode/
    agent/
      project.md
      angular-20.md
      review.md
  docs/
    ai/
      PLAN.md
      STATUS.md
      DECISIONS.md
      CHANGELOG.md
```
