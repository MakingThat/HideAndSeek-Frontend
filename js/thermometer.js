import { outerRing } from './config.js';
import { zones, rebuildSources } from "./zones.js";

import { map } from './map-init.js';

let midpointFeatures = [];

function ensureMidpointLayer() {
  if (map.getSource('midpoints')) return;

  map.addSource('midpoints', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });

  map.addLayer({
    id: 'midpoint-points',
    type: 'circle',
    source: 'midpoints',
    paint: {
      'circle-radius': 8,
      'circle-color': '#4444ff',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
}

function getPlayAreaDiagonalKm() {
  const bbox = turf.bbox(turf.polygon([outerRing])); // [minX, minY, maxX, maxY]
  const corner1 = turf.point([bbox[0], bbox[1]]);
  const corner2 = turf.point([bbox[2], bbox[3]]);
  return turf.distance(corner1, corner2, { units: 'kilometers' });
}

export function newThermometer(startPoint, endPoint, showMidpoint) {

  const midpoint = turf.midpoint(turf.point([startPoint.lng, startPoint.lat]), turf.point([endPoint.lng, endPoint.lat]));
  console.log(midpoint);

  if (showMidpoint) {
    ensureMidpointLayer();

    midpointFeatures.push(midpoint);
    map.getSource('midpoints').setData({
      type: 'FeatureCollection',
      features: midpointFeatures
    });
  }

  let dirBearing = turf.bearing(turf.point([startPoint.lng, startPoint.lat]), turf.point([endPoint.lng, endPoint.lat]));
  // dirBearing = (dirBearing + 360) % 360;
  console.log(dirBearing);
  const perpBearing = dirBearing + 90;
  console.log(perpBearing);

  const endPointPoint = turf.point([endPoint.lng, endPoint.lat]);

  const D = getPlayAreaDiagonalKm();

  const lineP1 = turf.rhumbDestination(midpoint, 500, perpBearing, { units: 'kilometers' });
  const lineP2 = turf.rhumbDestination(midpoint, 500, perpBearing + 180, { units: 'kilometers'});

  const side = Math.random() < 0.5 ? dirBearing : dirBearing + 180;

  const farP1 = turf.rhumbDestination(lineP1, 500, side, { units: 'kilometers'});
  const farP2 = turf.rhumbDestination(lineP2, 500, side, { units: 'kilometers'});

  const halfPlane = turf.polygon([[
    lineP1.geometry.coordinates,
    farP1.geometry.coordinates,
    farP2.geometry.coordinates,
    lineP2.geometry.coordinates,
    midpoint.geometry.coordinates,
    lineP1.geometry.coordinates
  ]]);

  const outerPolygon = turf.polygon([outerRing])
  const clipped = turf.intersect(halfPlane, outerPolygon) || halfPlane;

  clipped.properties.inPlay = true;

  zones.push(clipped);
  rebuildSources();
}

