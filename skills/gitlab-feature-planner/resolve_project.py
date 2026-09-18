#!/usr/bin/env python3
"""Résolution déterministe d'un projet GitLab à partir du registry du skill.

Stratégie (SKILL.md — Project resolution) :
  1. alias exact (registry)
  2. project ID connu (registry)
  3. project path connu (registry)
  4. displayName exact (registry)
  5. sinon -> NotFound : recherche GitLab contrôlée autorisée, MAIS ambiguïté = STOP
     et confirmation humaine ; projet validé -> mémoriser via --record.

Usage :
  resolve-project.py --list
  resolve-project.py --resolve site-manager
  resolve-project.py --resolve infomaniak/media/site-manager
  resolve-project.py --validate            # vérifie projectId <-> gitlabPath en live
  resolve-project.py --record podcast-suite --path infomaniak/media/podcast/suite --id 1234 --display "Podcast Suite"

Stdlib uniquement.
"""
import argparse
import json
import os
import subprocess
import sys


class AmbiguousProject(Exception):
    pass


class ProjectNotFound(Exception):
    pass


def registry_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "projects-registry.json")


def load_registry(path=None):
    with open(path or registry_path(), encoding="utf-8") as f:
        data = json.load(f)
    return data


def resolve(query, reg):
    """Résout alias | projectId | gitlabPath | displayName (insensible à la casse)."""
    q = str(query).strip()
    if not q:
        raise ProjectNotFound("requête vide")
    for p in reg["projects"]:
        if q.lower() == p["alias"].lower():
            return p
    if q.isdigit():
        for p in reg["projects"]:
            if int(p["projectId"]) == int(q):
                return p
    for p in reg["projects"]:
        if q.lower() == p["gitlabPath"].lower():
            return p
    matches = [p for p in reg["projects"] if q.lower() == p["displayName"].lower()]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        raise AmbiguousProject(f"« {q} » correspond à plusieurs projets : {[p['alias'] for p in matches]}")
    # recherche partielle (prefix/sous-chaîne) — unique seulement, jamais de choix arbitraire
    partial = [
        p
        for p in reg["projects"]
        if q.lower() in p["alias"].lower()
        or q.lower() in p["gitlabPath"].lower()
        or q.lower() in p["displayName"].lower()
    ]
    if len(partial) == 1:
        return partial[0]
    if len(partial) > 1:
        raise AmbiguousProject(
            f"« {q} » correspond à plusieurs projets : {[p['alias'] for p in partial]} — demander confirmation"
        )
    raise ProjectNotFound(
        f"« {q} » absent du registry — recherche GitLab contrôlée (namespaces connus), puis confirmer avec l'utilisateur et mémoriser via --record"
    )


def validate_live(reg):
    """Vérifie en live que chaque projectId répond et que le path_with_namespace correspond."""
    errors = []
    for p in reg["projects"]:
        try:
            r = subprocess.run(
                ["glab", "api", f"projects/{p['projectId']}"],
                capture_output=True, text=True, timeout=30, check=True,
            )
            live = json.loads(r.stdout)
            if live.get("path_with_namespace") != p["gitlabPath"]:
                errors.append(
                    f"{p['alias']}: path live « {live.get('path_with_namespace')} » != registry « {p['gitlabPath']} »"
                )
            else:
                print(f"  ok  {p['alias']:18} {p['gitlabPath']} ({p['projectId']})")
        except subprocess.CalledProcessError as e:
            errors.append(f"{p['alias']}: accès impossible au projet {p['projectId']} — {e.stderr.strip()[:80]}")
        except (OSError, json.JSONDecodeError) as e:
            errors.append(f"{p['alias']}: erreur d'exécution — {e}")
    return errors


def record(reg, alias, gitlab_path, project_id, display):
    for p in reg["projects"]:
        if p["alias"] == alias:
            sys.exit(f"alias « {alias} » déjà présent dans le registry — rien à faire (modifier le fichier à la main si la valeur a changé).")
    reg["projects"].append(
        {
            "alias": alias,
            "displayName": display or alias,
            "gitlabPath": gitlab_path,
            "projectId": int(project_id),
            "validated": True,
            "role": "",
        }
    )
    with open(registry_path(), "w", encoding="utf-8") as f:
        json.dump(reg, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"enregistré : {alias} -> {gitlab_path} ({project_id})")


def main():
    ap = argparse.ArgumentParser(description="Résolution de projets GitLab via le registry du planner")
    ap.add_argument("--resolve", metavar="QUERY", help="alias, projectId, path ou displayName")
    ap.add_argument("--list", action="store_true", help="lister le registry")
    ap.add_argument("--validate", action="store_true", help="vérifier le registry en live (glab)")
    ap.add_argument("--record", metavar="ALIAS", help="mémoriser un projet validé (après confirmation humaine)")
    ap.add_argument("--path", help="gitlabPath du projet à enregistrer")
    ap.add_argument("--id", dest="project_id", help="projectId du projet à enregistrer")
    ap.add_argument("--display", help="displayName du projet à enregistrer")
    args = ap.parse_args()

    reg = load_registry()

    if args.list:
        for p in reg["projects"]:
            print(f"{p['alias']:18} {p['gitlabPath']:40} {p['projectId']}")
        return
    if args.resolve:
        try:
            p = resolve(args.resolve, reg)
            print(json.dumps(p, ensure_ascii=False, indent=2))
        except AmbiguousProject as e:
            sys.exit(f"AMBIGU — {e}\n→ ne rien créer, demander confirmation à l'utilisateur")
        except ProjectNotFound as e:
            sys.exit(f"INTROUVABLE — {e}")
        return
    if args.validate:
        errors = validate_live(reg)
        if errors:
            print("\n".join(f"ERREUR {e}" for e in errors), file=sys.stderr)
            sys.exit(1)
        print("Registry validé : tous les projets répondent avec le bon path.")
        return
    if args.record:
        if not (args.path and args.project_id):
            sys.exit("--record exige --path et --id")
        record(reg, args.record, args.path, args.project_id, args.display)
        return
    ap.print_help()


if __name__ == "__main__":
    main()
