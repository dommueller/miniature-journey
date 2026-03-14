# Notes

## Step 1: Scope and structure
- Created a dedicated `zig-wasm-showcase/` folder per repository instructions.
- Decided to build a tiny browser demo that compiles Zig to `wasm32-freestanding` and loads it from JavaScript.
- Chose an intentionally small use case (math + state counter) so the focus stays on integration.

## Step 2: Integration design
- Planned files:
  - `src/main.zig` for exported WebAssembly functions.
  - `build.zig` so `zig build wasm` emits `dist/demo.wasm`.
  - `web/index.html` + `web/app.js` for runtime loading and UI.
- Avoided relying on external npm tooling to keep the setup lightweight and highlight Zig's built-in build system.

## Step 3: Validation approach
- Since this environment may not have Zig installed, prepared commands and expected behavior in README.
- Will still run repository checks (`git status`, file inspection) to ensure artifacts are coherent.

## Step 4: Key insight to emphasize in report
- Zig's explicit exports and predictable ABI make it straightforward to define a WASM surface area.
- No hidden runtime/GC required for this type of module, reducing conceptual overhead for integration.

## Step 5: Follow-up testing pass after user feedback
- Retried validating build with `zig build wasm`, but `zig` is still not available in this execution environment (`command not found`).
- Added a bun-based static server (`web/server.js`) plus `package.json` script so the project has a first-class JS runtime path.
- Updated browser loader to support both `instantiateStreaming` (correct wasm MIME) and `arrayBuffer` fallback when MIME is missing.

## Step 6: GitHub Pages "try" integration
- Added a publish-oriented `try/` entrypoint (`try/index.html`, `try/app.js`) that loads `./demo.wasm` from the same folder.
- Extended `build.zig` with a `wasm-try` step to place artifacts under `zig-out/try`.
- Added `bun run build:try` to copy the compiled wasm into `try/demo.wasm` so the Pages workflow can publish a self-contained static folder.
- Verified Bun server serves `/try/` successfully; full WASM runtime still depends on the build artifact being present.
