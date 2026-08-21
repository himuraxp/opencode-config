# BUFFER

## Snapshot reprise — 2026-08-21 (scripts animés Aurora UI)

### Sujet

Donner du style aux scripts d'installation console avec logo ASCII art "Aurora", animations, et palette 256 couleurs — tout en gardant le mode console pur (100% bash, zéro dépendance).

### Fichiers impactés

- `scripts/ui.sh` (créé — bibliothèque d'animations : logo, sections, spinner, progress bar, typewriter, messages)
- `scripts/setup.sh` (modifié — source ui.sh, logo, sections animées, --no-animation)
- `scripts/install.sh` (modifié — source ui.sh, logo, sections, progress bar, --no-animation)
- `docs/ai/STATUS.md` (modifié)
- `docs/ai/CHANGELOG.md` (modifié)
- `docs/ai/INDEX.md` (modifié)
- `docs/ai/BUFFER.md` (modifié)

### Décisions clés

- Logo variante A (block/impactant) — turquoise bright (code 51)
- Palette 256 ANSI (12 couleurs : primary 51, header 220, ok 46, fail 196, warn 226, etc.)
- Box-drawing Unicode (╭─╮ │ ╰─╯) pour sections
- Spinner braille (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏)
- Progress bar (█░) avec pre-count des fichiers
- Typewriter pour résumé final
- Désactivation auto si non-TTY + flag --no-animation
- Compatible macOS bash 3.2+ et Linux bash 4+
- Designer consulté pour direction visuelle (agent-output.v1)

### État

- Tous les fichiers créés et modifiés.
- `bash -n` OK sur les 3 fichiers.
- `install.sh --dry-run` testé OK.
- `install.sh --no-animation --no-config` testé OK (1 new, 70 unchanged).
- Config active synchronisée (`~/.config/opencode/scripts/ui.sh`).
- Logo final validé par l'utilisateur (police `roman`).
- Commit en attente.
