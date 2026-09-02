import mockData from './wayanad_mock.json';
import * as turf from '@turf/turf';

export const getHazards = () => mockData.hazards as turf.FeatureCollection<turf.Polygon>;
export const getHabitations = () => mockData.habitations as turf.FeatureCollection<turf.Point>;
export const getSafeZones = () => mockData.safeZones as turf.FeatureCollection<turf.Point>;
