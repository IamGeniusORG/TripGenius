"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DownloadPdfButton({ targetId, filename }: { targetId: string, filename: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById(targetId);
      if (!element) {
        toast.error("Could not find the itinerary content to export.");
        setIsDownloading(false);
        return;
      }

      toast.info("Generating PDF...", { description: "This might take a few seconds." });

      // @ts-ignore
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt: any = {
        margin:       10,
        filename:     `${filename.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF Downloaded!", { description: "Your itinerary has been saved for offline viewing." });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { description: "An unexpected error occurred during export." });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
    >
      {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
      Download PDF
    </Button>
  );
}