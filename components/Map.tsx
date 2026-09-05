"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to automatically fit bounds to all markers
function ChangeView({ markers }: { markers: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.coordinates.lat, m.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function TripMap({ locations }: { locations: any[] }) {
  // Filter out any locations that didn't get proper coordinates from the AI
  const validLocations = locations.filter(loc => loc && loc.coordinates && typeof loc.coordinates.lat === 'number' && typeof loc.coordinates.lng === 'number');

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-zinc-500 font-medium">Map data unavailable</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[validLocations[0].coordinates.lat, validLocations[0].coordinates.lng]} 
      zoom={13} 
      scrollWheelZoom={false}
      className="w-full h-full rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validLocations.map((loc, idx) => (
        <Marker key={idx} position={[loc.coordinates.lat, loc.coordinates.lng]} icon={customIcon}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
              {loc.type && <p className="text-xs text-zinc-500 capitalize">{loc.type}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
      <ChangeView markers={validLocations} />
    </MapContainer>
  );
}