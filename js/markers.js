import { map } from './map-init.js';

export async function initCatMarker() {
  const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
  map.addImage('cat', image.data);

  map.addSource('scott', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-4.827277395396694, 55.93621741103109] }
    }
  });

  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: 'players',
    layout: {
      'icon-image': 'cat',
      'icon-size': 0.08
    }
  });
}
