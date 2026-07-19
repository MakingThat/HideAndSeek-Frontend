import {players} from "./config.js";

export const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [players[0].lng, players[0].lat],
  zoom: 13,
  maxBounds: [
    [-4.910306, 55.655944],
    [-3.744528, 55.959361]
  ]
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.NavigationControl());
