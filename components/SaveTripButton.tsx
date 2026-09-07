"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

export default function SaveTripButton({ tripId, initialSaved = false, compact = false }: { tripId: string; initialSaved?: boolean, compact?: boolean }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial state just to be safe if not provided
    if (!initialSaved) {
      fetch(`/api/trips/${tripId}/save`)
        .then(res => res.json())
        .then(data => setIsSaved(data.saved))
        .catch(() => {});
    }
  }, [tripId, initialSaved]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent triggering parent links if inside a card
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/save`, { method: "POST" });
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to save trips!");
          return;
        }
        throw new Error("Failed to save");
      }
      
      const data = await res.json();
      setIsSaved(data.saved);
      toast.success(data.saved ? "Trip saved to your bookmarks!" : "Trip removed from bookmarks.");
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <button 
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`p-2 rounded-full backdrop-blur-md transition-all ${isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800'}`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    );
  }

  return (
    <Button 
      variant={isSaved ? "default" : "outline"}
      className={isSaved ? "bg-rose-500 hover:bg-rose-600 text-white" : ""}
      onClick={handleToggleSave} 
      disabled={isLoading}
    >
      <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved ? "Saved" : "Save Trip"}
    </Button>
  );
}