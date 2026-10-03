import { useState, useEffect } from 'react';

const GUEST_STORAGE_KEY = 'tripgenius_guest_itinerary';
const GUEST_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useGuestItinerary() {
  const [guestTrip, setGuestTrip] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) {
      try {
        const { itinerary, destination, dates, timestamp } = JSON.parse(stored);
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
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
    setGuestTrip({ itinerary, destination, dates });
  };

  const clearGuestTrip = () => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setGuestTrip(null);
  };

  return { guestTrip, saveGuestTrip, clearGuestTrip };
}