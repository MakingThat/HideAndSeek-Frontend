import { wsUri} from "../config.js";
import { createSocket } from "./socketCore.js";
import { newCircleZone } from "../radar.js";

function handleMessage(data) {
  if (Array.isArray(data)) {
    for (const item of data) {
      switch (item.questionType) {
        case "Radar":
          newCircleZone(item.position.lng, item.position.lat, item.radius, item.answer);
          break;
      }
    }
  }
}

const socket = createSocket(wsUri, handleMessage);

export function openWebsocket() {
  console.log("[SOCKET - MAIN]: Opening Websocket");
  socket.connect();
}

export function SendMessage(message) {
  return socket.send(message);
}
