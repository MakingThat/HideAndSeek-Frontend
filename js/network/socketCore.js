const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
const RECONNECT_DELAY_MS = 7000;

export function createSocket(uri, onMessage) {
  let websocket = null;
  let socketUrl = `${wsProtocol}${uri}`
  let reconnectTimer = null;
  let manuallyClosed = false;
  let connectionId = 0; // bumped on every connect() call, identifies "the current attempt"

  function connect() {
    const id = ++connectionId; // this socket's identity
    manuallyClosed = false;
    clearReconnectTimer();

    const ws = new WebSocket(socketUrl);
    websocket = ws;

    ws.addEventListener("open", () => {
      if (id !== connectionId) return; // a stale socket, ignore
      console.log(`[SOCKET - CORE]: connected to ${socketUrl}`);
      clearReconnectTimer();
    });

    ws.addEventListener("close", () => {
      if (id !== connectionId) return; // stale socket closing late, ignore - a newer one is already active
      console.log(`[SOCKET - CORE]: disconnected from ${socketUrl}`);
      if (!manuallyClosed) scheduleReconnect();
    });

    ws.addEventListener("error", () => {
      if (id !== connectionId) return;
      console.log("[SOCKET - CORE]: error occurred");
      // "close" fires right after "error" for WebSocket failures, so the
      // reconnect is scheduled there - no need to duplicate it here.
    });

    ws.addEventListener("message", (e) => {
      if (id !== connectionId) return;
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
    connectionId++; // invalidates any in-flight/old socket's handlers too
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
