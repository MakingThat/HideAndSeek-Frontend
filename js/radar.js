import { zoneRadiusKm } from "./config.js";
import { rebuildSources } from "./zones.js";
import {SendMessage} from "./network/websocketManager.js";

import { radarZones} from "./zones.js";

export function newCircleZone(lng, lat) {
  const zoneCentre = [lng, lat];
  const zone = turf.circle(zoneCentre, zoneRadiusKm, { units: 'kilometers' });
  radarZones.push(zone);
  rebuildSources();
  SendMessage({
    position: {
      lat: lat,
      lng: lng,
    },
    radius: zoneRadiusKm
  });
}
