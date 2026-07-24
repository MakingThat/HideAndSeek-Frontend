import { SendMessage, openWebsocket } from "./network/lobbyWebManager.js";

openWebsocket();

document.querySelectorAll('.team-box button')[0].addEventListener('click', () => {
  SendMessage({
    message: 'hello i would like to be a hider pretty pweese uwu'
  });
})
