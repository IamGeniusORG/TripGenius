"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the map component with SSR disabled
const MapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      <span className="ml-2 text-sm font-medium text-zinc-500">Loading Map...</span>
    </div>
  ),
});

export function TripMapDynamic({ locations }: { locations: any[] }) {
  return <MapComponent locations={locations} />;
}