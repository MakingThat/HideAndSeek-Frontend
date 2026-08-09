import { map } from './map-init.js';
import { newCircleZone } from './radar.js';
import { newThermometer } from "./thermometer.js";

import { players } from './config.js';

let hasClicked = false;
let inThermometerMode = false;

let thermoPos1;
let thermoPos2;

export function initInputs() {
  /**
   * Does something nifty.
   *
   * @param   {number} whatsit  The whatsit to use (or whatever).
   * @returns {string} A useful value.
   */

  // map.on('mousedown', (e) => {
  //
  //   // Check if the middle mouse button was pressed
  //   if (e.originalEvent.button === 1) {
  //     console.log('Middle click at coordinates:', e.lngLat);
  //
  //     inThermometerMode = true;
  //
  //     map.getCanvas().style.cursor = 'crosshair';
  //   }
  // });

  // map.on( "click", (e) => {
  //   if (!inThermometerMode) {
  //
  //   }
  //   else {
  //     if (e.originalEvent.button === 0 && !hasClicked ) {
  //       console.log('clicked in thermometer mode at coordinates:', e.lngLat);
  //       thermoPos1 = e.lngLat;
  //       console.log(thermoPos1);
  //       hasClicked = true;
  //     }else if (e.originalEvent.button === 0 && hasClicked) {
  //       console.log('clicked again in thermometer mode at coordinates:', e.lngLat);
  //       thermoPos2 = e.lngLat;
  //       console.log(thermoPos2);
  //       map.getCanvas().style.cursor = '';
  //       inThermometerMode = false;
  //       hasClicked = false;
  //
  //       newThermometer(thermoPos1, thermoPos2, true);
  //
  //     }
  //   }
  // })

  // let lastMousePos = null;
  //
  // map.on('mousemove', (e) => {
  //   lastMousePos = e.point; // {x,y} screen pixel coords
  // });
  //
  // document.addEventListener('keydown', (e) => {
  //   if (!lastMousePos) return;
  //
  //   if (e.key === 'R') {
  //     const lnglat = map.unproject(lastMousePos);
  //     newCircleZone(lnglat.lng, lnglat.lat, 5, false);
  //   }
  // })
}

//region UI Radar
document.getElementById('radarButton').addEventListener('click', () => {
  document.getElementById('add-area-panel').classList.add('hidden');
  document.getElementById('radar-zone-modal').classList.remove('hidden');
});

document.getElementById('rz-cancel').addEventListener('click', () => {
  document.getElementById('radar-zone-modal').classList.add('hidden');
});

document.getElementById('rz-confirm').addEventListener('click', () => {
  const radius = parseFloat(document.getElementById('rz-radius').value);
  if (isNaN(radius) || radius <= 0) return; // bail on bad input

  const latInput = document.getElementById('rz-lat').value;
  const lngInput = document.getElementById('rz-lng').value;

  document.getElementById('radar-zone-modal').classList.add('hidden');

  // reset fields for next time
  document.getElementById('rz-radius').value = '';
  document.getElementById('rz-lat').value = '';
  document.getElementById('rz-lng').value = '';

  if (latInput !== '' && lngInput !== '') {
    // lat/lng provided directly, no need to click the map
    newCircleZone(parseFloat(lngInput), parseFloat(latInput), radius, undefined, true);
    return;
  }

  // fall back to click-to-place
  map.getCanvas().style.cursor = 'crosshair';
  map.once('click', (e) => {
    map.getCanvas().style.cursor = '';
    newCircleZone(e.lngLat.lng, e.lngLat.lat, radius, undefined, true);
  });
});
//endregion

//region UI Thermometer
document.getElementById('thermButton').addEventListener('click', () => {
  document.getElementById('add-area-panel').classList.add('hidden');
  document.getElementById('thermometer-modal').classList.remove('hidden');
});

document.getElementById('therm-cancel').addEventListener('click', () => {
  document.getElementById('thermometer-modal').classList.add('hidden');
});

document.getElementById('therm-confirm').addEventListener('click', () => {
  const startLat = document.getElementById('therm-start-lat').value;
  const startLng = document.getElementById('therm-start-lng').value;
  const endLat = document.getElementById('therm-end-lat').value;
  const endLng = document.getElementById('therm-end-lng').value;

  document.getElementById('thermometer-modal').classList.add('hidden');

  const hasStart = startLat !== '' && startLng !== '';
  const hasEnd = endLat !== '' && endLng !== '';

  // reset fields for next time
  document.getElementById('therm-start-lat').value = '';
  document.getElementById('therm-start-lng').value = '';
  document.getElementById('therm-end-lat').value = '';
  document.getElementById('therm-end-lng').value = '';

  if (hasStart && hasEnd) {
    // both provided directly, no map clicks needed
    const startPoint = { lat: parseFloat(startLat), lng: parseFloat(startLng) };
    const endPoint = { lat: parseFloat(endLat), lng: parseFloat(endLng) };
    newThermometer(startPoint, endPoint, true);
    return;
  }

  // fall back to click-to-place for whichever point(s) are missing
  map.getCanvas().style.cursor = 'crosshair';

  let thermoPos1 = hasStart ? { lat: parseFloat(startLat), lng: parseFloat(startLng) } : null;
  let thermoPos2 = hasEnd ? { lat: parseFloat(endLat), lng: parseFloat(endLng) } : null;

  const clickHandler = (e) => {
    if (!thermoPos1) {
      thermoPos1 = e.lngLat;
      console.log('start point set at', thermoPos1);
      return; // wait for the next click for the end point
    }

    thermoPos2 = e.lngLat;
    console.log('end point set at', thermoPos2);
    map.getCanvas().style.cursor = '';
    map.off('click', clickHandler);
    newThermometer(thermoPos1, thermoPos2, true);
  };

  map.on('click', clickHandler);
});
//endregion
