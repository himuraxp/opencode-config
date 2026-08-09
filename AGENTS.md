# AGENTS.md — opencode-config

Ce dépôt contient la configuration globale OpenCode de référence.

## Architecture multi-couches

Ce repo sépare les responsabilités en 4 couches :

```txt
config/      Configuration OpenCode (opencode.json, plugins, .env.example — sans secrets)
agents/      Personnalités spécialisées (aurora, aurora-heavy, reviewer, tester, security, architect, spark, vision)
standards/   Comportements universels (workflow, communication, verification, memory, review, audit, anti-patterns...)
frameworks/  Règles par stack technique (angular-20, nodejs, nestjs, astro)
```

Plus 3 dossiers de support :

```txt
scripts/     Installation et maintenance (setup.sh, install.sh, init-project.sh, sync-project.sh)
templates/   Fichiers injectés dans les projets (AGENTS.md, docs/ai/*)
docs/        Guides utilisateur
```

## Mémoire projet auto-entretenue

Aurora DOIT maintenir automatiquement la mémoire du projet. Avant de rendre la main à l'utilisateur, l'agent DOIT vérifier la persistance de la mémoire via le `memory-checklist.md`.

### Processus obligatoire

1. **Lire** `docs/ai/` au démarrage de chaque session (STATUS, PLAN, INDEX, BUFFER, WARNINGS, DECISIONS)
2. **Mettre à jour** `docs/ai/` à la fin de chaque session :
   - `STATUS.md` — tâches en cours / fait / bloqué / prochaine action
   - `PLAN.md` — avancement des étapes
   - `CHANGELOG.md` — entrée datée des modifications
   - `BUFFER.md` — snapshot reprise + fichiers impactés
   - `INDEX.md` — modules et fichiers clés découverts
   - `WARNINGS.md` — zones sensibles et dettes techniques
   - `DECISIONS.md` — décisions architecturales prises

3. **Zero intervention** : l'utilisateur ne doit JAMAIS avoir à demander la mise à jour de la mémoire.

### Si `docs/ai/` est vide (templates vides)

Aurora DOIT :
- Extraire la structure du projet du contexte de travail
- Remplir `INDEX.md` avec les modules, composants, services identifiés
- Documenter dans `BUFFER.md` les premières observations
- Créer un `PLAN.md` si une tâche est en cours

### Hiérarchie de responsabilité mémoire

`/AGENTS.md` doit contenir une section mémoire ou référencer `docs/ai/`. Si absent, Aurora applique ce standard global automatiquement.

## Règle principale

Ne jamais modifier un projet utilisateur sans respecter son `AGENTS.md` local. Le fichier local est la source de vérité du projet.

## Installation

### Première installation (nouvelle machine)

```bash
git clone https://github.com/himuraxp/opencode-config.git ~/.config/opencode-config
~/.config/opencode-config/scripts/setup.sh
```

`setup.sh` est interactif : il installe `opencode-ai`, `rtk`, propose les MCP servers, copie la config, demande les secrets et vérifie l'installation.

### Mise à jour

```bash
cd ~/.config/opencode-config && git pull && ./scripts/install.sh
```

`install.sh` track les changements (new/updated/unchanged) et ne copie que les fichiers modifiés. Options : `--prune` (nettoyer orphelins), `--no-config` (ignorer config/), `--dry-run`.

### Secrets

Les secrets sont externalisés via `{env:...}` dans `config/opencode.json` et stockés dans `~/.config/opencode/.env` (jamais versionné). `setup.sh --force` reconfigure les variables.

## MCP Servers

La configuration inclut deux MCP servers :

- **chrome-devtools** : auto-installé via `npx` (aucune action manuelle)
- **ios-simulator** (macOS) : optionnel — nécessite `idb-companion` (Homebrew) + `fb-idb` (Python venv). `setup.sh` propose l'installation.

## Comportement attendu

- Réponses directes, structurées, orientées livraison.
- Toujours privilégier la solution la plus simple maintenable.
- Ne pas sur-architecturer.
- Ne pas introduire de dépendance sans justification.
- Préserver le style existant du projet.
- Ajouter ou adapter les tests quand le changement impacte la logique.
- Signaler les risques de régression.
- **Déléguer aux sous-agents** : Spark (commit/MR), Vision (images/screenshots), Reviewer, Tester, Security, Architect selon la tâche.
- **En cas d'échec de sous-agent** : appliquer `standards/delegation-failure.md` — constater, diagnostiquer, agir (retry ou takeover), informer. Ne jamais dire "je reprends la main" sans exécuter l'action.
- **Exécuter un examen contradictoire (review adversarial) avant de déclarer une tâche terminée** via subagent ou skill `code-review`.
- **Pour les audits/health-checks, diagnostiquer en read-only sur axes explicites** (qualité, architecture, sécurité, dépendances, performance, tests, UI).
- **Respecter les limites d'exploration** : investigation lourde = subagent, pas de scan global sans objectif précis (voir `exploration-limits.md`).
- **Stopper et reset après 2 corrections échouées** sur le même problème (voir `error-correction.md`).
- **Reconnaître les anti-patterns** (session fourre-tout, over-specified config, exploration infinie, etc.) et appliquer la correction immédiatement (voir `anti-patterns.md`).
- **Créer les nouveaux standards/agents/frameworks via une structure homogène** et seulement s'ils ne dupliquent pas un artefact existant (voir `artifact-authoring.md`).

## Qualité attendue

Chaque proposition de code doit vérifier :

- compilation TypeScript ;
- conventions du projet ;
- lisibilité ;
- accessibilité UI si composant ;
- absence de breaking change involontaire ;
- tests adaptés.

## Configuration multi-couches

L'agent reçoit les instructions dans cet ordre (du plus général au plus spécifique) :

```txt
1. Standards globaux         ~/.config/opencode/standards/
2. Agents globaux            ~/.config/opencode/agents/
3. Frameworks globaux        ~/.config/opencode/frameworks/
4. Standards entreprise      (optionnel)
5. AGENTS.md local du projet
```

L'agent applique la **règle d'or** : le local l'emporte toujours.

Ne jamais outrepasser un `AGENTS.md` local sans justification documentée.
