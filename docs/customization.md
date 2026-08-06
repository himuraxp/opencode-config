# Customization — Comment personnaliser et étendre

## Personnaliser les agents

Les agents spécialisés sont dans `agents/` du repo forké. Chacun a un rôle précis :

- `aurora.md` — Agent principal, coordonne et charge les autres
- `reviewer.md` — Code review stricte (checklist, verdict)
- `tester.md` — Tests qualité (Jest, Angular standalone)
- `security.md` — Risques et remédiations
- `architect.md` — Découpage technique

Pour personnaliser :

1. Modifiez le fichier dans le repo forké
2. Relancez `./scripts/install.sh`
3. Les fichiers sont copiés dans `~/.config/opencode/agents/`

Après un renommage ou une suppression d'artefact, utilisez :

```bash
./scripts/install.sh --prune
```

## Ajouter un framework

Dans `frameworks/`, les règles techniques par stack :

```txt
frameworks/
├── angular-20.md   # Angular 20 stand-alone, signals, inject(), etc.
├── nodejs.md       # API Node.js / TypeScript
├── nestjs.md       # Architecture modulaire NestJS
└── astro.md        # Sites statiques Astro, SEO, i18n
```

Pour ajouter un framework :

1. Créer `frameworks/<mon-framework>.md`
2. Adapter `templates/AGENTS.md` pour référencer le framework
3. Relancer `./scripts/install.sh`

Le template `AGENTS.md` doit indiquer quel framework est actif pour le projet :

```md
## Node.js — Conventions

- [règles spécifiques]
```

## Créer une nouvelle règle

### Règle universelle (applicable à tout projet)

Créez un fichier dans `standards/` :

```txt
standards/
├── artifact-authoring.md
├── audit.md
├── workflow.md
├── memory-session-flow.md
├── memory-auto-update.md
├── memory-checklist.md
├── verification.md
├── communication.md
├── escalation.md
├── commits.md
└── ma-regle.md   ← ici
```

Le standard sera automatiquement copié dans `~/.config/opencode/standards/` par `install.sh`.

Avant de créer un nouvel artefact, appliquez `standards/artifact-authoring.md` :

1. Vérifier qu'un standard, agent ou framework existant ne couvre pas déjà le besoin.
2. Définir le déclencheur exact.
3. Garder le contenu court, actionnable et vérifiable.
4. Mettre à jour `README.md`, `templates/AGENTS.md` et cette page si l'artefact devient public.

### Règle spécialisée (agent dédié)

Créez un fichier dans `agents/` avec le frontmatter :

```md
---
description: Mon agent spécialisé
mode: subagent
---

# Mon Agent

[Contenu]
```

L'agent `aurora.md` le chargera automatiquement si nécessaire.

## Personnaliser le workflow de session

Modifiez `standards/workflow.md` et `standards/memory-session-flow.md` pour adapter :

- Le cycle de travail (actuellement : Explorer → Planifier → Implémenter → Review → Vérifier → Committer)
- La gestion de la mémoire (docs/ai/)
- Les vérifications obligatoires (verification.md)
- Les formats de communication (communication.md)

## Exemple typique d'extension

**Ajout d'une règle de performance pour Angular :**

```bash
# Dans le repo forké
cat > frameworks/angular-performance.md << 'EOF'
# Angular Performance

- Utiliser `OnPush` par défaut sur les composants.
- Éviter les détections de changement inutiles.
- Lazy-loading des routes.
EOF

./scripts/install.sh
```

Dans le `frameworks/angular-20.md` original, ajoutez une référence :

```md
## Performance

Voir `frameworks/angular-performance.md` pour les détails.
```

## Nouveaux Documents de Session (BUFFER, INDEX, WARNINGS)

Aurora détecte automatiquement `docs/ai/` au démarrage et charge ces documents selon l'ordre défini dans `standards/memory-session-flow.md`. Aucun paramétrage dans le `AGENTS.md` local n'est requis pour activer cette découverte.

### Pourquoi les utiliser ?

En plus de `PLAN.md`, `STATUS.md`, `DECISIONS.md` et `CHANGELOG.md`, chaque projet peut maintenant gérer : `BUFFER.md`, `INDEX.md` et `WARNINGS.md`.

- **INDEX.md** : Cartographie du projet. Évite au agent de scanner tout le code à chaque session. Mis à jour si la structure change significativement.
- **BUFFER.md** : Mémoire tampon temporaire. Hors-scope découvert, micro-décisions temporaires, snapshot pour reprise après interruption. Vidé ou archivé en fin de session.
- **WARNINGS.md** : Alertes actives et dettes techniques. Zones sensibles du projet, workarounds connus. Doit être consulté avant tout changement dans ces zones.

### Quand les modifier

- **INDEX.md** : Quand la structure change significativement ou à la création initiale.
- **BUFFER.md** : En début de session si reprise, en fin de session pour noter les sujets hors-scope.
- **WARNINGS.md** : Quand une nouvelle dette ou zone à risque est identifiée. À archiver quand résolu.

### Différences entre les documents

| Document | Quand lire | Quand écrire | Contenu |
|----------|-----------|--------------|---------|
| STATUS.md | Début de session | Fin de session | État d'avancement, bloqueurs |
| PLAN.md | Début de session | Pendant planification | Plan technique, étapes, risques, statut |
| DECISIONS.md | Quand un choix arrive | Après décision structurante | Décision, contexte, impact |
| CHANGELOG.md | Peu souvent | Fin de session (si significatif) | Historique des changements |
| BUFFER.md | Si reprise/en cours | En fin de session | Temporaire, micro-décisions, snapshot |
| INDEX.md | Début de session, si perdu | Si structure change | Cartographie du projet |
| WARNINGS.md | Avant tout changement dans zone sensible | Quand risque identifié | Alertes actives, dettes |

### Capacités prouvées dans INDEX.md

`INDEX.md` peut documenter les capacités du projet uniquement quand un signal concret existe : UI, API, base de données, auth, CLI, package, monorepo, infra, data, etc.

Ne jamais ajouter une capacité par intuition métier. Exemple : un produit avec utilisateurs n'a pas forcément une capacité `auth` tant qu'aucun code d'authentification n'est présent.

## Recommandations

- **Ne modifiez jamais directement** `~/.config/opencode/*`.
- **Les fichiers `.new`** générés par `sync-project.sh` ne sont pas lus automatiquement par OpenCode. Fusionnez-les manuellement dans les fichiers existants avant de les supprimer.
- Si un fichier `.new` existe déjà, `sync-project.sh` crée une proposition horodatée au lieu de l'écraser.
- Faîtes les modifications dans le repo forké, puis `install.sh`.
- Versionnez votre fork pour suivre vos personnalisations.
- Utilisez `git pull` pour récupérer les mises à jour upstream.
