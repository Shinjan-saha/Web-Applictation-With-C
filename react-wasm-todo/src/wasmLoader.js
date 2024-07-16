export async function loadWasmModule() {
    const response = await fetch('/todo_queue.wasm');
    const buffer = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer);
    return instance.exports;
  }
  