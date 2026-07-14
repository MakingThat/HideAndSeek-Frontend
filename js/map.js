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
  ]
});

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
});
