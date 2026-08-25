# scripts/hooks/

Hooks Git pour la sécurité et la qualité. Ces scripts s'installent dans `.git/hooks/` ou via `core.hooksPath`.

## Hooks

### pre-commit-secrets.sh

Git pre-commit hook qui détecte les secrets accidentellement commités.

**Patterns détectés :**
- API keys (OpenAI, Google, Stripe, AWS, GitHub, GitLab)
- Bearer tokens, JWT
- Private keys (`BEGIN PRIVATE KEY`, `BEGIN RSA PRIVATE KEY`)
- Mots de passe dans config (`password=`, `passwd=`, `pwd=`)
- Connection strings avec credentials (`mongodb://`, `postgresql://`, `mysql://`, `redis://`)
- Slack tokens (`xox[baprs]-`)

**Installation :**

```bash
# Méthode 1 : copie directe
cp scripts/hooks/pre-commit-secrets.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Méthode 2 : core.hooksPath (recommandé)
git config core.hooksPath scripts/hooks
```

**Fichiers ignorés :**
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- `.env.example`
- Fichiers binaires, images

**False positives :**

Si une détection est un false positive, committer avec `--no-verify` :

```bash
git commit --no-verify
```

## Ajouter un hook

1. Créer un fichier `<hook-name>.sh` dans ce dossier
2. Le rendre exécutable (`chmod +x`)
3. Documenter les patterns et l'installation
4. Lancer `scripts/install.sh` pour déployer
