# Standard — Memory Checklist

> Checklist de vérification en fin de session. Voir `memory-auto-update.md` pour la procédure détaillée et `memory-session-flow.md` pour la structure et l'ordre de lecture.

## Avant de rendre la main à l'utilisateur, VÉRIFIER obligatoirement :

- [ ] STATUS.md est à jour (fait/en cours/bloqué/prochaine action)
- [ ] PLAN.md reflète l'avancement réel (étapes cochées/décochées)
- [ ] CHANGELOG.md contient l'entrée de la session avec timestamp
- [ ] INDEX.md reflète la structure actuelle du projet
- [ ] BUFFER.md a un snapshot reprise à jour et les fichiers impactés (vider les notes temporaires)
- [ ] WARNINGS.md est à jour si applicable
- [ ] DECISIONS.md est à jour si des décisions ont été prises

## Si docs/ai/ n'existe pas

Créer `docs/ai/` uniquement si l'utilisateur demande explicitement la mémoire IA ou si une tâche d'implémentation est en cours. Générer les fichiers depuis `templates/` (STATUS.md, PLAN.md, CHANGELOG.md, DECISIONS.md, `project-docs/BUFFER.md`, `project-docs/INDEX.md`, `project-docs/WARNINGS.md`) et les remplir avec le contexte courant.

## Commande de vérification rapide

```bash
# Vérifier que les fichiers ont été modifiés récemment
ls -lt docs/ai/*.md | head -7
```
