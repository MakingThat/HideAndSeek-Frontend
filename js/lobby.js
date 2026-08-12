import { SendMessage, openWebsocket } from "./network/lobbyWebManager.js";

openWebsocket();

document.getElementById('hiderRoleSelect').addEventListener('click', () => {
  const username = (document.getElementById('lobbyUsername').value);
  const role = 'hider'

  SendMessage({
    username: username,
    role: role,
  })

  console.log('username: ', username , 'as role: ', role)
})

document.getElementById('seekerRoleSelect').addEventListener('click', () => {
  const username = (document.getElementById('lobbyUsername').value);
  const role = 'seeker'

  SendMessage({
    username: username,
    role: role,
  })

  console.log('username: ', username , 'as role: ', role)
})
