import { newCircleZone } from "./radar.js";
import { map } from "./map-init.js";

document.getElementById('add-area-toggle').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('add-area-panel').classList.toggle('hidden');
});

