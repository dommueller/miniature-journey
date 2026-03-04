#!/usr/bin/env python3
"""Discover top-level subprojects with a try/ folder and generate Pages inputs.

Expected optional metadata file: <project>/try/entry.yml
Supported keys: title, summary, status

A project is included when one of these exists:
- <project>/try/index.html
- <project>/try/index.md
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_ROOT / "docs"
DATA_FILE = DOCS_DIR / "_data" / "subprojects.json"
OUTPUT_DIR = DOCS_DIR / "subprojects"

EXCLUDED_DIRS = {
    ".git",
    ".github",
    "docs",
    "implementation-notes",
    "scripts",
}


def parse_simple_yaml(path: Path) -> dict[str, str]:
    """Parse very small key: value YAML files without dependencies."""
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        values[key] = value
    return values


def clean_output_dir() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for child in OUTPUT_DIR.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()


def discover_subprojects() -> list[dict[str, str]]:
    subprojects: list[dict[str, str]] = []

    for path in sorted(REPO_ROOT.iterdir()):
        if not path.is_dir() or path.name in EXCLUDED_DIRS or path.name.startswith("."):
            continue

        try_dir = path / "try"
        if not try_dir.is_dir():
            continue

        has_entry = (try_dir / "index.html").exists() or (try_dir / "index.md").exists()
        if not has_entry:
            continue

        metadata = {}
        metadata_file = try_dir / "entry.yml"
        if metadata_file.exists():
            metadata = parse_simple_yaml(metadata_file)

        project_slug = path.name
        output_path = OUTPUT_DIR / project_slug
        shutil.copytree(try_dir, output_path)

        subprojects.append(
            {
                "slug": project_slug,
                "title": metadata.get("title", project_slug.replace("-", " ").title()),
                "summary": metadata.get(
                    "summary", f"Live try page exposed by `{project_slug}/try/`."
                ),
                "status": metadata.get("status", "published"),
                "repo_path": project_slug,
                "try_url": f"/subprojects/{project_slug}/",
            }
        )

    return subprojects


def main() -> None:
    clean_output_dir()
    subprojects = discover_subprojects()
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(subprojects, indent=2) + "\n", encoding="utf-8")
    print(f"Discovered {len(subprojects)} subproject(s).")


if __name__ == "__main__":
    main()
