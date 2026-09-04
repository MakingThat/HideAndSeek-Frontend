import { map } from './map-init.js';
import { initPlayerLayer } from './playerRenderer.js';
import { initZoneLayers, initZoneInteractions } from './zones.js';
import { initCatMarker } from './markers.js';
import { OpenWebSocket } from "./network/mainGameWebManager.js";
import { initInputs } from "./input.js";

map.on('load', () => {
  initPlayerLayer();
  initZoneLayers();
  initInputs();
  initZoneInteractions();
  // initCatMarker();
  OpenWebSocket();
});

//TODO MAKE WEBPACK WORK


