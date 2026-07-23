import {players} from "./config.js";

export const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty', //style info ( to be changed later for map look customisation )
  center: [players[0].lng, players[0].lat], //centre that the map loads on ( maybe changed to per player )
  zoom: 13,
  maxBounds: [ //bounds of the play are with top right corner and bottom left
    [-4.910306, 55.655944], // top right
    [-3.744528, 55.959361]  // bottom left
  ]
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.NavigationControl());
