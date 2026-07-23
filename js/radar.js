import { zoneRadiusKm } from "./config.js";
import { rebuildSources } from "./zones.js";
import {SendMessage} from "./network/websocketManager.js";

import { zones} from "./zones.js";

export function newCircleZone(lng, lat, radius = zoneRadiusKm, inPlay = true) {
  const zoneCentre = [lng, lat];
  console.log(zoneCentre);
  const zone = turf.circle(zoneCentre, radius, { units: 'kilometers' });
  zone.properties.inPlay = inPlay;
  zones.push(zone);
  rebuildSources();
  SendMessage({
    position: {lat: lat, lng: lng,},
    radius: radius,
    inPlay,
    requestType: 'radarQuestion'
  });
}
