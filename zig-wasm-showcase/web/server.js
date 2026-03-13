import { serve } from "bun";
import { join, extname } from "node:path";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url).pathname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".css": "text/css; charset=utf-8",
};

serve({
  port: 8000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    if (path === "/") path = "/web/index.html";
    else if (path.endsWith("/")) path = `${path}index.html`;

    let filePath = join(root, path);

    try {
      const info = await stat(filePath);
      if (info.isDirectory()) {
        path = `${path}/index.html`;
        filePath = join(root, path);
      }

      const file = await readFile(filePath);
      const ext = extname(filePath);
      return new Response(file, {
        headers: {
          "content-type": mimeTypes[ext] ?? "application/octet-stream",
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
});

console.log("Serving zig-wasm-showcase at http://localhost:8000");
