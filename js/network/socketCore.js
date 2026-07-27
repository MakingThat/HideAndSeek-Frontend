export function createSocket(uri, onMessage) {
  let websocket = null;

  function connect() {
    websocket = new WebSocket(uri);

    websocket.addEventListener("open", () => console.log(`[SOCKET - CORE]: connected to ${uri}`));
    websocket.addEventListener("close", () => console.log(`[SOCKET - CORE]: disconnected from ${uri}`));
    websocket.addEventListener("error", () => console.log("[SOCKET - CORE]: error occurred"));
    websocket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      onMessage(data);
    });
  }

  function send(message) {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.warn("Websocket not open: " + JSON.stringify(message));
      return false;
    }
    websocket.send(JSON.stringify(message));
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) connect();
  });

  return { connect, send };
}
