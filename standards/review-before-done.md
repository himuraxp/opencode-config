# Standard — Review Before Done

## Principe

Avant de considérer une tâche comme terminée, Aurora DOIT exécuter un **examen contradictoire** (adversarial review) en utilisant un subagent frais. L'agent qui code ne doit **jamais** être celui qui valide son propre travail.

## Pourquoi

L'agent principal est biaisé par :
- Son raisonnement qui a produit le code
- Les hypothèses de départ
- Les approches échouées accumulées dans le contexte
- La fatigue de la session

Un subagent avec un contexte vierge examine le résultat de manière objective.

## Procédure obligatoire

### Quand déclencher

Après l'étape **Implémenter** du workflow, avant de déclarer la tâche terminée :

```
Explorer → Planifier → Implémenter → [REVIEW] → Vérifier → Committer
```

### Comment reviewer

**Méthode 1** (recommandée) : Utiliser le skill `/code-review` si disponible dans la session.

**Méthode 2** (fallback) : Lancer un subagent `reviewer` avec la consigne suivante :

```
Review the diff of the following files against PLAN.md.
Check that :
- Every requirement in the plan is implemented
- No file outside the task's scope was modified
- Edge cases have tests or are properly handled
- No breaking changes were introduced unintentionally
- The solution follows the project's conventions (Angular 20, TypeScript, etc.)

Report ONLY gaps affecting correctness or requirements. 
Ignore style preferences and formatting choices.
```

### Axes obligatoires

Le review doit couvrir trois axes, même si le rapport final reste concis :

| Axe | Question centrale | Exemples de gaps |
|-----|-------------------|------------------|
| Code | La diff est-elle correcte et maintenable ? | bug, sécurité, complexité inutile, convention cassée |
| Fonctionnel | Le résultat respecte-t-il le plan et les critères d'acceptation ? | exigence manquante, edge case non traité, test absent |
| Pertinence | La solution répond-elle au besoin réel sans hors-scope ? | sur-ingénierie, fichier modifié inutilement, comportement non demandé |

Verdict global :

- `Mergeable` : aucun gap critique ou bloquant
- `À corriger` : au moins un gap corrigeable avant livraison
- `À clarifier` : le plan ou le besoin est ambigu
- `Bloqué` : la tâche ne peut pas être validée sans décision humaine

### Traitement du retour

1. Le subagent retourne ses constatations
2. Si aucun gap critique → passer à Vérifier
3. Si gaps identifiés → les corriger, puis **relancer le review** (1 itération max)
4. Si le subagent trouve des gaps optionnels/non critiques → les noter dans `BUFFER.md` comme améliorations futures

### Quand SKIPPER le review

Le review peut être court-circuité uniquement si :
- La tâche est exploratoire (brainstorm, investigation sans code)
- Changement d'une seule ligne trivial (typo, rename)
- La tâche spécifiait explicitement « pas de review nécessaire »

**Jamais** skipper sur une modification touchant > 3 fichiers ou modifiant de la logique métier.

### Si le review échoue encore

Si **2 reviews successifs** identifient des gaps critiques persistants :
1. **Constater** : "2 passages de review ont échoué à produire un résultat valide"
2. **Se questionner** : Le plan initial était-il incorrect ? Le scope est-il mal défini ?
3. **Consulter `PLAN.md`** — s'il s'écarte du plan, discuter avec l'utilisateur
4. **Ne pas** entrer dans une boucle infinie de correction+review (voir `error-correction.md`)

## Anti-patterns interdits

- ❌ Déclarer "terminé" sans preuve du review
- ❌ Reviewer ses propres modifications sans subagent externe
- ❌ Ignorer un gap critique signalé par le reviewer
- ❌ Sur-ingénierie : corriger tous les gaps signalés (optionnels inclus)
