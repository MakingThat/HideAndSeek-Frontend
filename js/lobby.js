import { SendMessage, openWebsocket } from "./network/lobbyWebManager.js";
import { playerManager } from "./playerManager.js";
import { Player } from "./player.js";

openWebsocket();

document.getElementById('hiderRoleSelect').addEventListener('click', () => {
  const username = (document.getElementById('lobbyUsername').value);
  const role = 'hider'

  const localPlayer = new Player(username, role, null, null); //lnglat will be prompted later in dev
  playerManager.addOrUpdate(localPlayer);

  const message = {
    username: localPlayer.username,
    role: localPlayer.role,
    uuid: localPlayer.uuid,
  };

  SendMessage(message);

  console.log(message);
})

document.getElementById('seekerRoleSelect').addEventListener('click', () => {
  const username = (document.getElementById('lobbyUsername').value);
  const role = 'seeker'

  const localPlayer = new Player(username, role, null, null); //lnglat will be prompted later in dev
  playerManager.addOrUpdate(localPlayer);

  const message = {
    username: localPlayer.username,
    role: localPlayer.role,
    uuid: localPlayer.uuid,
  };

  SendMessage(message);

  console.log(message)
})

document.getElementById('rejoin').addEventListener('click', () => {
  const username = (document.getElementById('lobbyUsername').value);
  const lobbyCode = document.getElementById('lobbyCode').value;

  SendMessage({
    message: 'Fuck you',
    username: username,
    //lobbyCode: lobbyCode, //currently not in use
  })
})
