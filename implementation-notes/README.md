# GitHub Pages blog + top-level subproject try-page report

## Original prompt

"Add a GitHub io blog and make it so that each subproject can expose an entry to try things out directly once we publish the GitHub io blog"

## Follow-up adjustment addressed

The `rsvp-tool-research` example was reported as already merged on master. This branch now removes the stub/example and keeps only the generic discovery pipeline.

## Outcome

Implemented and retained the Pages pipeline that auto-discovers top-level subprojects and publishes their `try/` entrypoints:

- Build-time script: `scripts/generate_subproject_pages.py`
- Generated data: `docs/_data/subprojects.json`
- Generated publish target: `docs/subprojects/<project>/...`
- Directory index page: `docs/try.md`

No hard-coded sample subproject is included in this branch.

## Common subproject format

Each top-level project can expose either:

- `<project>/try/index.html`, or
- `<project>/try/index.md`

Optional metadata:

- `<project>/try/entry.yml` with `title`, `summary`, `status`

## Build flow

1. GitHub Action runs the generator script.
2. Script discovers and copies `try/` folders into `docs/subprojects/`.
3. Script emits `docs/_data/subprojects.json`.
4. Jekyll builds the blog + `/try/` listing.
