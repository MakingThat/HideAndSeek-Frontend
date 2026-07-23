import { wsUri } from '../config.js';
import { newCircleZone } from "../radar.js";

let websocket = null;
let counter = 0;
let pingInterval = null;

function initializeWebSocketListeners(ws) {
  ws.addEventListener("open", () => {
    console.log("CONNECTED");
    // pingInterval = setInterval(() => {
    //   console.log(`SENT: ping: ${counter}`);
    //   ws.send("ping");
    // }, 1000);
  });

  ws.addEventListener("close", () => {
    console.log("DISCONNECTED");
    clearInterval(pingInterval);
  });

  ws.addEventListener("message", (e) => {
    console.log(`RECEIVED: ${e.data}: ${counter}`);
    counter++;

    const data = JSON.parse(e.data);
    if ( Array.isArray(data) ) {
      for ( e of data ) {
        switch (e.questionType) {
          case "Radar":
            newCircleZone(e.position.lng, e.position.lat, e.radius, e.answer);
            break;
        }
      }
    }
  });

  ws.addEventListener("error", (e) => {
    console.log(`ERROR`);
  });
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    websocket = new WebSocket(wsUri);
    initializeWebSocketListeners(websocket);
  }
});

export function openWebsocket() {
  console.log("OPENING");
  websocket = new WebSocket(wsUri);
  initializeWebSocketListeners(websocket);
}

export function SendMessage(message) {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    console.warn("Websocket error: " + message);
    return false;
  }
  websocket.send(JSON.stringify(message));
}
