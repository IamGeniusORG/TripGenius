import { useState, useEffect, useCallback } from 'react';

export interface GuestTripData {
  itinerary: any;
  destination: string;
  dates: string;
  timestamp: number;
}

const GUEST_STORAGE_KEY = 'tripgenius_guest_itinerary';
const GUEST_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useGuestItinerary() {
  const [guestTrip, setGuestTrip] = useState<GuestTripData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        let rawData = stored;
        try {
          rawData = decodeURIComponent(stored);
        } catch {
          // Fallback if legacy stored data was not URI-encoded
          rawData = stored;
        }
        const parsed = JSON.parse(rawData);
        if (parsed?.itinerary) {
          const timestamp = typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now();
          if (Date.now() - timestamp > GUEST_TTL) {
            localStorage.removeItem(GUEST_STORAGE_KEY);
            setGuestTrip(null);
          } else {
            setGuestTrip({
              itinerary: parsed.itinerary,
              destination: parsed.destination || "",
              dates: parsed.dates || "",
              timestamp,
            });
          }
        }
      }
    } catch (e) {
      console.error("[useGuestItinerary] Failed to load guest trip:", e);
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {}
      setGuestTrip(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const saveGuestTrip = useCallback((itinerary: any, destination: string, dates: string) => {
    const timestamp = Date.now();
    const data: GuestTripData = {
      itinerary,
      destination,
      dates,
      timestamp,
    };
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(GUEST_STORAGE_KEY, encodeURIComponent(serialized));
    } catch (err) {
      console.error("[useGuestItinerary] Failed to encode and save guest itinerary:", err);
    }
    setGuestTrip(data);
  }, []);

  const clearGuestTrip = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
    setGuestTrip(null);
  }, []);

  return { guestTrip, saveGuestTrip, clearGuestTrip, isHydrated };
}