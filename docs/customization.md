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
├── workflow.md
├── memory.md
├── verification.md
├── communication.md
├── escalation.md
├── commits.md
└── ma-regle.md   ← ici
```

Le standard sera automatiquement copié dans `~/.config/opencode/standards/` par `install.sh`.

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

Modifiez `standards/workflow.md` et `standards/memory.md` pour adapter :

- Le cycle de travail (actuellement : Explorer → Planifier → Implémenter → Vérifier → Committer)
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

## Recommandations

- **Ne modifiez jamais directement** `~/.config/opencode/*`.
- Faîtes les modifications dans le repo forké, puis `install.sh`.
- Versionnez votre fork pour suivre vos personnalisations.
- Utilisez `git pull` pour récupérer les mises à jour upstream.
