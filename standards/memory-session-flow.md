# Standard — Memory

## Documentation IA par projet

Chaque projet doit maintenir la mémoire de session dans `docs/ai/` :

```txt
docs/
├── ai/
│   ├── PLAN.md        → plan d'implémentation courant
│   ├── STATUS.md      → état actuel, prochaine étape, bloqueurs
│   ├── DECISIONS.md   → décisions d'architecture
│   ├── CHANGELOG.md   → historique significatif des sessions IA
│   ├── BUFFER.md      → snapshot de reprise
│   ├── INDEX.md       → cartographie et capacités prouvées du projet
│   └── WARNINGS.md    → risques actifs et zones sensibles
```

## Découverte automatique de docs/ai/ (obligatoire)

Aurora doit **impérativement vérifier** à chaque session si le projet courant contient `docs/ai/`.

- Si le dossier existe, l'ordre de lecture de session s'applique **automatiquement et obligatoirement**.
- Si le dossier n'existe pas, aucune action particulière n'est requise.

Aucune modification du `AGENTS.md` local n'est requise pour activer cette découverte. C'est un comportement global d'Aurora, non une configuration projet.

## Début de session — Ordre de lecture de session

L'agent doit systématiquement :

1. Lire `docs/ai/STATUS.md` pour comprendre l'état actuel, les bloqueurs, la prochaine étape.
2. Lire `docs/ai/PLAN.md` pour connaître le plan en cours.
3. Lire `docs/ai/WARNINGS.md` pour identifier les zones à risque et les alertes actives.
4. Lire `docs/ai/INDEX.md` pour cartographier le projet sans scan global.

Puis lire `docs/ai/BUFFER.md` **uniquement si** :

- la session précédente semble interrompue ;
- `STATUS.md` signale un blocage ;
- `BUFFER.md` contient un snapshot de reprise ;
- l'utilisateur demande explicitement de reprendre une tâche ;
- le contexte projet est insuffisant.

## Fin de session — Ordre de mise à jour

L'agent doit systématiquement :

1. Mettre à jour `docs/ai/STATUS.md` avec :
   - ce qui a été fait
   - ce qui reste à faire
   - les bloqueurs éventuels
   - la prochaine étape recommandée

2. Mettre à jour `docs/ai/BUFFER.md` :
   - noter les sujets hors-scope, les micro-décisions, le snapshot si interruption ;
   - vider ou archiver si le buffer est résolu ou vide ;
   - **promouvoir dans `WARNINGS.md`** tout sujet persistant ou critique identifié dans le buffer.

3. Ajouter une entrée dans `docs/ai/CHANGELOG.md` si des changements significatifs ont été réalisés.

## Rôle de chaque document

- **PLAN.md** : plan technique courant, objectifs, étapes, risques.
- **STATUS.md** : état d'avancement dynamique, en cours/fait/bloqué/prochaine action.
- **DECISIONS.md** : décisions structurantes (pourquoi, alternative rejetée, impact).
- **CHANGELOG.md** : historique des sessions (quoi, quand, contexte).
- **BUFFER.md** : snapshot de reprise, fichiers impactés, notes temporaires à promouvoir ou vider.
- **INDEX.md** : cartographie du projet, fichiers clés, capacités prouvées par des signaux concrets.
- **WARNINGS.md** : risques actifs, dettes techniques, zones sensibles.

## Capacités projet dans INDEX.md

Documenter uniquement les capacités démontrées par des faits du dépôt :

| Capacité | Signaux acceptés |
|----------|------------------|
| UI | framework frontend, dossiers `components/`, `pages/`, vues |
| API | routes, controllers, serveur HTTP/RPC |
| Base de données | migrations, ORM, driver, schéma |
| Auth | middleware auth, sessions, tokens, OAuth, permissions |
| Realtime | WebSocket, SSE, Socket.IO, Pusher, Ably |
| Messaging | Kafka, RabbitMQ, SQS, BullMQ, producteurs/consommateurs |
| Déploiement | CI, Dockerfile, pipeline de release |
| Infra | Terraform, Pulumi, Kubernetes, Helm |
| Package | `exports`, `main`, `module`, package publiable |
| CLI | champ `bin`, Commander, Yargs, Oclif ou équivalent |
| Data | notebooks, pipelines, modèles, outils data/ML |
| Monorepo | workspaces, Nx, Turborepo, Lerna |

Ne jamais ajouter une capacité par intuition métier. Si le signal n'existe pas, laisser absent.

## Lecture JIT (Just-In-Time)

Certains documents ne sont pas lus systématiquement au démarrage, mais uniquement à la demande selon le contexte.

- **DECISIONS.md** : consulté en JIT si une décision structurante est nécessaire, si une règle projet semble contradictoire, ou si une modification d'architecture est envisagée.
- **CHANGELOG.md** : consulté en JIT pour comprendre l'historique d'une zone, si une régression est suspectée, ou si l'utilisateur demande l'historique.

## Règles

- Écrire dans la langue du projet (français recommandé pour les projets francophones).
- Ne pas documenter les micro-corrections (unif, typo, formatage).
- Documenter les décisions d'architecture, les pivots, les découvertes importantes.
- Garder STATUS.md concis et à jour.
- Promouvoir immédiatement tout risque persistant de `BUFFER.md` vers `WARNINGS.md`.
- Ne jamais lire un fichier `.new` généré par `sync-project.sh` : il s'agit d'une proposition de fusion manuelle, non d'une source de vérité.
