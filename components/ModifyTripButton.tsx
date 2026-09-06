"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Loader2, Edit3 } from "lucide-react";
import { toast } from "sonner";

export default function ModifyTripButton({ trip }: { trip: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const router = useRouter();

  const handleModify = async () => {
    if (!prompt.trim()) return;
    setIsModifying(true);
    
    try {
      const response = await fetch("/api/modify-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalItinerary: trip.itinerary,
          modificationPrompt: prompt,
          destination: trip.destination,
        }),
      });

      const data = await response.json();
      
      if (data.tripId) {
        toast.success("Trip successfully modified!", { description: "Redirecting to your new itinerary..." });
        setIsOpen(false);
        setPrompt("");
        router.push("/share/" + data.tripId);
      } else {
        toast.error("Modification failed", { description: "We couldn't process your request." });
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="print-hide border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl shadow-sm px-4 py-2 flex items-center text-sm font-medium transition-colors">
        
          <Edit3 className="w-4 h-4 mr-2" />
          Edit with AI
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            Modify Itinerary
          </DialogTitle>
          <DialogDescription>
            Tell the AI exactly what you want to change. It will generate a brand new, updated version of this trip for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="e.g., 'Make it cheaper', 'Swap day 2 for a beach day', 'I am traveling with a toddler'"
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e: any) => setPrompt(e.target.value)}
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isModifying}>
            Cancel
          </Button>
          <Button onClick={handleModify} disabled={!prompt.trim() || isModifying} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isModifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rewriting Trip...
              </>
            ) : (
              "Apply Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
