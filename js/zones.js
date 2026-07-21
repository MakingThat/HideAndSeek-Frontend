import { map } from './map-init.js';
import { outerRing, players, testPositons } from './config.js';
import { newCircleZone} from "./radar.js";
import { newThermometer } from "./thermometer.js";

export let radarZones = [];

export function initZoneInteractions() {
  map.on('contextmenu', (e) => {
    newCircleZone(e.lngLat.lng, e.lngLat.lat);

  });

  map.on('mousedown', (e) => {
    // Check if the middle mouse button was pressed
    if (e.originalEvent.button === 1) {
      console.log('Middle click at coordinates:', e.lngLat);
      newThermometer(players[3], players[2], false);
    }
  });


  let pressTimer;

  map.on('touchstart', (e) => {
    pressTimer = setTimeout(() => {
      if (!map.isZooming() && !map.isMoving() && !map.isRotating()) {
        newCircleZone(e.lngLat.lng, e.lngLat.lat);
      }
    }, 700);
  });

  map.on('touchend', () => clearTimeout(pressTimer));
  map.on('touchmove', () => clearTimeout(pressTimer));
}

export function initZoneLayers() {
  map.addSource('zone', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addSource('zones-outline-src', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addSource('mask', {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [outerRing] } }
  });

  map.addLayer({
    id: 'mask-layer',
    type: 'fill',
    source: 'mask',
    paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.6 },
    layout: { visibility: 'none' } // hidden until first zone exists
  });

  map.addLayer({
    id: 'zone-fill',
    type: 'fill',
    source: 'zones-outline-src',
    paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.15 }
  });

  map.addLayer({
    id: 'zone-outline',
    type: 'line',
    source: 'zones-outline-src',
    paint: { 'line-color': '#3388ff', 'line-width': 2 }
  });
}

export function rebuildSources() {
  const zoneCollection = { type: 'FeatureCollection', features: radarZones };

  let mergedZones = radarZones[0] || null;
  for (let i = 1; i < radarZones.length; i++) {
    mergedZones = turf.union(mergedZones, radarZones[i]);
  }

  const holeRings = [];
  const outlineFeatures = [];

  if (mergedZones) {
    if (mergedZones.geometry.type === 'Polygon') {
      holeRings.push(mergedZones.geometry.coordinates[0]);
      outlineFeatures.push(mergedZones);
    } else if (mergedZones.geometry.type === 'MultiPolygon') {
      mergedZones.geometry.coordinates.forEach(poly => {
        holeRings.push(poly[0]);
        outlineFeatures.push(turf.polygon(poly));
      });
    }
  }

  const mask = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [outerRing, ...holeRings] }
  };

  map.getSource('zone').setData(zoneCollection);
  map.getSource('zones-outline-src').setData({ type: 'FeatureCollection', features: outlineFeatures });
  map.getSource('mask').setData(mask);

  map.setLayoutProperty('mask-layer', 'visibility', radarZones.length > 0 ? 'visible' : 'none');
}

export function isPlayerInAnyZone(playerLngLat) {
  const point = turf.point(playerLngLat);
  return radarZones.some(zone => turf.booleanPointInPolygon(point, zone));
}

export function getZoneContainingPlayer(playerLngLat) {
  const point = turf.point(playerLngLat);
  return radarZones.find(zone => turf.booleanPointInPolygon(point, zone));
}
