import { zoneRadiusKm } from "./config.js";
import { rebuildSources } from "./zones.js";
import {SendMessage} from "./network/websocketManager.js";

import { zones} from "./zones.js";

export function newCircleZone(lng, lat, inPlay = true) {
  const zoneCentre = [lng, lat];
  const zone = turf.circle(zoneCentre, zoneRadiusKm, { units: 'kilometers' });
  zone.properties.inPlay = inPlay;
  zones.push(zone);
  rebuildSources();
  SendMessage({
    position: {lat: lat, lng: lng,},
    radius: zoneRadiusKm,
    inPlay
  });
}
