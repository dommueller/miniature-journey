# miniature-journey

Research repository for code research inspired by https://github.com/simonw/research.

## GitHub Pages blog

This repository includes a GitHub Pages blog under `docs/`.

- Blog homepage: `/`
- Subproject launchpad: `/try/`

## How top-level subprojects expose "Try it"

Top-level subprojects can self-publish a common `try/` entrypoint. Example structure:

```text
miniature-journey/
  rsvp-tool-research/
    try/
      index.html   # or index.md
      entry.yml    # optional metadata
  zig-wasm-showcase/
    try/
      index.md
```

During Pages build, `.github/workflows/pages.yml` runs `scripts/generate_subproject_pages.py`, which:

1. Finds top-level folders that contain `try/index.html` or `try/index.md`.
2. Copies each `try/` folder into `docs/subprojects/<project>/`.
3. Generates `docs/_data/subprojects.json` used by `/try/`.

Optional metadata file: `<project>/try/entry.yml`

```yaml
title: Project Title
summary: Short description shown on /try/
status: beta
```

`/try/` will then list the subproject and link to `/subprojects/<project>/`.
