import { map } from './map-init.js';
import { newCircleZone } from './radar.js';
import { newThermometer } from "./thermometer.js";

import { players } from './config.js';

let hasClicked = false;
let inThermometerMode = false;

let thermoPos1;
let thermoPos2;

export function initInputs() {
  map.on('contextmenu', (e) => {
    newCircleZone(e.lngLat.lng, e.lngLat.lat, 2, true,true);
  });

  map.on('mousedown', (e) => {

    // Check if the middle mouse button was pressed
    if (e.originalEvent.button === 1) {
      console.log('Middle click at coordinates:', e.lngLat);

      inThermometerMode = true;

      map.getCanvas().style.cursor = 'crosshair';
    }
  });

  map.on( "click", (e) => {
    if (!inThermometerMode) {

    }
    else {
      if (e.originalEvent.button === 0 && !hasClicked ) {
        console.log('clicked in thermometer mode at coordinates:', e.lngLat);
        thermoPos1 = e.lngLat;
        console.log(thermoPos1);
        hasClicked = true;
      }else if (e.originalEvent.button === 0 && hasClicked) {
        console.log('clicked again in thermometer mode at coordinates:', e.lngLat);
        thermoPos2 = e.lngLat;
        console.log(thermoPos2);
        map.getCanvas().style.cursor = '';
        inThermometerMode = false;
        hasClicked = false;

        newThermometer(thermoPos1, thermoPos2, true);

      }
    }
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
