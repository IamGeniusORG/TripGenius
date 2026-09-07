import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicTripCard } from "@/components/PublicTripCard";
import { Map } from "lucide-react";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const savedRecords = await prisma.savedTrip.findMany({
    where: { userId },
    include: { trip: true },
    orderBy: { createdAt: 'desc' }
  });
  
  const savedTrips = savedRecords.map(r => r.trip);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 pt-32 pb-24">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 mb-3">
            Your Dashboard
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            Manage your generated itineraries and saved trips.
          </p>
        </div>

        <Tabs defaultValue="my-trips" className="w-full">
          <TabsList className="mb-8 p-1 h-auto bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl">
            <TabsTrigger value="my-trips" className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
              My Trips ({trips.length})
            </TabsTrigger>
            <TabsTrigger value="saved-trips" className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
              Saved Trips ({savedTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-trips">
            {trips.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50 mt-6">
                <Map className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">No trips planned yet</h3>
                <p className="text-zinc-500 mb-6">Head back to the home page to design your first adventure.</p>
                <a href="/">
                  <Button>Start Planning</Button>
                </a>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved-trips">
            {savedTrips.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50 mt-6">
                <Map className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">No saved trips</h3>
                <p className="text-zinc-500 mb-6">Explore the Discover feed to find trips from other travelers.</p>
                <a href="/discover">
                  <Button variant="outline">Browse Discover</Button>
                </a>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {savedTrips.map((trip) => (
                  <PublicTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
