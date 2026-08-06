# Mémoire Projet Auto-Entretenue — Checklist de fin de session

## Avant de rendre la main à l'utilisateur, VÉRIFIER obligatoirement :

- [ ] STATUS.md est à jour (fait/en cours/bloqué/prochaine action)
- [ ] PLAN.md reflète l'avancement réel (étapes cochées/décochées)
- [ ] CHANGELOG.md contient l'entrée de la session avec timestamp
- [ ] BUFFER.md a un snapshot reprise à jour et les fichiers impactés
- [ ] INDEX.md reflète la structure actuelle du projet
- [ ] WARNINGS.md est à jour si applicable
- [ ] DECISIONS.md est à jour si des décisions ont été prises

## Si docs/ai/ n'existe pas et que le projet doit adopter la mémoire IA

1. Créer le répertoire `docs/ai/`
2. Générer tous les fichiers à partir des templates
3. Les remplir avec le contexte courant immédiatement

## Commande de vérification rapide

```bash
# Vérifier que les fichiers ont été modifiés récemment
ls -lt docs/ai/*.md | head -7
```
