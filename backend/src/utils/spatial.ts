import * as turf from '@turf/turf';
import { getHazards, getHabitations, getSafeZones } from '../data/store';

// Helper to determine if a point is within any polygon in a feature collection
export function isPointInHazards(point: turf.Feature<turf.Point>, hazards: turf.FeatureCollection<turf.Polygon>) {
  for (const hazard of hazards.features) {
    if (turf.booleanPointInPolygon(point, hazard)) {
      return true;
    }
  }
  return false;
}

// Emulate PostGIS: Find vulnerable habitations (those intersecting red zones)
export function getVulnerableHabitations() {
  const habitations = getHabitations();
  const hazards = getHazards();

  const vulnerable = habitations.features.filter(hab => isPointInHazards(hab, hazards));
  
  return turf.featureCollection(vulnerable);
}

// Emulate PostGIS routing/allocation: Map vulnerable habitations to nearest safe zone with capacity
export function generateRelocationPlan() {
  const vulnerableHabs = getVulnerableHabitations();
  const safeZones = JSON.parse(JSON.stringify(getSafeZones())) as turf.FeatureCollection<turf.Point>; // deep copy to track capacity
  
  const relocationLines: turf.Feature<turf.LineString>[] = [];

  vulnerableHabs.features.forEach(hab => {
    let nearestZone: turf.Feature<turf.Point> | null = null;
    let minDistance = Infinity;
    
    const population = hab.properties?.population || 0;

    safeZones.features.forEach(zone => {
      const capacity = zone.properties?.capacity || 0;
      const current_occupancy = zone.properties?.current_occupancy || 0;
      const availableCapacity = capacity - current_occupancy;
      
      // Basic check: Does this camp have enough space for the whole village?
      // In a real scenario, we might split populations, but for prototype we map to nearest fit.
      if (availableCapacity >= population) {
        const dist = turf.distance(hab, zone);
        if (dist < minDistance) {
          minDistance = dist;
          nearestZone = zone;
        }
      }
    });

    if (nearestZone) {
      // Allocate
      nearestZone.properties!.current_occupancy += population;
      
      // Create a linestring from hab to safe zone
      const line = turf.lineString([hab.geometry.coordinates, nearestZone.geometry.coordinates], {
        hab_id: hab.properties?.id,
        hab_name: hab.properties?.name,
        safe_zone_id: nearestZone.properties?.id,
        safe_zone_name: nearestZone.properties?.name,
        population_moved: population,
        distance_km: minDistance.toFixed(2)
      });
      relocationLines.push(line);
    }
  });

  return {
    routes: turf.featureCollection(relocationLines),
    updatedSafeZones: safeZones
  };
}
