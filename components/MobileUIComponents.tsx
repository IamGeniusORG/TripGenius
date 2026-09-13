"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Map, X } from "lucide-react";
import { TripMapDynamic } from "@/components/TripMapDynamic";

export function MobileDayNav({ days }: { days: any[] }) {
  const scrollToDay = (idx: number) => {
    const el = document.getElementById(`day-${idx}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 140; // Adjust for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!days || days.length === 0) return null;

  return (
    <div className="sticky top-[60px] z-[60] bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10 lg:hidden overflow-x-auto flex px-4 py-3 gap-2 no-scrollbar shadow-sm">
      {days.map((day, idx) => (
        <button 
          key={idx} 
          onClick={() => scrollToDay(idx)}
          className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
        >
          {day.day}
        </button>
      ))}
    </div>
  );
}

export function ExpandableActivityCard({ children, collapsedHeightClass = "max-h-24" }: { children: React.ReactNode, collapsedHeightClass?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div className={`overflow-hidden relative transition-all duration-300 ${expanded ? '' : `${collapsedHeightClass} lg:max-h-none`}`}>
        {children}
        {/* Fade out gradient for mobile when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/95 dark:from-[#1c1c1c]/95 to-transparent lg:hidden pointer-events-none" />
        )}
      </div>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="mt-3 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center lg:hidden hover:underline"
      >
        {expanded ? (
          <><ChevronUp className="w-3 h-3 mr-1"/> Show Less</>
        ) : (
          <><ChevronDown className="w-3 h-3 mr-1"/> Read More</>
        )}
      </button>
    </div>
  );
}

export function CollapsibleMobileWidget({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl overflow-hidden mb-6">
      <div 
        className="flex justify-between items-center p-5 cursor-pointer lg:cursor-auto"
        onClick={() => {
           if (window.innerWidth < 1024) setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center text-lg font-bold text-neutral-900 dark:text-white">
          {icon}
          {title}
        </div>
        <div className="lg:hidden text-neutral-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      <div className={`px-5 pb-5 transition-all ${!isOpen ? 'hidden lg:block' : 'block'}`}>
        {children}
      </div>
    </div>
  );
}

export function MobileMapFAB({ locations }: { locations: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!locations || locations.length === 0) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3.5 rounded-full shadow-[0_8px_30px_rgb(59,130,246,0.5)] lg:hidden flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
      >
        <Map className="w-5 h-5 mr-2" /> Map View
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col lg:hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center p-4 bg-neutral-900 border-b border-white/10">
            <h3 className="font-bold text-white flex items-center"><Map className="w-4 h-4 mr-2 text-blue-400"/> Interactive Map</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full h-full relative">
            <TripMapDynamic locations={locations} />
          </div>
        </div>
      )}
    </>
  );
}