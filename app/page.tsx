"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Sparkles, Wallet, Plane, ArrowRight, Loader2, Utensils, Navigation, Bed, Globe, Compass, Camera, Heart, Image as ImageIcon, ExternalLink, Sunrise, Sun, Sunset, Moon, Clock } from "lucide-react";
import { DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const POPULAR_DESTINATIONS: Record<string, string[]> = {
  "japan": ["Akihabara, Tokyo, Japan", "Arashiyama Bamboo Grove, Kyoto, Japan", "Fushimi Inari Taisha, Kyoto, Japan", "Mount Fuji, Honshu, Japan", "Osaka Castle, Osaka, Japan", "Shibuya Crossing, Tokyo, Japan"],
  "france": ["Eiffel Tower, Paris, France", "Louvre Museum, Paris, France", "Mont Saint-Michel, Normandy, France", "French Riviera, France", "Palace of Versailles, France"],
  "italy": ["Amalfi Coast, Campania, Italy", "Colosseum, Rome, Italy", "Cinque Terre, Liguria, Italy", "Duomo di Milano, Milan, Italy", "Florence Cathedral, Florence, Italy", "Leaning Tower of Pisa, Pisa, Italy", "Pantheon, Rome, Italy", "Pompeii, Campania, Italy", "Trevi Fountain, Rome, Italy", "Vatican Museums, Vatican City"],
  "usa": ["Central Park, New York, USA", "Disneyland, California, USA", "Golden Gate Bridge, San Francisco, USA", "Grand Canyon, Arizona, USA", "Las Vegas Strip, Nevada, USA", "Statue of Liberty, New York, USA", "Times Square, New York, USA", "Walt Disney World, Florida, USA", "Yellowstone, Wyoming, USA", "Yosemite, California, USA"],
  "india": ["Amber Palace, Jaipur, India", "Gateway of India, Mumbai, India", "Hawa Mahal, Jaipur, India", "Qutub Minar, Delhi, India", "Red Fort, Delhi, India", "Taj Mahal, Agra, India", "Varanasi Ghats, Uttar Pradesh, India", "Victoria Memorial, Kolkata, India"],
  "spain": ["Alhambra, Granada, Spain", "Casa Batllo, Barcelona, Spain", "Ibiza, Balearic Islands, Spain", "La Sagrada Familia, Barcelona, Spain", "Park Guell, Barcelona, Spain", "Plaza Mayor, Madrid, Spain"],
  "morocco": ["Jemaa el-Fnaa, Marrakech, Morocco", "Hassan II Mosque, Casablanca, Morocco", "Chefchaouen (Blue City), Morocco", "Sahara Desert Dunes, Merzouga, Morocco", "Bahia Palace, Marrakech, Morocco", "Medina of Fez, Fez, Morocco"],
  "uk": ["Big Ben, London, UK", "Stonehenge, Wiltshire, UK", "Tower of London, London, UK", "Edinburgh Castle, Edinburgh, UK", "British Museum, London, UK", "Lake District, Cumbria, UK"],
  "australia": ["Sydney Opera House, Sydney, Australia", "Great Barrier Reef, Queensland, Australia", "Uluru, Northern Territory, Australia", "Bondi Beach, Sydney, Australia", "Great Ocean Road, Victoria, Australia"],
  "greece": ["Acropolis of Athens, Athens, Greece", "Santorini Caldera, Santorini, Greece", "Mykonos Town, Mykonos, Greece", "Parthenon, Athens, Greece", "Meteora Monasteries, Thessaly, Greece"],
  "mexico": ["Chichen Itza, Yucatan, Mexico", "Cancun Beaches, Quintana Roo, Mexico", "Teotihuacan, State of Mexico, Mexico", "Tulum Ruins, Quintana Roo, Mexico", "Frida Kahlo Museum, Mexico City, Mexico"],
  "thailand": ["Grand Palace, Bangkok, Thailand", "Phi Phi Islands, Krabi, Thailand", "Ayutthaya Historical Park, Thailand", "Wat Arun, Bangkok, Thailand", "Chiang Mai Night Bazaar, Thailand"],
  "uae": ["Burj Khalifa, Dubai, UAE", "Sheikh Zayed Grand Mosque, Abu Dhabi, UAE", "Palm Jumeirah, Dubai, UAE", "The Dubai Mall, Dubai, UAE", "Louvre Abu Dhabi, UAE"]
};

export default function Home() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
    const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    fetch('/api/location')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setOrigin(data.city + ", " + data.country_name);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setIsLocating(false));
  }, []);
  const [budget, setBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [tripSeed, setTripSeed] = useState(1);
  
  const [activeTab, setActiveTab] = useState("day-0");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDestination(val);
    
    if (val.length >= 2) {
      const lowerVal = val.toLowerCase();
      let found = false;
      for (const [country, places] of Object.entries(POPULAR_DESTINATIONS)) {
        if (country.includes(lowerVal) || lowerVal.includes(country)) {
          setSuggestions([...places].sort());
          found = true;
          break;
        }
      }
      if (!found) {
        setSuggestions([]); // Clear previous suggestions
      }
      setShowSuggestions(true); // Always show dropdown to present the custom fallback button
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    
    setIsLoading(true);
    setItinerary(null);
    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, origin, dateRange: date, budget: isCustomBudget ? customBudget : budget, travelStyle: travelStyle.join(", ") }),
      });

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setTripSeed(Math.floor(Math.random() * 1000));
        setActiveTab("day-0");
        setTimeout(() => {
          document.getElementById('itinerary-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        alert("Failed to generate itinerary.");
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const daysData = itinerary?.days || itinerary?.trip_plan || itinerary?.["day-by-day"] || itinerary?.itinerary;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -15, y: 10 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4 } }
  };

  // Determine glow color depending on theme (neon violet/cyan for dark mode, subtle blue for light mode)
  const glowColor = mounted && resolvedTheme === "dark" 
    ? "rgba(139, 92, 246, 0.45)" // Strong violet/indigo
    : "rgba(59, 130, 246, 0.35)"; // Solid blue

  // Helper for dynamic time icons
  const getTimeIcon = (timeStr: string) => {
    if (!timeStr) return null;
    const t = timeStr.toLowerCase();
    if (t.includes('morning')) return <Sunrise className="w-3.5 h-3.5 mr-1.5 inline" />;
    if (t.includes('afternoon')) return <Sun className="w-3.5 h-3.5 mr-1.5 inline" />;
    if (t.includes('evening')) return <Sunset className="w-3.5 h-3.5 mr-1.5 inline" />;
    if (t.includes('night')) return <Moon className="w-3.5 h-3.5 mr-1.5 inline" />;
    return <Clock className="w-3.5 h-3.5 mr-1.5 inline" />;
  };

  // Custom markdown formatter for AI responses
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*\?\s*(.*?)\*\*/g, '<strong class="text-zinc-900 dark:text-zinc-100 font-bold">✨ $1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-900 dark:text-zinc-100 font-bold">$1</strong>')
      .replace(/\n\n---\n\n/g, '<hr class="my-6 border-zinc-200 dark:border-zinc-800" />')
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />');
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Navbar />
      
      {/* Reactive cursor glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`
        }}
      />

      {/* Soft Dot Pattern Background */}
      <main className="flex-1 relative z-10 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]">
        
        <section className="relative pt-32 pb-48 lg:pt-40 lg:pb-56 flex flex-col items-center justify-center min-h-[80vh]">
          {/* Subtle gradient overlay to fade the dots out towards edges */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--tw-gradient-stops)_80%)] from-transparent to-background" />
          
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative">
              {/* Decorative Floating Icons */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute hidden lg:flex left-[10%] top-10 w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl items-center justify-center border border-zinc-100 dark:border-zinc-700/50"
              >
                <Plane className="w-8 h-8 text-blue-500" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                className="absolute hidden lg:flex right-[12%] top-0 w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl items-center justify-center border border-zinc-100 dark:border-zinc-700/50"
              >
                <Compass className="w-7 h-7 text-indigo-500" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }} 
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
                className="absolute hidden lg:flex left-[15%] bottom-10 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-lg items-center justify-center border border-zinc-100 dark:border-zinc-700/50"
              >
                <Camera className="w-5 h-5 text-purple-500" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} 
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
                className="absolute hidden lg:flex right-[18%] bottom-12 w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-lg items-center justify-center border border-zinc-100 dark:border-zinc-700/50"
              >
                <Globe className="w-7 h-7 text-emerald-500" />
              </motion.div>

              <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/50 dark:bg-blue-900/10 px-4 py-1.5 text-[11px] uppercase tracking-widest font-bold text-blue-600 mb-8 dark:border-blue-800 dark:text-blue-400 backdrop-blur-sm shadow-sm relative z-10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>AI-Powered Trip Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl mb-6 drop-shadow-sm text-zinc-900 dark:text-zinc-50 leading-[1.1]">
              Design your perfect trip in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">seconds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed tracking-wide">
              Tell us where you want to go and what you love doing. Our AI will craft a personalized itinerary that matches your vibe and budget perfectly.
            </p>

            <Card className="w-full max-w-5xl text-left shadow-xl hover:shadow-2xl transition-shadow duration-500 border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl mb-8">
              <CardHeader className="pb-6 text-center md:text-left">
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Plan your next adventure</CardTitle>
                <CardDescription className="text-base text-zinc-500 dark:text-zinc-400 font-medium mt-1">Fill out the details below to generate your custom itinerary.</CardDescription>
              </CardHeader>
              <CardContent>
                                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    
                    {/* Origin */}
                    <div className="space-y-3 md:col-span-1 lg:col-span-1 relative">
                      <Label htmlFor="origin" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Departing From</Label>
                      <div className="relative">
                        <Navigation className="absolute left-4 top-4 h-6 w-6 text-emerald-500" />
                        <Input 
                          id="origin" 
                          placeholder={isLocating ? "Locating..." : "e.g. New York"} 
                          className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500" 
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-3 md:col-span-1 lg:col-span-2 mb-4 relative z-50">
                    <Label htmlFor="destination" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Where to?</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-6 w-6 text-blue-500" />
                      <Input 
                        id="destination" 
                        placeholder="e.g. Japan, Italy, France, USA..." 
                        className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500" 
                        value={destination}
                        onChange={handleDestinationChange}
                        onFocus={() => destination.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required
                        autoComplete="off"
                      />
                    </div>
                    {/* Dropdown Suggestions */}
                    <AnimatePresence>
                      {showSuggestions && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden z-[100]"
                        >
                          <div className="p-2">
                            <button
                              type="button"
                              className="w-full text-left px-4 py-3 bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-700 dark:text-blue-300 font-bold flex items-center border border-blue-100 dark:border-blue-800/50"
                              onClick={() => {
                                setShowSuggestions(false);
                              }}
                            >
                              <Sparkles className="h-4 w-4 mr-3 text-blue-500" />
                              Plan trip to "{destination}"
                            </button>
                            
                            {suggestions.length > 0 && (
                              <div className="mt-2">
                                <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Top places in this country (A-Z)</div>
                                {suggestions.map((place, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-zinc-700 dark:text-zinc-200 font-medium flex items-center"
                                    onClick={() => {
                                      setDestination(place);
                                      setShowSuggestions(false);
                                    }}
                                  >
                                    <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                                    {place}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 md:col-span-1">
                    <Label className="text-sm font-semibold">Dates</Label>
                    <Popover>
                      <PopoverTrigger
                        id="date"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full h-11 justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                            </>
                          ) : (
                            format(date.from, "LLL dd")
                          )
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate as any}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3 md:col-span-1">
                    <Label className="text-sm font-semibold">Budget</Label>
                    <div className="flex flex-col space-y-2">
                      {[
                          { id: "budget", label: "Budget", icon: "🎒" },
                          { id: "moderate", label: "Moderate", icon: "🏨" },
                          { id: "luxury", label: "Luxury", icon: "✨" },
                          { id: "custom", label: "Custom", icon: "✏️" }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (opt.id === "custom") {
                                setIsCustomBudget(true);
                                setBudget("");
                              } else {
                                setIsCustomBudget(false);
                                setBudget(opt.id);
                              }
                            }}
                            className={cn(
                              "flex items-center w-full px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border-2 text-left",
                              (!isCustomBudget && budget === opt.id) || (isCustomBudget && opt.id === "custom")
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm" 
                                : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                            )}
                          >
                            <span className="mr-3 text-lg">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                        {isCustomBudget && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1">
                            <Input 
                              placeholder="e.g. $5,000 for 2 people" 
                              value={customBudget}
                              onChange={(e) => setCustomBudget(e.target.value)}
                              className="bg-zinc-50 dark:bg-zinc-900/50 border-blue-200 dark:border-blue-800/50 focus-visible:ring-blue-500"
                            />
                          </motion.div>
                        )}
                    </div>
                  </div>

                  {/* Travel Style */}
                  <div className="space-y-3 md:col-span-1">
                    <Label className="text-sm font-semibold">Travel Style</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                          { id: "relaxed", label: "Relaxed", icon: "🌴" },
                          { id: "adventure", label: "Adventure", icon: "🏔️" },
                          { id: "culture", label: "Culture", icon: "🏛️" },
                          { id: "foodie", label: "Foodie", icon: "🍜" },
                          { id: "party", label: "Nightlife", icon: "🎉" }
                        ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setTravelStyle(prev => prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id])}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 border-2",
                            travelStyle.includes(opt.id) 
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm" 
                              : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <span className="mr-2">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-3 mt-6 flex justify-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full max-w-sm h-12 text-base font-bold tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Crafting your itinerary...
                        </>
                      ) : (
                        <>
                          Generate Itinerary
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>

            {/* Features Section - Only shown before generating an itinerary */}
            {!itinerary && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-5xl mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-2">Smart AI Generation</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Our advanced models analyze millions of options to craft a hyper-personalized trip that matches your exact vibe.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-2">Real-Time Imagery</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">See your itinerary come to life instantly with gorgeous photos of the exact locations and accommodations.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-2">Flexible Options</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">We don't dictate your schedule. Get multiple tiers of hotels and alternative daily activities to choose from.</p>
                </div>
              </motion.div>
            )}

            {/* Results Section */}
            <AnimatePresence>
              {itinerary && (
                <motion.div 
                  id="itinerary-results" 
                  className="w-full max-w-5xl text-left mt-12 scroll-mt-24"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {itinerary.imageKeyword && (
                    <motion.div variants={itemVariants} className="w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-10 shadow-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <img 
                        src={`/api/image?query=${encodeURIComponent(itinerary.imageKeyword)}`} 
                        alt={itinerary.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </motion.div>
                  )}
                  
                  <div className="mb-12 text-center">
                                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                      {origin && (
                        <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50">
                          🛫 {origin}
                        </Badge>
                      )}
                      {destination && (
                        <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                          📍 {destination}
                        </Badge>
                      )}
                      {(budget || customBudget) && (
                        <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50">
                          💰 {isCustomBudget ? customBudget : budget}
                        </Badge>
                      )}
                      {travelStyle && travelStyle.length > 0 && (
                        <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50">
                          ✨ {travelStyle.join(" + ")}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-50 dark:to-zinc-400 mb-4 drop-shadow-sm pb-1">
                      {itinerary.title || "Your Custom Itinerary"}
                    </h2>
                    {itinerary.summary && (
                      <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        {itinerary.summary}
                      </p>
                    )}
                  </div>

                  {itinerary.topDestinations && Array.isArray(itinerary.topDestinations) && itinerary.topDestinations.length > 0 && (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-16">
                      <h3 className="flex items-center text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 px-2">
                        <MapPin className="h-6 w-6 mr-3 text-blue-500" />
                        Top Destinations (A-Z)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {itinerary.topDestinations.map((dest: any, i: number) => (
                            <motion.div key={i} variants={itemVariants}>
                              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name)}`} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer relative group">
                                <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                                <Card className="h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 overflow-hidden">
                              <div className="h-32 w-full relative overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                {dest.imageKeyword && (
                                  <img 
                                    src={`/api/image?query=${encodeURIComponent(dest.imageKeyword)}`} 
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <h4 className="absolute bottom-3 left-3 right-3 text-white font-bold text-lg leading-tight truncate">{dest.name}</h4>
                              </div>
                              <CardContent className="p-4">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium line-clamp-3">
                                  {dest.description}
                                  </p>
                                </CardContent>
                                </Card>
                              </a>
                            </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {itinerary.accommodations && Array.isArray(itinerary.accommodations) && (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-12">
                      <h3 className="flex items-center text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 px-2">
                        <Bed className="h-6 w-6 mr-3 text-blue-500" />
                        Accommodation Options
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {itinerary.accommodations.map((acc: any, i: number) => (
                          <motion.div key={i} variants={itemVariants}>
                            <Card className="h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-lg transition-shadow duration-300">
                              <CardHeader className="pb-3 relative overflow-hidden rounded-t-xl p-0 h-40 mb-4">
                                {acc.imageKeyword ? (
                                  <img 
                                    src={`/api/image?query=${encodeURIComponent(acc.imageKeyword)}`} 
                                    alt={acc.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                                )}
                                <Badge variant="outline" className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-50 font-bold tracking-wide uppercase text-[10px] backdrop-blur-sm border-none shadow-sm">{acc.tier || acc.type}</Badge>
                              </CardHeader>
                              <CardContent>
                                <CardTitle className="text-xl font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-100 mb-3">{acc.name}</CardTitle>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                  {acc.description}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {daysData ? (
                    Array.isArray(daysData) ? (
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="flex flex-wrap h-auto w-full justify-start p-1.5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl shadow-sm mb-10 border border-zinc-200/60 dark:border-zinc-800/60 gap-1.5">
                          {daysData.map((day: any, idx: number) => (
                            <TabsTrigger 
                              key={idx} 
                              value={`day-${idx}`} 
                              className="px-6 py-2.5 rounded-lg font-medium text-base transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              Day {idx + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {daysData.map((day: any, idx: number) => (
                          <TabsContent key={idx} value={`day-${idx}`} className="outline-none mt-0">
                            <motion.div 
                              key={activeTab} // Forces re-animation when tab changes
                              variants={containerVariants}
                              initial="hidden"
                              animate="show"
                              className="bg-white/70 dark:bg-zinc-900/70 p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md"
                            >
                              <motion.div variants={itemVariants} className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                                {day.imageKeyword && (
                                  <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 shadow-md border border-zinc-200/60 dark:border-zinc-800/60">
                                    <img 
                                      src={`/api/image?query=${encodeURIComponent(day.imageKeyword)}`} 
                                      alt={`Day ${idx + 1}`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                )}
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
                                  {day.day || day.title || `Day ${idx + 1}`}
                                </h3>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                  {day.description || day.summary || ""}
                                </p>
                              </motion.div>
                              
                              <div className="space-y-8">
                                {/* Activities Timeline */}
                                {day.activities && (
                                  <motion.div variants={itemVariants}>
                                    <h4 className="flex items-center text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 mb-6">
                                      <Navigation className="h-6 w-6 mr-3 text-blue-500" /> 
                                      Activities
                                    </h4>
                                    
                                    <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 md:ml-4 space-y-6 pb-4">
                                      {Array.isArray(day.activities) 
                                        ? day.activities.map((act: any, i: number) => (
                                          <motion.div key={i} variants={itemVariants} className="relative pl-8 md:pl-10 group">
                                            {/* Timeline Node */}
                                            <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full border-2 border-blue-500 bg-white dark:bg-zinc-950 shadow-sm transition-transform duration-300 group-hover:scale-125 group-hover:bg-blue-100 dark:group-hover:bg-blue-900" />
                                            
                                            <Card className="hover:shadow-md transition-shadow duration-300 border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-900">
                                              <CardContent className="p-5 flex flex-col items-start pt-5 relative">
                                                {act.time && (
                                                  <Badge variant="secondary" className="mb-3 font-bold uppercase tracking-wider bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 pointer-events-none text-[11px] px-3 py-1">
                                                    {act.time}
                                                  </Badge>
                                                )}
                                                                                                  <div 
                                                    className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed font-medium"
                                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(typeof act === 'string' ? act : (act.description || act.name || act.activity)) }}
                                                  />
                                              </CardContent>
                                            </Card>
                                          </motion.div>
                                        ))
                                        : (
                                          <motion.div variants={itemVariants} className="relative pl-8 md:pl-10">
                                            <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full border-2 border-blue-500 bg-white dark:bg-zinc-950 shadow-sm" />
                                            <Card className="hover:shadow-md transition-shadow duration-300 bg-white dark:bg-zinc-900">
                                              <CardContent className="p-5">
                                                <p className="text-zinc-700 dark:text-zinc-300">{day.activities}</p>
                                              </CardContent>
                                            </Card>
                                          </motion.div>
                                        )
                                      }
                                    </div>
                                  </motion.div>
                                )}
                                
                                {/* Dining */}
                                {(day.dining || day.dining_options) && (
                                  <motion.div variants={itemVariants} className="mt-12 bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100/60 dark:border-orange-800/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <h4 className="flex items-center text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">
                                      <Utensils className="h-6 w-6 mr-3" /> 
                                      Dining Options
                                    </h4>
                                    <div className="text-base text-zinc-700 dark:text-zinc-300 space-y-3 pl-2">
                                      {Array.isArray(day.dining || day.dining_options)
                                        ? (day.dining || day.dining_options).map((meal: string, i: number) => (
                                          <div key={i} className="flex items-start">
                                            <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"></span>
                                            <span className="flex-1 leading-relaxed">{meal}</span>
                                          </div>
                                        ))
                                        : <p className="leading-relaxed">{typeof (day.dining || day.dining_options) === 'string' ? (day.dining || day.dining_options) : JSON.stringify(day.dining || day.dining_options)}</p>
                                      }
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 overflow-auto p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        {JSON.stringify(daysData, null, 2)}
                      </motion.pre>
                    )
                  ) : (
                    <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 overflow-auto p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      {JSON.stringify(itinerary, null, 2)}
                    </motion.pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

<Footer />
      </main>
    </div>
  );
}



