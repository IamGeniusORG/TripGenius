"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay so it doesn't instantly flash on load
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-50"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold">
                <Cookie className="w-5 h-5 text-blue-500" />
                <span>We value your privacy</span>
              </div>
              <button 
                onClick={handleDecline}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We use strictly necessary cookies to make our site work. We'd also like to set optional cookies to help us improve it. You can opt-in below.
            </p>
            
            <div className="flex gap-2 w-full mt-2">
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm font-semibold"
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAccept}
              >
                Accept Cookies
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
