"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Sparkles, Wallet, Plane, ArrowRight, Loader2, Utensils, Navigation, Bed } from "lucide-react";
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

export default function Home() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  
  // Setup tabs default value
  const [activeTab, setActiveTab] = useState("day-0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    
    setIsLoading(true);
    setItinerary(null);
    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, dateRange: date, budget, travelStyle }),
      });

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
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
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      {/* Soft Dot Pattern Background */}
      <main className="flex-1 relative bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]">
        
        <section className="relative pt-32 pb-48 lg:pt-40 lg:pb-56 flex flex-col items-center justify-center min-h-[80vh]">
          {/* Subtle gradient overlay to fade the dots out towards edges */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--tw-gradient-stops)_80%)] from-transparent to-zinc-50 dark:to-zinc-950" />
          
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/50 dark:bg-blue-900/10 px-3 py-1 text-sm text-blue-600 mb-8 dark:border-blue-800 dark:text-blue-400 backdrop-blur-sm shadow-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Trip Planning</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 drop-shadow-sm">
              Design your perfect trip in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">seconds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 font-medium">
              Tell us where you want to go and what you love doing. Our AI will craft a personalized itinerary that matches your vibe and budget perfectly.
            </p>

            <Card className="w-full max-w-4xl text-left shadow-xl hover:shadow-2xl transition-shadow duration-500 border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Plan your next adventure</CardTitle>
                <CardDescription className="text-base">Fill out the details below to generate your custom itinerary.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" onSubmit={handleSubmit}>
                  
                  {/* Destination */}
                  <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="destination" className="text-sm font-semibold">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input 
                        id="destination" 
                        placeholder="Tokyo, Japan" 
                        className="pl-9 h-11" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 lg:col-span-1">
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
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="budget" className="text-sm font-semibold">Budget</Label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger id="budget" className="h-11">
                        <div className="flex items-center">
                          <Wallet className="mr-2 h-4 w-4 text-zinc-500" />
                          <SelectValue placeholder="Select budget" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget-friendly</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Style */}
                  <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="style" className="text-sm font-semibold">Travel Style</Label>
                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                      <SelectTrigger id="style" className="h-11">
                        <div className="flex items-center">
                          <Plane className="mr-2 h-4 w-4 text-zinc-500" />
                          <SelectValue placeholder="Select style" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed & Leisure</SelectItem>
                        <SelectItem value="adventure">Adventure & Outdoors</SelectItem>
                        <SelectItem value="culture">Culture & History</SelectItem>
                        <SelectItem value="foodie">Food & Culinary</SelectItem>
                        <SelectItem value="party">Nightlife & Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <div className="lg:col-span-4 mt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200" 
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

            {/* Results Section */}
            <AnimatePresence>
              {itinerary && (
                <motion.div 
                  id="itinerary-results" 
                  className="w-full max-w-4xl text-left mt-12 scroll-mt-24"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 drop-shadow-sm">
                      {itinerary.title || "Your Custom Itinerary"}
                    </h2>
                    {itinerary.summary && (
                      <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        {itinerary.summary}
                      </p>
                    )}
                  </div>

                  {itinerary.accommodations && Array.isArray(itinerary.accommodations) && (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-12">
                      <h3 className="flex items-center text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 px-2">
                        <Bed className="h-6 w-6 mr-3 text-blue-500" />
                        Accommodation Options
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {itinerary.accommodations.map((acc: any, i: number) => (
                          <motion.div key={i} variants={itemVariants}>
                            <Card className="h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-lg transition-shadow duration-300">
                              <CardHeader className="pb-3">
                                <Badge variant="outline" className="w-fit mb-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{acc.tier || acc.type}</Badge>
                                <CardTitle className="text-xl leading-tight">{acc.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                                  {day.day || day.title || `Day ${idx + 1}`}
                                </h3>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                  {day.description || day.summary || ""}
                                </p>
                              </motion.div>
                              
                              <div className="space-y-8">
                                {/* Activities Timeline */}
                                {day.activities && (
                                  <motion.div variants={itemVariants}>
                                    <h4 className="flex items-center text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
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
                                                  <Badge variant="secondary" className="mb-3 font-semibold bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 pointer-events-none text-[13px] px-3 py-1">
                                                    {act.time}
                                                  </Badge>
                                                )}
                                                <div className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed space-y-2">
                                                  {typeof act === 'string' ? act : (
                                                    act.description || act.name || act.activity
                                                  )}
                                                </div>
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
      </main>
    </div>
  );
}
