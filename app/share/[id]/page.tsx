import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ModifyTripButton from "@/components/ModifyTripButton";
import { Navbar } from "@/components/Navbar";
import { TripMapDynamic } from "@/components/TripMapDynamic";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import SaveTripButton from "@/components/SaveTripButton";
import BudgetChart from "@/components/BudgetChart";
import InteractivePackingList from "@/components/InteractivePackingList";
import { MapPin, Sparkles, Navigation, Bed, Compass, Heart, ExternalLink, Sunrise, Sun, Sunset, Moon, Clock, Plane, Train, Car, Loader2, Wallet, Camera, Globe, CalendarIcon, ArrowRight, ImageIcon, Utensils, Lightbulb, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SharedTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { userId } = await auth();
  
  const trip = await prisma.trip.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!trip) {
    notFound();
  }

  const itinerary = trip.itinerary as any;

  // Helper for dynamic time icons
  const getTimeIcon = (timeStr: string) => {
    if (!timeStr) return null;
    const t = timeStr.toLowerCase();
    if (t.includes('morning')) return <Sunrise className="w-4 h-4 mr-1.5 inline text-blue-500" />;
    if (t.includes('afternoon')) return <Sun className="w-4 h-4 mr-1.5 inline text-amber-500" />;
    if (t.includes('evening')) return <Sunset className="w-4 h-4 mr-1.5 inline text-orange-500" />;
    if (t.includes('night')) return <Moon className="w-4 h-4 mr-1.5 inline text-indigo-500" />;
    return <Clock className="w-4 h-4 mr-1.5 inline text-zinc-500" />;
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div id="itinerary-results" className="max-w-5xl mx-auto space-y-12 bg-zinc-50 dark:bg-zinc-950 p-2 md:p-8 rounded-3xl">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Shared AI Trip Plan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{itinerary.title}</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              {itinerary.summary}
            </p>

                    <div className="mt-6 mb-12 flex flex-wrap justify-center gap-3">
                      <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                          <Plane className="w-4 h-4 mr-2" /> Flights & Hotels (MakeMyTrip)
                        </Button>
                      </a>
                      <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                          <Train className="w-4 h-4 mr-2" /> Train Tickets (IRCTC)
                          </Button>
                        </a>
                        
                          <SaveTripButton tripId={trip.id} />
                            {userId === trip.userId && <ModifyTripButton trip={trip} />}
                          <DownloadPdfButton targetId="itinerary-results" filename={itinerary.title || "My_Trip"} />

                    </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="outline" className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                {trip.destination}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <Navigation className="w-4 h-4 mr-2 text-purple-500" />
                {trip.dates}
              </Badge>
            </div>
          </div>

          <div className="w-full h-[250px] md:h-[500px] rounded-3xl overflow-hidden relative shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800">
            <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(itinerary.imageKeyword || trip.destination)} 
              alt="Destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          
                    {/* Interactive Map */}
                    {(itinerary.topDestinations || itinerary.accommodations) && (
                      <TripMapDynamic locations={[
                          ...(itinerary.topDestinations || []).map((d: any) => ({ ...d, type: 'attraction' })),
                          ...(itinerary.accommodations || []).map((a: any) => ({ ...a, type: 'hotel' }))
                        ]} />
                    )}
  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl">
                  <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Daily Itinerary</h2>
              </div>
              
              <Tabs defaultValue="day-0" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-auto flex-nowrap">
                  {itinerary.days?.map((day: any, idx: number) => (
                    <TabsTrigger key={idx} value={"day-" + idx} className="px-6 py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm whitespace-nowrap">
                      {day.day}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {itinerary.days?.map((day: any, idx: number) => (
                  <TabsContent key={idx} value={"day-" + idx} className="mt-6 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 backdrop-blur-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
                      <div className="h-48 w-full relative overflow-hidden rounded-t-xl">
                        <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(day.imageKeyword)} alt={day.day} className="w-full h-full object-cover"/>
                      </div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl">{day.description}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[4.5rem] md:before:left-[6.5rem] before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                            {day.activities?.map((act: any, i: number) => (
                              <div key={i} className="relative flex gap-4 md:gap-6 z-10">
                                <div className="w-16 md:w-24 shrink-0 font-bold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 pt-3 flex items-start justify-end pr-3 md:pr-4 bg-white dark:bg-zinc-900/50 rounded-r-xl">
                                    {getTimeIcon(act.time)}
                                    <span className="hidden md:inline">{act.time}</span>
                                </div>
                                <div className="absolute left-[4.5rem] md:left-[6.5rem] top-3.5 w-3 h-3 bg-blue-500 rounded-full -translate-x-[5px] ring-4 ring-white dark:ring-zinc-900 shadow-sm" />
                                <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-blue-600 dark:prose-strong:text-blue-400 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 md:p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 shadow-sm w-full transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50">
                                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(typeof act === 'string' ? act : (act.description || act.name || act.activity)) }} />
                                </div>
                              </div>
                            ))}
                          </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="space-y-8">
              <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Heart className="w-5 h-5 mr-2 text-rose-500" />
                    Top Sights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.topDestinations?.map((dest: any, i: number) => (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name)}`} target="_blank" rel="noopener noreferrer" key={i} className="group flex gap-4 items-center p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors relative cursor-pointer pr-8">
                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-zinc-400" />
                        </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(dest.imageKeyword)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{dest.name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{dest.description}</p>
                        </div>
                      </a>
                    ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Bed className="w-5 h-5 mr-2 text-indigo-500" />
                    Where to Stay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.accommodations?.map((acc: any, i: number) => (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acc.name)}`} target="_blank" rel="noopener noreferrer" key={i} className="group flex gap-4 items-center p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors relative cursor-pointer pr-8">
                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-zinc-400" />
                        </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(acc.imageKeyword)} alt={acc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                           <h4 className="font-medium text-sm line-clamp-1">{acc.name}</h4>
                           <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-sm bg-zinc-100 dark:bg-zinc-800/50">{acc.tier || "Standard"}</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{acc.description}</p>
                      </div>
                      </a>
                    ))}
                </CardContent>
              </Card>

              {/* BUDGET CHART */}
              {itinerary.budgetBreakdown && Array.isArray(itinerary.budgetBreakdown) && itinerary.budgetBreakdown.length > 0 && (
                <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800 mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Wallet className="w-5 h-5 mr-2 text-blue-500" />
                      Estimated Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BudgetChart data={itinerary.budgetBreakdown.map((item: any) => ({ category: item.category, estimatedCost: item.estimatedCost || item.value || 0 }))} />
                  </CardContent>
                </Card>
              )}

              {/* LOCAL TIPS */}
              {itinerary.localTips && Array.isArray(itinerary.localTips) && itinerary.localTips.length > 0 && (
                <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800 mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                      Local Insider Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {itinerary.localTips.map((tip: any, i: number) => (
                        <li key={i} className="flex items-start text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="text-amber-500 mr-2 font-bold">•</span>
                          <span dangerouslySetInnerHTML={{ __html: String(tip).replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-900 dark:text-zinc-100">$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* INTERACTIVE PACKING LIST */}
              {itinerary.packingList && Array.isArray(itinerary.packingList) && itinerary.packingList.length > 0 && (
                <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800 mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Briefcase className="w-5 h-5 mr-2 text-emerald-500" />
                      Packing Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractivePackingList items={itinerary.packingList} tripId={trip.id} />
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

