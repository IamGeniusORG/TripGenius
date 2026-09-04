"use client";
import { Globe, Plane } from "lucide-react";
import { motion } from "framer-motion";

export function Logo({ 
  className = "w-5 h-5", 
  globeColor = "text-blue-500 dark:text-blue-400", 
  planeColor = "text-blue-600 dark:text-blue-300" 
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Globe className={`w-full h-full ${globeColor}`} strokeWidth={2} />
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40%] flex items-start justify-center pointer-events-none"
      >
        <Plane 
          className={`w-[45%] h-[45%] ${planeColor} transform rotate-[45deg] drop-shadow-md`} 
          strokeWidth={2}
          fill="currentColor"
        />
      </motion.div>
    </div>
  );
}
