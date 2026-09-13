import { Metadata } from "next";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const trip = await prisma.trip.findUnique({ where: { id: resolvedParams.id } });
  
  if (!trip) return { title: "Trip Not Found | TripGenius" };
  
  const itinerary = trip.itinerary as any;
  const title = itinerary?.title || `Trip to ${trip.destination}`;
  const imageKeyword = itinerary?.imageKeyword || trip.destination;

  const ogImageUrl = `/api/image?query=${encodeURIComponent(imageKeyword)}`;

  return {
    title: `${title} | TripGenius`,
    description: `Check out my AI-generated travel itinerary to ${trip.destination} for ${trip.dates}!`,
    openGraph: {
      title: `${title} | TripGenius`,
      description: `Check out my AI-generated travel itinerary to ${trip.destination} for ${trip.dates}!`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: trip.destination }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TripGenius`,
      description: `Check out my AI-generated travel itinerary to ${trip.destination} for ${trip.dates}!`,
      images: [ogImageUrl],
    }
  };
}

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

  const getTimeIcon = (timeStr: string) => {
    if (!timeStr) return null;
    const t = timeStr.toLowerCase();
    
    // Meals
    if (t.includes('breakfast')) return <Utensils className="w-4 h-4 mr-1.5 inline text-orange-400" />;
    if (t.includes('lunch')) return <Utensils className="w-4 h-4 mr-1.5 inline text-amber-500" />;
    if (t.includes('dinner') || t.includes('supper')) return <Utensils className="w-4 h-4 mr-1.5 inline text-rose-500" />;
    
    // Exact Times (AM/PM logic)
    if (t.match(/am|a.m./)) {
      if (t.match(/10|11/)) return <Sun className="w-4 h-4 mr-1.5 inline text-amber-500" />;
      return <Sunrise className="w-4 h-4 mr-1.5 inline text-blue-500" />;
    }
    if (t.match(/pm|p.m./)) {
      if (t.match(/12|1|2|3|4/)) return <Sun className="w-4 h-4 mr-1.5 inline text-amber-500" />;
      if (t.match(/5|6|7/)) return <Sunset className="w-4 h-4 mr-1.5 inline text-orange-500" />;
      return <Moon className="w-4 h-4 mr-1.5 inline text-indigo-500" />;
    }

    // Fallbacks for words
    if (t.includes('morning')) return <Sunrise className="w-4 h-4 mr-1.5 inline text-blue-500" />;
    if (t.includes('afternoon') || t.includes('noon')) return <Sun className="w-4 h-4 mr-1.5 inline text-amber-500" />;
    if (t.includes('evening')) return <Sunset className="w-4 h-4 mr-1.5 inline text-orange-500" />;
    if (t.includes('night') || t.includes('midnight')) return <Moon className="w-4 h-4 mr-1.5 inline text-indigo-500" />;
    
    // Catch-all
    return <Clock className="w-4 h-4 mr-1.5 inline text-zinc-500" />;
  };

  // Custom markdown formatter for AI responses
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*\?\s*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-neutral-100 font-bold">💎 $1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-neutral-100 font-bold">$1</strong>')
      .replace(/\n\n---\n\n/g, '<hr class="my-6 border-neutral-200 dark:border-white/10" />')
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />');
  };

  const imageKeyword = itinerary.imageKeyword || trip.destination;
  const heroImageUrl = `/api/image?query=${encodeURIComponent(imageKeyword)}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="w-full pb-20">
        
        {/* CINEMATIC HERO SECTION */}
        <section className="relative w-full h-[65vh] min-h-[500px] xl:h-[75vh] flex flex-col justify-end overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              crossOrigin="anonymous" 
              src={heroImageUrl} 
              alt={trip.destination} 
              className="w-full h-full object-cover"
            />
            {/* Smooth Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-900/60 to-black/20 dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 pb-12 lg:pb-16" id="itinerary-results">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-black/40 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 px-3 py-1.5 text-xs md:text-sm font-medium rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
                AI Generated
              </Badge>
              <Badge className="bg-black/40 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 px-3 py-1.5 text-xs md:text-sm font-medium rounded-full shadow-lg">
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                {trip.dates}
              </Badge>
              
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-2xl">
              {itinerary.title}
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-200 max-w-3xl leading-relaxed drop-shadow-md font-medium">
              {itinerary.summary}
            </p>

            {/* Hero Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md text-white font-bold rounded-xl shadow-lg border border-blue-400/30 transition-all hover:scale-105 active:scale-95">
                  <Plane className="w-4 h-4 mr-2" /> Flights & Hotels
                </Button>
              </a>
              <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
                <Button className="bg-orange-600/90 hover:bg-orange-600 backdrop-blur-md text-white font-bold rounded-xl shadow-lg border border-orange-400/30 transition-all hover:scale-105 active:scale-95">
                  <Train className="w-4 h-4 mr-2" /> Train Tickets
                </Button>
              </a>
              <SaveTripButton tripId={trip.id} />
              {userId === trip.userId && <ModifyTripButton trip={trip} />}
              <DownloadPdfButton targetId="itinerary-results" filename={itinerary.title || "My_Trip"} />
            </div>
          </div>
        </section>

        {/* 2-COLUMN RESPONSIVE LAYOUT */}
        <section className="w-full max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* LEFT COLUMN: ITINERARY FEED */}
            <div className="lg:col-span-8 space-y-16">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-2xl">
                  <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white">The Itinerary</h2>
              </div>

              <div className="space-y-16">
                {itinerary.days?.map((day: any, idx: number) => (
                  <div key={idx} className="relative">
                    {/* Sticky Day Header */}
                    <div className="sticky top-20 z-20 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-xl py-5 mb-8 border-b border-neutral-200 dark:border-white/10 rounded-b-3xl">
                      <h3 className="text-2xl font-bold flex flex-wrap items-center gap-3">
                        <Badge className="bg-blue-600 text-white text-sm px-3 py-1 rounded-xl">{day.day}</Badge>
                        <span className="text-neutral-800 dark:text-neutral-100">{day.description}</span>
                      </h3>
                    </div>

                    {/* Vertical Timeline */}
                    <div className="relative before:absolute before:inset-y-0 before:left-[1.35rem] before:w-0.5 before:bg-neutral-200 dark:before:bg-white/10 space-y-8 pl-12 md:pl-16">
                      {day.activities?.map((act: any, i: number) => (
                        <div key={i} className="relative group">
                          {/* Timeline Node */}
                          <div className="absolute -left-[2.35rem] md:-left-[3.35rem] top-6 w-3.5 h-3.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] ring-4 ring-neutral-50 dark:ring-neutral-950 z-10 transition-transform group-hover:scale-125" />
                          
                          {/* Activity Card - Glassmorphism */}
                          <div className="bg-white/60 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/60 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 group-hover:-translate-y-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold uppercase text-[11px] tracking-wider px-3 py-1 rounded-lg">
                                {getTimeIcon(act.time)} {act.time}
                              </Badge>
                              {act.coordinates && (
                                <Badge variant="outline" className="text-[10px] text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-white/10 rounded-lg">
                                  <MapPin className="w-3 h-3 mr-1 inline" /> GPS Logged
                                </Badge>
                              )}
                            </div>
                            
                            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-blue-600 dark:prose-strong:text-blue-400">
                              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(typeof act === 'string' ? act : (act.description || act.name || act.activity)) }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-8 pb-12">
                
                {/* Interactive Map */}
                {(itinerary.topDestinations || itinerary.accommodations) && (
                  <div className="rounded-3xl overflow-hidden ring-1 ring-neutral-200 dark:ring-white/10 shadow-2xl h-[350px] relative group">
                    <TripMapDynamic locations={[
                      ...(itinerary.topDestinations || []).map((d: any) => ({ ...d, type: 'attraction' })),
                      ...(itinerary.accommodations || []).map((a: any) => ({ ...a, type: 'hotel' }))
                    ]} />
                  </div>
                )}

                {/* Top Sights Widget */}
                {itinerary.topDestinations && itinerary.topDestinations.length > 0 && (
                  <Card className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg font-bold">
                        <Heart className="w-5 h-5 mr-2 text-rose-500" />
                        Top Sights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {itinerary.topDestinations.map((dest: any, i: number) => (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name)}`} target="_blank" rel="noopener noreferrer" key={i} className="group flex gap-4 items-center p-2 -mx-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors relative cursor-pointer pr-8">
                          <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-neutral-400" />
                          </div>
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                            <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(dest.imageKeyword)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm line-clamp-1">{dest.name}</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{dest.description}</p>
                          </div>
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Accommodations Widget */}
                {itinerary.accommodations && itinerary.accommodations.length > 0 && (
                  <Card className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg font-bold">
                        <Bed className="w-5 h-5 mr-2 text-indigo-500" />
                        Where to Stay
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {itinerary.accommodations.map((acc: any, i: number) => (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acc.name)}`} target="_blank" rel="noopener noreferrer" key={i} className="group flex gap-4 items-center p-2 -mx-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors relative cursor-pointer pr-8">
                          <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-neutral-400" />
                          </div>
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                            <img crossOrigin="anonymous" src={"/api/image?query=" + encodeURIComponent(acc.imageKeyword)} alt={acc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                               <h4 className="font-semibold text-sm line-clamp-1">{acc.name}</h4>
                               <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded-sm bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700">{acc.tier || "Standard"}</Badge>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{acc.description}</p>
                          </div>
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Budget Widget */}
                {itinerary.budgetBreakdown && Array.isArray(itinerary.budgetBreakdown) && itinerary.budgetBreakdown.length > 0 && (
                  <Card className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg font-bold">
                        <Wallet className="w-5 h-5 mr-2 text-emerald-500" />
                        Estimated Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BudgetChart data={itinerary.budgetBreakdown.map((item: any) => ({ category: item.category, estimatedCost: item.estimatedCost || item.value || 0 }))} />
                    </CardContent>
                  </Card>
                )}

                {/* Insider Tips Widget */}
                {itinerary.localTips && Array.isArray(itinerary.localTips) && itinerary.localTips.length > 0 && (
                  <Card className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg font-bold">
                        <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                        Insider Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {itinerary.localTips.map((tip: any, i: number) => (
                          <li key={i} className="flex items-start text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            <span className="text-amber-500 mr-2.5 font-bold shrink-0">✦</span>
                            <span dangerouslySetInnerHTML={{ __html: String(tip).replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-neutral-100">$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Packing Checklist Widget */}
                {itinerary.packingList && Array.isArray(itinerary.packingList) && itinerary.packingList.length > 0 && (
                  <Card className="border-0 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl ring-1 ring-neutral-200 dark:ring-white/10 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg font-bold">
                        <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                        Packing List
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
        </section>
      </main>
    </div>
  );
}
