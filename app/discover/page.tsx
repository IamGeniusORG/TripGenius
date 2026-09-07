import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PublicTripCard } from "@/components/PublicTripCard";
import { Globe, Compass } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DiscoverPage() {
  const publicTrips = await prisma.trip.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 w-full mx-auto px-4 md:px-12 lg:px-24 xl:px-32 pt-32 pb-24 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
            <Globe className="w-4 h-4 animate-pulse" />
            <span>Community Feed</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
            Discover the World
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Get inspired by stunning itineraries crafted by our AI for travelers across the globe. 
            Find your next adventure below.
          </p>
        </div>

        {publicTrips.length === 0 ? (
          <div className="p-16 text-center border-dashed border-2 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm max-w-2xl mx-auto shadow-sm">
            <Compass className="w-16 h-16 text-zinc-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">It's quiet in here...</h3>
            <p className="text-zinc-500 mb-6 text-lg">Be the first to publish a trip to the community feed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-auto">
            {publicTrips.map((trip, index) => (
              <PublicTripCard 
                key={trip.id} 
                trip={trip} 
                featured={false} 
                index={index} 
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}