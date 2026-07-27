import { map } from './map-init.js';
import { newCircleZone } from './radar.js';
import { newThermometer } from "./thermometer.js";

export function initInputs() {
  map.on('contextmenu', (e) => {
    newCircleZone(e.lngLat.lng, e.lngLat.lat, 2, true,true);
  })

  let lastMousePos = null;

  map.on('mousemove', (e) => {
    lastMousePos = e.point; // {x,y} screen pixel coords
  });

  document.addEventListener('keydown', (e) => {
    if (!lastMousePos) return;

    if (e.key === 'R') {
      const lnglat = map.unproject(lastMousePos);
      newCircleZone(lnglat.lng, lnglat.lat, 5, false);
    }
  })
}
