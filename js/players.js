import { map } from './map-init.js';
import { players } from './config.js';

export function toGeoJSON(playerList) {
  return {
    type: 'FeatureCollection',
    features: playerList.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { playerId: p.id }
    }))
  };
}

export function initPlayerLayer() {
  map.addSource('players', { type: 'geojson', data: toGeoJSON(players) });

  map.addLayer({
    id: 'player-points',
    type: 'circle',
    source: 'players',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ff4444',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
}
