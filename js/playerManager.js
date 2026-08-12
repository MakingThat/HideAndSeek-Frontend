import { Player } from "./player.js";

const players = new Map();

function addOrUpdate(player) {
  players.set(player.uuid, player);
}

function addFromJSON(json) {
  const player = Player.fromJSON(json);
  addOrUpdate(player);
  return player;
}

function remove(uuid) {
  players.delete(uuid);
}

function get(uuid) {
  return players.get(uuid);
}

function all() {
  return Array.from(players.values());
}

export const playerManager = { addOrUpdate, addFromJSON, remove, get, all };
