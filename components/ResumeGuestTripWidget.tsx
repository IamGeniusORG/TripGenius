"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Sparkles, ArrowRight, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeGuestTripWidgetProps {
  guestTrip: {
    itinerary: any;
    destination: string;
    dates?: string;
    timestamp?: number;
  } | null;
  onResume: () => void;
  onClear: () => void;
}

const GUEST_TTL = 24 * 60 * 60 * 1000; // 24 Hours

export function ResumeGuestTripWidget({
  guestTrip,
  onResume,
  onClear,
}: ResumeGuestTripWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!guestTrip?.timestamp) return;

    const calculateTimeRemaining = () => {
      const expiresAt = guestTrip.timestamp! + GUEST_TTL;
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setIsExpired(true);
        onClear();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [guestTrip?.timestamp, onClear]);

  if (!guestTrip || isExpired) return null;

  const imageKeyword =
    guestTrip.itinerary?.imageKeyword || guestTrip.destination || "travel";
  const thumbnailSrc = `/api/image?query=${encodeURIComponent(imageKeyword)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-5xl mb-8 relative z-20"
      >
        <div className="bg-neutral-900/90 dark:bg-neutral-950/85 backdrop-blur-xl border border-white/10 dark:border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group">
          {/* Subtle Ambient Light Gradient */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Side: Thumbnail & Trip Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Destination Thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
              <img
                crossOrigin="anonymous"
                src={thumbnailSrc}
                alt={guestTrip.destination}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 left-1.5 flex items-center">
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
            </div>

            {/* Trip Details */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 mr-1 inline" />
                  Active Guest Trip
                </span>
                {timeLeft && (
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 mr-1 inline animate-pulse" />
                    Expires in {timeLeft}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center truncate">
                <MapPin className="w-4 h-4 mr-1.5 text-blue-400 shrink-0 inline" />
                <span className="truncate">{guestTrip.destination}</span>
              </h3>

              {guestTrip.dates && (
                <p className="text-xs text-neutral-400 flex items-center mt-0.5 truncate">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-neutral-500 shrink-0" />
                  <span className="truncate">{guestTrip.dates}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl text-xs px-3 h-9 transition-colors"
              title="Dismiss & start a new itinerary"
            >
              <X className="w-4 h-4 mr-1 sm:inline" />
              <span className="hidden sm:inline">Start New</span>
            </Button>

            <Button
              type="button"
              onClick={onResume}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm px-5 h-9 sm:h-10 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center"
            >
              Resume Journey
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
