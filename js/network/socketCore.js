const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
const RECONNECT_DELAY_MS = 7000;

export function createSocket(uri, onMessage) {
  let websocket = null;
  let socketUrl = `${wsProtocol}${uri}`
  let reconnectTimer = null;
  let manuallyClosed = false;

  function connect() {
    manuallyClosed = false;
    clearReconnectTimer();

    websocket = new WebSocket(socketUrl);

    websocket.addEventListener("open", () => {
      console.log(`[SOCKET - CORE]: connected to ${socketUrl}`);
      clearReconnectTimer();
    });

    websocket.addEventListener("close", () => {
      console.log(`[SOCKET - CORE]: disconnected from ${socketUrl}`);
      if (!manuallyClosed) scheduleReconnect();
    });

    websocket.addEventListener("error", () => {
      console.log("[SOCKET - CORE]: error occurred");
      // "close" fires right after "error" for WebSocket failures, so the
      // reconnect is scheduled there - no need to duplicate it here.
    });

    websocket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      onMessage(data);
    });
  }

  function scheduleReconnect() {
    if (reconnectTimer) return; // already waiting on one
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      console.log(`[SOCKET - CORE]: attempting reconnect to ${socketUrl}`);
      connect();
    }, RECONNECT_DELAY_MS);
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function disconnect() {
    manuallyClosed = true;
    clearReconnectTimer();
    if (websocket) websocket.close();
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

  return { connect, send, disconnect };
}
