import { useState, useEffect } from 'react';

const GUEST_STORAGE_KEY = 'tripgenius_guest_itinerary';
const GUEST_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useGuestItinerary() {
  const [guestTrip, setGuestTrip] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) {
      try {
        let rawData = stored;
        try {
          rawData = decodeURIComponent(stored);
        } catch {
          // Fallback if legacy stored data was not URI-encoded
          rawData = stored;
        }
        const { itinerary, destination, dates, timestamp } = JSON.parse(rawData);
        if (Date.now() - timestamp > GUEST_TTL) {
          // Expired
          localStorage.removeItem(GUEST_STORAGE_KEY);
          setGuestTrip(null);
        } else {
          setGuestTrip({ itinerary, destination, dates });
        }
      } catch (e) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
    }
  }, []);

  const saveGuestTrip = (itinerary: any, destination: string, dates: string) => {
    const data = {
      itinerary,
      destination,
      dates,
      timestamp: Date.now()
    };
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(GUEST_STORAGE_KEY, encodeURIComponent(serialized));
    } catch (err) {
      console.error("[useGuestItinerary] Failed to encode and save guest itinerary:", err);
    }
    setGuestTrip({ itinerary, destination, dates });
  };

  const clearGuestTrip = () => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setGuestTrip(null);
  };

  return { guestTrip, saveGuestTrip, clearGuestTrip };
}