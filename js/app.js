import { newCircleZone } from "./radar.js";
import { map } from "./map-init.js";

document.getElementById('add-area-toggle').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('add-area-panel').classList.toggle('hidden');
});

document.querySelectorAll('.dropdown-panel button')[0].addEventListener('click', () => {
  const radius = parseFloat(prompt('Radius (in km):'));
  if (isNaN(radius) || radius <= 0) return; // bail on bad/cancelled input

  document.getElementById('add-area-panel').classList.add('hidden'); // close panel
  map.getCanvas().style.cursor = 'crosshair'; // hint they need to click the map

  map.once('click', (e) => {
    map.getCanvas().style.cursor = ''; // reset cursor
    newCircleZone(e.lngLat.lng, e.lngLat.lat, radius);
  });
});

