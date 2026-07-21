export const players = [
  { id: 'player-1', name: 'Player 1', lng: -3.8298478649096768, lat: 55.72465816942697 },
  { id: 'player-2', name: "Player 2", lng: -4.827277395396694, lat: 55.93621741103109 },
  { id: 'player-3', name: 'testPos1', lng: -4.250023452344097, lat: 55.866860551610614 },
  { id: 'player-4', name: 'testPos2', lng: -4.289728469958435, lat: 55.87242513276412 },
];

export const testPositons =  [
  { lng: -4.250023452344097, lat: 55.866860551610614}, //55.866860551610614, -4.250023452344097 GCU
  { lng: -4.289728469958435, lat: 55.87242513276412} //55.87242513276412, -4.289728469958435 UofG
];

export const zoneRadiusKm = 0.5;
export const outerRing = [
  [-180,-85],
  [180,-85],
  [180,85],
  [-180,85],
  [-180,-85]
];

export const wsUri = `ws://games.lunarpixel.uk:67/questions`;
