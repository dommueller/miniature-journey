# RSVP Speed Reader Research + Demo

Original prompt:

> Explore Rapid Serial Visual Presentation, build a small tool that gets input text passed and then uses Rapid Serial Visual Presentation to display the text. The words per minute should be configurable and default to 300. Research how these techniques anchor the word and if there needs to fixed character highlighted to guide the focus. If there is a special technique also provide a interactive explanation of how this works.

## What was built

A browser-based RSVP tool in this folder:

- `try/index.html`: Pages-compatible entrypoint for the interactive demo.
- `try/script.js`: tokenization, RSVP playback scheduling, ORP pivot calculation/highlighting, and explainer logic.
- `try/styles.css`: dark UI, fixed reticle line, large central word display.
- `try/entry.yml`: metadata consumed by the subproject index generator.

The demo source is intentionally kept only under `try/` to avoid duplicated app code outside the Pages entrypoint.

Compatibility with subproject Pages auto-discovery is now included using the required `try/` structure.

## RSVP research summary

### 1) Core RSVP idea
RSVP presents one word at a time at a fixed screen location to reduce saccadic eye movement. Traditional reading repeatedly moves the gaze across lines; RSVP tries to keep gaze in one central area and stream words there.

### 2) Anchoring and ORP (Optimal Recognition Point)
Many speed readers use an ORP-inspired strategy: each word has a pivot character (usually near the first third) aligned to the same visual position each frame.

Heuristic commonly used in tools:

- length 1: pivot index 0
- length 2-5: pivot index 1
- length 6-9: pivot index 2
- length 10-13: pivot index 3
- length 14+: pivot index 4

This is not a universal scientific law; it is a practical implementation heuristic used in RSVP products to keep recognition stable.

### 3) Do we need fixed-character highlighting?
- Strictly speaking, RSVP can work without highlighting.
- In practice, highlighting a pivot character and aligning it to a fixed reticle can improve subjective ease and reduce refixation for many users.
- So: it is optional but commonly helpful, especially at higher WPM.

### 4) Technique caveats
- Comprehension can drop at very high WPM.
- Dense technical text and regressions (re-reading) are harder in RSVP.
- Pauses for punctuation and sentence boundaries can improve comprehension (not implemented yet, but a useful enhancement).

## Interactive explanation included
The demo includes an “Interactive ORP anchor explainer” section where users:

- type any example word,
- move a pivot-index slider,
- observe the highlighted character while a fixed reticle stays centered.

This shows how keeping one anchor location can reduce eye travel even as word length changes.

## How to run locally

Open `try/index.html` in a browser.

## Repository layout note

- `README.md` and `notes.md` stay at the subproject root for documentation.
- All runnable demo assets live only in `try/` for Pages compatibility and to avoid duplication.
