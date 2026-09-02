import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchHazards, fetchHabitations, fetchSafeZones } from '../../services/api';

// Fix leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const safeZoneIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const habIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface GISMapProps {
  showHazards: boolean;
  showHabitations: boolean;
  showSafeZones: boolean;
  relocationData: any;
}

const GISMap: React.FC<GISMapProps> = ({ showHazards, showHabitations, showSafeZones, relocationData }) => {
  const [hazards, setHazards] = useState<any>(null);
  const [habitations, setHabitations] = useState<any>(null);
  const [safeZones, setSafeZones] = useState<any>(null);

  useEffect(() => {
    fetchHazards().then(setHazards);
    fetchHabitations().then(setHabitations);
    fetchSafeZones().then(setSafeZones);
  }, []);

  return (
    <MapContainer center={[11.60, 76.08]} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showHazards && hazards && (
        <GeoJSON 
          data={hazards} 
          style={() => ({ color: 'red', weight: 2, fillColor: '#fca5a5', fillOpacity: 0.5 })}
          onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
              layer.bindPopup(`<b>${feature.properties.name}</b><br/>Severity: ${feature.properties.severity}`);
            }
          }}
        />
      )}

      {showHabitations && habitations && (
        <GeoJSON 
          data={habitations}
          pointToLayer={(feature, latlng) => L.marker(latlng, { icon: habIcon })}
          onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
              layer.bindPopup(`<b>${feature.properties.name}</b><br/>Population: ${feature.properties.population}`);
            }
          }}
        />
      )}

      {showSafeZones && safeZones && (
        <GeoJSON 
          data={safeZones}
          pointToLayer={(feature, latlng) => L.marker(latlng, { icon: safeZoneIcon })}
          onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
              const cap = feature.properties.capacity;
              const occ = feature.properties.current_occupancy || 0;
              layer.bindPopup(`<b>${feature.properties.name}</b><br/>Capacity: ${occ} / ${cap}`);
            }
          }}
        />
      )}

      {relocationData && relocationData.routes && (
        <GeoJSON 
          data={relocationData.routes}
          style={() => ({ color: 'blue', weight: 3, dashArray: '5, 10' })}
        />
      )}
    </MapContainer>
  );
};

export default GISMap;
