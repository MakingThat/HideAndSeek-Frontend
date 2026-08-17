import { SendMessage, openWebsocket } from "./network/lobbyWebManager.js";
import { playerManager } from "./playerManager.js";
import { Player } from "./player.js";

let username;
let role;

openWebsocket();

export function playerSendSuccess (uuid) {
  let player = new Player(username, role, null ,uuid);
  playerManager.addOrUpdate(player);
  console.log(playerManager.all());
}

document.getElementById('hiderRoleSelect').addEventListener('click', () => {
  username = (document.getElementById('lobbyUsername').value);
  role = 'hider'

  const message = {
    username: username,
    role: role,
    uuid: null,
  };

  SendMessage(message);

  console.log(message);
})

document.getElementById('seekerRoleSelect').addEventListener('click', () => {
  username = (document.getElementById('lobbyUsername').value);
  role = 'seeker'

  const message = {
    username: username,
    role: role,
    uuid: null,
  };

  SendMessage(message);

  console.log(message)
})

document.getElementById('rejoin').addEventListener('click', () => {
  username = (document.getElementById('lobbyUsername').value);
  const lobbyCode = document.getElementById('lobbyCode').value;

  SendMessage({
    message: 'Fuck you',
    username: username,
    //lobbyCode: lobbyCode, //currently not in use
  })
})
