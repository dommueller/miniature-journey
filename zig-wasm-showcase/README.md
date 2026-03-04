# Zig + WebAssembly Showcase

Original prompt:
> Showcase how zig can be used in web assembly. I heard it is easy to use to some design decisions of the language. You can make the actual use case simple this is more about showcasing the integration.

## What this demonstrates

This mini project demonstrates a straightforward Zig → WebAssembly integration flow:

1. Write simple exported functions in Zig (`pub export fn ...`).
2. Compile for `wasm32-freestanding` using Zig's native build system.
3. Load and invoke the module from browser JavaScript.

The use case is intentionally small (math + module-local counter state), so the focus remains on integration.

## Why Zig feels simple for this

- **Explicit ABI boundary**: exported functions are obvious in source (`pub export fn`).
- **No mandatory runtime/GC**: tiny modules can stay minimal and predictable.
- **Built-in cross-compilation**: `zig build` handles wasm target config directly.
- **Clear ownership and state**: module-level state (`counter`) is explicit and easy to reason about.

## Files

- `src/main.zig` — WASM-exported API.
- `build.zig` — build configuration with dedicated `wasm` and `wasm-try` steps.
- `web/index.html` + `web/app.js` — local development demo using `zig-out/dist/demo.wasm`.
- `web/server.js` — bun static server with explicit `application/wasm` MIME type.
- `try/index.html` + `try/app.js` — static-publishable GitHub Pages entrypoint expecting `try/demo.wasm`.
- `package.json` — bun/zig script helpers.
- `notes.md` — work log.

## Run locally

### 1) Build the local wasm module

```bash
cd zig-wasm-showcase
bun run build:wasm
```

Expected artifact:

- `zig-wasm-showcase/zig-out/dist/demo.wasm`

### 2) Build the publishable try artifact

```bash
bun run build:try
```

Expected artifact:

- `zig-wasm-showcase/try/demo.wasm`

### 3) Serve files

```bash
bun run serve
```

Open either:

- `http://localhost:8000/web/` (dev version)
- `http://localhost:8000/try/` (published/static version)

The page should show:

- `add(20, 22) => 42`
- counter controls that call into WASM exports.

## GitHub Pages integration

This repository's Pages workflow can publish each project's `try/` folder. For this showcase:

1. Run `bun run build:try` in CI before publish.
2. Publish `zig-wasm-showcase/try` as static content.
3. The published page loads `./demo.wasm` directly from the same directory.

## Integration notes

- The JS loader first tries `WebAssembly.instantiateStreaming` when response type is `application/wasm`.
- If MIME type is not set correctly, the loader falls back to `arrayBuffer()` + `WebAssembly.instantiate(...)`.
- The sample exports only integer-based functions to keep JavaScript interop friction low.
- If you need strings/complex data, add linear-memory helpers and explicit pointer/length conventions.
