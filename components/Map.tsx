"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2 } from "lucide-react";

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
  const [markers, setMarkers] = useState<any[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveLocations = async () => {
      const resolved = [];
      let neededGeocoding = false;

      for (const loc of locations) {
        if (!loc) continue;

        // If the AI already provided coordinates (new trips)
        if (loc.coordinates && typeof loc.coordinates.lat === 'number' && typeof loc.coordinates.lng === 'number') {
          resolved.push(loc);
        } else if (loc.name) {
          // Legacy trips: AI didn't provide coordinates. We must geocode dynamically.
          neededGeocoding = true;
          try {
            const query = encodeURIComponent(loc.name);
            const res = await fetch(`/api/geocode?q=${query}`);
            const data = await res.json();
            if (data && data.length > 0) {
              resolved.push({ 
                ...loc, 
                coordinates: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } 
              });
            }
            // Sleep for 1.1s to strictly respect OpenStreetMap's free tier rate limits (1 req/sec)
            await new Promise(r => setTimeout(r, 1100));
          } catch (e) {
            console.error("Geocoding failed for", loc.name);
          }
        }
      }

      if (isMounted) {
        setMarkers(resolved);
        setIsGeocoding(false);
      }
    };

    resolveLocations();

    return () => { isMounted = false; };
  }, [locations]);

  if (isGeocoding) {
    return (
      <div className="mb-12 w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Mapping legacy locations...
        </span>
      </div>
    );
  }

  if (markers.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 relative z-0">
    <MapContainer 
      center={[markers[0].coordinates.lat, markers[0].coordinates.lng]} 
      zoom={13} 
      scrollWheelZoom={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((loc, idx) => (
        <Marker key={idx} position={[loc.coordinates.lat, loc.coordinates.lng]} icon={customIcon}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
              {loc.type && <p className="text-xs text-zinc-500 capitalize">{loc.type}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
      <ChangeView markers={markers} />
    </MapContainer>
    </div>
  );
}