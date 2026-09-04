import { SendMessage, OpenWebSocket } from "./network/lobbyWebManager.js";
import { playerManager } from "./playerManager.js";
import { Player } from "./player.js";

let username;
let role;

OpenWebSocket();

export function playerSendSuccess (uuid) {
  let player = new Player(username, role, null ,uuid);
  if (!playerManager.usernameExists(player.username)) {
    playerManager.addOrUpdate(player);
    console.log('[LOBBY] - new player added successfully.');
    console.log(playerManager.all())
  }
  else {
    console.log('[LOBBY] - username already exists.');
    console.log(playerManager.all())
  }
}

//region Buttons Logic
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

  document.getElementById('toLobby').classList.remove('hidden');
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

  document.getElementById('toLobby').classList.remove('hidden');
})

document.getElementById('rejoin').addEventListener('click', () => {
  username = (document.getElementById('lobbyUsername').value);
  const lobbyCode = document.getElementById('lobbyCode').value;

  SendMessage({
    message: 'Fuck you',
    username: username,
    //lobbyCode: lobbyCode, //currently not in use
  })

  document.getElementById('auth-box').classList.add('hidden');
  document.getElementById('lobby-box').classList.remove('hidden');
})

document.getElementById('toLobby').addEventListener('click', () => {
  document.getElementById('auth-box').classList.add('hidden');
  document.getElementById('lobby-box').classList.remove('hidden');

  renderLobbyList(playerManager.players);
})

document.getElementById('devBypass').addEventListener('click', () => {
  window.location.href='mainGame.html';
})
//endregion

//region LobbyRenderer
function renderAvatar(player) {
  if (player.avatarUrl) {
    const img = document.createElement('img');
    img.className = 'avatar';
    img.src = player.avatarUrl;
    return img;
  }

  // Fallback: colored circle with first letter of username
  const div = document.createElement('div');
  div.className = 'avatar avatar-placeholder';
  div.textContent = player.username.charAt(0).toUpperCase();
  div.style.backgroundColor = stringToColor(player.username);
  return div;
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
}

function renderLobbyList(players) {
  const listEl = document.getElementById('lobby-list');
  const countEl = document.getElementById('player-count');

  listEl.innerHTML = '';

  const playerList = players instanceof Map ? [...players.values()] : players;

  for (const player of playerList) {
    const li = document.createElement('li');
    li.className = `lobby-player role-${player.role}`;
    if (player.isHost) li.classList.add('host');

    li.appendChild(renderAvatar(player));

    const span = document.createElement('span');
    span.textContent = player.username;
    li.appendChild(span);

    listEl.appendChild(li);
  }

  countEl.textContent = playerList.length;
}
//endregion
