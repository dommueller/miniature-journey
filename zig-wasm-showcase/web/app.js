const addResultEl = document.getElementById("add-result");
const counterEl = document.getElementById("counter");
const incrementButton = document.getElementById("inc");
const resetButton = document.getElementById("reset");

async function loadWasm() {
  const wasmUrl = new URL("../zig-out/dist/demo.wasm", import.meta.url);
  const response = await fetch(wasmUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${wasmUrl}: ${response.status}`);
  }

  let instance;
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/wasm")) {
    ({ instance } = await WebAssembly.instantiateStreaming(response, {}));
  } else {
    const bytes = await response.arrayBuffer();
    ({ instance } = await WebAssembly.instantiate(bytes, {}));
  }
  const { add, getCounter, incrementCounter, resetCounter } = instance.exports;

  addResultEl.textContent = String(add(20, 22));
  counterEl.textContent = String(getCounter());

  incrementButton.addEventListener("click", () => {
    counterEl.textContent = String(incrementCounter());
  });

  resetButton.addEventListener("click", () => {
    resetCounter();
    counterEl.textContent = String(getCounter());
  });

  console.log("WASM exports:", Object.keys(instance.exports));
}

loadWasm().catch((error) => {
  console.error(error);
  addResultEl.textContent = "error";
  counterEl.textContent = "error";
});
