# agents/

Personnalités spécialisées OpenCode. Chaque fichier `.md` définit un agent avec son rôle, son modèle, ses permissions et ses règles de délégation.

## Agents

### Orchestrateurs

| Agent | Modèle | Rôle |
|-------|--------|------|
| `aurora` | euria-code | Orchestrator principal. Coordinateur multi-agents, délégation automatique via mots-clés déclencheurs |
| `aurora-heavy` | euria-code | Raisonnement avancé. Architecture critique, legacy complexe |

### Engineering

| Agent | Modèle | Rôle |
|-------|--------|------|
| `architect` | euria-code | Découpage technique, structure, couplage, dette technique, migration |
| `reviewer` | euria-code | Revue de code adversariale avant merge |
| `tester` | euria-code | Tests unitaires, intégration, couverture (Jest, Cypress, Vitest) |
| `security` | euria-code | Sécurité défensive — AppSec, threat modeling, OWASP, secure code review |
| `cybersec` | euria-code | Sécurité offensive — pentest, exploitation, Red Team, recon |
| `mobile` | euria-code | iOS, Android, React Native, Flutter — patterns mobile, perf device |
| `designer` | Qwen 3.5-397B | UX/UI, design system, accessibilité, analyse de mockups |
| `vision` | Qwen 3.5-397B | Analyse visuelle non-UI — diagrammes, photos, charts, schémas |
| `spark` | Mistral-Small-4 | Tâches légères — commits, skills CLI simples |

### Search & Growth

| Agent | Modèle | Rôle |
|-------|--------|------|
| `atlas` | euria-code | Stratégie SEO — keyword research, content gaps, topical authority |
| `crawler` | Mistral-Small-4 | SEO technique — indexation, Core Web Vitals, SSR, structured data |
| `sage` | euria-code | AIO/GEO — AI Overviews, ChatGPT Search, Perplexity, Gemini |
| `scribe` | Mistral-Small-4 | Contenu SEO — copywriting, meta, H1-H3, FAQ |
| `pulse` | Mistral-Small-4 | Growth marketing — acquisition, funnels, A/B testing, landing pages |
| `echo` | Mistral-Small-4 | Distribution sociale — LinkedIn, Instagram, X, TikTok, Reddit |
| `beacon` | Mistral-Small-4 | Analytics — GSC, GA4, PageSpeed, rank tracking, conversion |

## Architecture de collaboration

```
                         Aurora
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Engineering          Search           Growth
          │                 │                 │
      Architect           Atlas             Pulse
      Reviewer           Crawler             Echo
      Security           Sage             Beacon
      Cybersec           Scribe
      Tester
      Fixer
      Oracle
      Explorer
      Librarian
      Vision
      Spark
      Designer
      Mobile
```

## Délégation automatique

Aurora détecte les mots-clés dans la demande utilisateur et délègue aux spécialistes. Voir `agents/aurora.md` pour la table complète des mots-clés déclencheurs et le routing multi-agents.

## Ajouter un agent

1. Créer un fichier `<name>.md` dans ce dossier
2. Définir le frontmatter : `model`, `mode`, `permission`
3. Définir le prompt système (rôle, règles, style)
4. Ajouter l'entrée dans `config/opencode.json` → `agent.<name>`
5. Documenter la délégation dans `agents/aurora.md` si applicable
6. Lancer `scripts/install.sh` pour déployer

## Hiérarchie d'autorité

Les instructions s'appliquent par ordre décroissant (le plus spécifique l'emporte) :

```
Standards globaux → Agents globaux → Frameworks → AGENTS.md projet → docs/ai/
```
