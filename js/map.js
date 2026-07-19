const players = [
  { id: 'player1', lat: 55.72465816942697, lng: -3.8298478649096768 }, //Jamie 55.72465816942697, -3.8298478649096768
  { id: 'player2', lat: 55.93621741103109, lng: -4.827277395396694 } //Scott 55.93621741103109, -4.827277395396694
];

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [players[0].lng, players[0].lat],
  zoom: 13,
  maxBounds: [
    [-4.910306, 55.655944], //55°39'21.4"N 4°54'37.1"W southwest corner of map (off the coast at adrasson)
    [-3.744528, 55.959361] //55°57'33.7"N 3°44'40.3"W northeast corner of map (kinda near falkirk)
  ],

});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.addControl(new maplibregl.NavigationControl());

function toGeoJSON(players) {
  return {
    type: 'FeatureCollection',
    features: players.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { playerId: p.id }
    }))
  };
}

map.on('load', () => {
  // forehead = map.loadImage('./img/FOREHEAD.png');
  // map.addImage('kev', forehead.data);

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
    },
  });

  map.addSource('scott', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-4.827277395396694, 55.93621741103109]}
    }
  })
});

//circle zone with inner infill
// const zoneCenter = [-3.82, 55.72]; // [lng, lat]
// const zoneRadiusKm = 0.5; // 500m
//
// const zone = turf.circle(zoneCenter, zoneRadiusKm, { units: 'kilometers' });
//
// map.on('load', () => {
//   map.addSource('zone', { type: 'geojson', data: zone });
//
//   map.addLayer({
//     id: 'zone-fill',
//     type: 'fill',
//     source: 'zone',
//     paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.15 }
//   });
//
//   map.addLayer({
//     id: 'zone-outline',
//     type: 'line',
//     source: 'zone',
//     paint: { 'line-color': '#3388ff', 'line-width': 2 }
//   });
// });

//circle zone with inner infill + inverse mask
const zoneCenter = [-3.82, 55.72]; // [lng, lat]
const zoneRadiusKm = 0.5; // 500m

const zone = turf.circle(zoneCenter, zoneRadiusKm, { units: 'kilometers' });

const outerRing = [
  [-180, -85],
  [180, -85],
  [180, 85],
  [-180, 85],
  [-180, -85]
];
const innerRing = zone.geometry.coordinates[0];

const mask = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [outerRing, innerRing]
  }
};

map.on('load', () => {
  map.addSource('zone', { type: 'geojson', data: zone });
  map.addSource('mask', { type: 'geojson', data: mask });

  // mask first so it sits underneath the zone outline/fill
  map.addLayer({
    id: 'mask-layer',
    type: 'fill',
    source: 'mask',
    paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.6 }
  });

  map.addLayer({
    id: 'zone-fill',
    type: 'fill',
    source: 'zone',
    paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.15 }
  });

  map.addLayer({
    id: 'zone-outline',
    type: 'line',
    source: 'zone',
    paint: { 'line-color': '#3388ff', 'line-width': 2 }
  });
});

//image drawing on screen
map.on('load', async () => {
  image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
  map.addImage('cat', image.data);
  map.addSource('point', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          }
        }
      ]
    }
  });
  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'scott',
    'layout': {
      'icon-image': 'cat',
      'icon-size': 0.08
    }
  });
});

console.log(toGeoJSON(players));
