export class Player {
  constructor(username, role, lnglat, uuid) {
    this.username = username;
    this.role = role;
    this.lnglat = lnglat;
    this.uuid = uuid;
  }

  static fromJSON(json) {
    if (!json) { }
    else {
      return new Player(json.username, json.role, json.lnglat, json.uuid);
    }
  }

  updatePosition(lngLat) {
    this.lngLat = lngLat;
  }

  get mapLibreLngLat() {
    return { lng: this.lngLat[0], lat: this.lngLat[1] };
  }
}
