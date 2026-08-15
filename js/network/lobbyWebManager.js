import { wsAuthUri } from "../config.js";
import { createSocket } from "./socketCore.js";

function handleMessage(data) {
  console.log("[LOBBY] - Lobby received:", data);
  // handle lobby-specific messages here (e.g. team confirmed, player list, etc.)

  //on message back - check success bool
  //then enter data

  if (data.success === false) {
    //error or failure
  }
  else {
    console.log("[LOBBY] - Successfully received:");
  }
}

const socket = createSocket(wsAuthUri,handleMessage);

export function openWebsocket() {
  console.log("[SOCKET - LOBBY]: Opening Websocket");
  socket.connect();
}

export function SendMessage(message) {
  return socket.send(message);
}
