import * as signalR from "@microsoft/signalr"; //new networking system

import {players, wsLobbyUri} from "../config.js";
import { playerSendSuccess } from "../lobby.js";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`https://${wsLobbyUri}`)
  .withAutomaticReconnect()
  .build();

//old handleMessage() -> named event registers

//TODO need to decide on name of event method name for backend team
connection.on("LobbyResult", (data) => {
  console.log("[LOBBY]: Lobby received", data);
  if (data.success === false) {
    //TODO error message
  }
  else {
    console.log("[LOBBY]: Successfully received", data);
    playerSendSuccess(data.uuid);
  }
});

export async function OpenWebSocket() {
  console.log("[LOBBY - SOCKET]: Opening WebSocket Connection...");
  try {
    await connection.start();
    console.log("[LOBBY - SOCKET]: Connected");
  } catch (error) {
    console.warn(`[LOBBY - SOCKET]: Error Connecting to backend: ${error}`);
  }
}

export async function SendMessage(message) {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    console.warn("[LOBBY - SOCKET]: Not connected, message dropped:", message);
    return;
  }
  try {
    //TODO this needs to be determined what it will be called
    return connection.invoke("SubmitLobbyMessage", message);
  } catch (error) {
    console.warn("[LOBBY - SOCKET]: Send Failure: ", error);
  }
}
