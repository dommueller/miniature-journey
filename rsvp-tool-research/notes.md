# Investigation Notes: RSVP Reader Tool

## 2026-03-03
- Created dedicated folder `rsvp-tool-research` per repository instructions.
- Planned deliverables:
  - Small configurable Rapid Serial Visual Presentation tool.
  - Default WPM set to 300, with user-adjustable control.
  - Research summary on anchoring/ORP (Optimal Recognition Point) and highlighted fixation character.
  - Interactive explanation for how the anchoring technique works.
- Implemented static web app (`index.html`, `styles.css`, `script.js`) with:
  - RSVP playback controls and configurable WPM (default 300).
  - ORP pivot highlight toggle.
  - Reticle-centered word display.
  - Interactive ORP explainer (word + pivot index slider).
- Implemented ORP heuristic tiers (1/2-5/6-9/10-13/14+ length buckets).
- Added final report in `README.md` with research findings and caveats.
- Validation: ran `node --check rsvp-tool-research/script.js` successfully.
- Captured UI screenshot via Playwright artifact: `artifacts/rsvp-tool.png`.
- Follow-up update: adapted subproject to GitHub Pages auto-discovery convention.
  - Added `try/index.html`, `try/styles.css`, and `try/script.js` as the self-published entrypoint.
  - Added `try/entry.yml` metadata for title/summary/status in `/try/` listings.
  - Updated README run instructions to point to `try/index.html`.
- Cleanup pass for review feedback:
  - Removed duplicated web app files at `rsvp-tool-research/index.html`, `script.js`, and `styles.css`.
  - Kept a single canonical runnable implementation in `rsvp-tool-research/try/`.
  - Clarified README to state that `try/` is the only demo code location and root contains docs only.
