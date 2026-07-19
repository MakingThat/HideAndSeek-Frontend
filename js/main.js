import { map } from './map-init.js';
import { initPlayerLayer } from './players.js';
import { initZoneLayers, initZoneInteractions } from './zones.js';
import { initCatMarker } from './markers.js';
import { openWebsocket} from "./network/websocketManager.js";

map.on('load', () => {
  initPlayerLayer();
  initZoneLayers();
  initZoneInteractions();
  initCatMarker();
  openWebsocket();
});
