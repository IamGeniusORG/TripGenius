import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MapPin, Sparkles, Navigation, Bed, Compass, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default async function SharedTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const trip = await prisma.trip.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!trip) {
    notFound();
  }

  const itinerary = trip.itinerary as any;

  // Custom markdown formatter for AI responses
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-900 dark:text-zinc-100 font-bold">$1</strong>')
      .replace(/\n\n---\n\n/g, '<hr class="my-6 border-zinc-200 dark:border-zinc-800" />')
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Shared AI Trip Plan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{itinerary.title}</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              {itinerary.summary}
            </p>
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
            <img 
              src={"/api/image?query=" + encodeURIComponent(itinerary.imageKeyword || trip.destination)} 
              alt="Destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

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
                        <img src={"/api/image?query=" + encodeURIComponent(day.imageKeyword)} alt={day.day} className="w-full h-full object-cover"/>
                      </div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl">{day.description}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="space-y-6">
                          {day.activities?.map((act: any, i: number) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-24 shrink-0 font-medium text-sm text-zinc-500 dark:text-zinc-400 pt-1">{act.time}</div>
                              <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-blue-600 dark:prose-strong:text-blue-400">
                                <p dangerouslySetInnerHTML={{ __html: formatMarkdown(typeof act === 'string' ? act : (act.description || act.name || act.activity)) }} />
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
                    <div key={i} className="group flex gap-4 items-center p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <img src={"/api/image?query=" + encodeURIComponent(dest.imageKeyword)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{dest.name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{dest.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

