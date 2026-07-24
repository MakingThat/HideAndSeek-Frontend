import { wsAuthUri } from "../config.js";
import { createSocket } from "./socketCore.js";

function handleMessage(data) {
  console.log("Lobby received:", data);
  // handle lobby-specific messages here (e.g. team confirmed, player list, etc.)
}

const socket = createSocket(wsAuthUri,handleMessage);

export function openWebsocket() {
  console.log("[SOCKET - LOBBY]: Opening Websocket");
  socket.connect();
}

export function SendMessage(message) {
  return socket.send(message);
}
