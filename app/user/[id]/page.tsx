import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PublicTripCard } from "@/components/PublicTripCard";
import { User, Map } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const trips = await prisma.trip.findMany({
    where: { 
      userId: userId,
      isPublic: true 
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!trips) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      
      <main className="w-full mx-auto px-4 md:px-12 lg:px-24 xl:px-32 pt-32 pb-24">
        <div className="mb-12 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">
              Traveler Profile
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
              Exploring the world, one AI itinerary at a time.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Public Itineraries ({trips.length})
          </h2>
        </div>

        {trips.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50">
            <Map className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">No public trips</h3>
            <p className="text-zinc-500">This traveler hasn't published any trips to the Discover feed yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trips.map((trip) => (
              <PublicTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}