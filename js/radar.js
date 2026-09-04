import { zoneRadiusKm } from "./config.js";
import { rebuildSources } from "./zones.js";
import {SendMessage} from "./network/mainGameWebManager.js";

import { zones} from "./zones.js";

export function newCircleZone(lng, lat, radius = zoneRadiusKm, inPlay, local = true) {
  const zoneCentre = [lng, lat];
  console.log(zoneCentre);
  const zone = turf.circle(zoneCentre, radius, { units: 'kilometers' });
  zone.properties.inPlay = inPlay;
  zones.push(zone);
  rebuildSources();
  if (local) {
    SendMessage({
      requestType: 'question',
      question: {
        questionType: 'Radar',
        answer: null,
        answered: false,
        position: {
          lat: lat,
          lng: lng,
        },
        radius: radius
      }
    });
    console.log('[RADAR] - Message sent to server!');
  }
}
