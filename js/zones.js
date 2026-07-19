import { map } from './map-init.js';
import { zoneRadiusKm, outerRing } from './config.js';

export let zones = [];

export function initZoneInteractions() {
  map.on('contextmenu', (e) => {
    newCircleZone(e.lngLat.lng, e.lngLat.lat);
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

function rebuildSources() {
  const zoneCollection = { type: 'FeatureCollection', features: zones };

  let mergedZones = zones[0] || null;
  for (let i = 1; i < zones.length; i++) {
    mergedZones = turf.union(mergedZones, zones[i]);
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

  map.setLayoutProperty('mask-layer', 'visibility', zones.length > 0 ? 'visible' : 'none');
}

export function newCircleZone(lng, lat) {
  const zoneCentre = [lng, lat];
  const zone = turf.circle(zoneCentre, zoneRadiusKm, { units: 'kilometers' });
  zones.push(zone);
  rebuildSources();
}

export function isPlayerInAnyZone(playerLngLat) {
  const point = turf.point(playerLngLat);
  return zones.some(zone => turf.booleanPointInPolygon(point, zone));
}

export function getZoneContainingPlayer(playerLngLat) {
  const point = turf.point(playerLngLat);
  return zones.find(zone => turf.booleanPointInPolygon(point, zone));
}
