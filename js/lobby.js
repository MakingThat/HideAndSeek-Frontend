import { SendMessage } from "./network/lobbyWebManager.js";
import { openWebsocket } from "./network/lobbyWebManager.js";

window.addEventListener("pageshow", (event) => {
  openWebsocket();
})

document.querySelector('.team-box button')[0].addEventListener('click', () => {
  SendMessage({
    message: 'hello i would like to be a hider pretty pweese uwu'
  });
})
