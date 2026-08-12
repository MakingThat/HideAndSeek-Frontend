import { wsUri} from "../config.js";
import { createSocket } from "./socketCore.js";
import { newCircleZone } from "../radar.js";
import { newThermometer } from "../thermometer.js";

function handleMessage(data) {
  console.log(data);

  if (Array.isArray(data)) {
    for (const item of data) {
      switch (item.QuestionType) {
        case "Radar":
          console.log(item);

          newCircleZone(item.position.lng, item.position.lat, item.radius, item.answer);
          break;

        case "Thermometer":
          console.log(item);

          newThermometer(item.startPosition, item.endPosition, true);
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
