import * as signalR from "@microsoft/signalr";

import { wsMapQuestionsUri} from "../config.js";
import { newCircleZone } from "../radar.js";
import { newThermometer } from "../thermometer.js";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`https://${wsMapQuestionsUri}`)
  .withAutomaticReconnect()
  .build();

connection.on("RadarQuestion", (item) => {
  newCircleZone(
    item.position.lng,
    item.position.lat,
    item.radius,
    item.answer
  )
})

connection.on("ThermometerQuestion", (item) => {
  newThermometer(
    item.startPoint,
    item.endPoint,
    true,
    true
  )
})

export async function OpenWebSocket() {
  console.log("[GAME - SOCKET]: Opening WebSocket Connection...");
  try {
    await connection.start();
    console.log("[GAME - SOCKET]: Connected");
  } catch (error) {
    console.warn(`[GAME - SOCKET]: Error Connecting to backend: ${error}`);
  }
}

export async function SendMessage(message) {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    console.warn("[GAME - SOCKET]: Not connected, message dropped:", message);
    return;
  }
  try {
    //TODO this needs to be determined what it will be called
    return connection.invoke("SubmitLobbyMessage", message);
  } catch (error) {
    console.warn("[GAME - SOCKET]: Send Failure: ", error);
  }
}
