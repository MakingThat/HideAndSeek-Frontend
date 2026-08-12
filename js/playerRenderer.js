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

async function createCircularIcon(imageUrl, size = 64, ringColor = '#ff4444', ringWidth = 4) {
  const img = await new Promise((resolve, reject) => {
    const image = new window.Image();
    // image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const centre = size / 2;
  const radius = centre - ringWidth;

  //clip the image to the circle for the icon
  ctx.save();
  ctx.beginPath();
  ctx.arc(centre, centre, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, size, size);
  ctx.restore();

  //Draw the outer ring
  ctx.beginPath();
  ctx.arc(centre, centre, radius, 0, 2 * Math.PI);
  ctx.lineWidth = ringWidth;
  ctx.strokeStyle = ringColor;
  ctx.stroke();

  return ctx.getImageData(0, 0, size, size);
}

export async function initPlayerLayer() {
  map.addSource('players', { type: 'geojson', data: toGeoJSON(players) });

  const icon = await createCircularIcon('img/FOREHEAD.png');
  if (!map.hasImage('player-icon')) {
    map.addImage('player-icon', icon);
  }

  map.addLayer({
    id: 'player-points',
    type: 'symbol',
    source: 'players',
    // paint: {
    //   'circle-radius': 8,
    //   'circle-color': '#ff4444',
    //   'circle-stroke-width': 2,
    //   'circle-stroke-color': '#ffffff'
    // }
    layout: {
      'icon-image': 'player-icon',
      'icon-size': 0.5,
      'icon-allow-overlap': true
    }
  });
}
