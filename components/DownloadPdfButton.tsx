"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function DownloadPdfButton({ targetId, filename }: { targetId: string, filename: string }) {
  const handlePrint = () => {
    // We use native browser printing because it perfectly supports modern CSS like oklch,
    // avoids CORS issues with tainted canvases, and produces vector text PDFs instead of blurry images.
    
    // Set the document title temporarily so the default PDF filename matches the trip
    const originalTitle = document.title;
    document.title = filename.replace(/\s+/g, '_');
    
    window.print();
    
    // Restore the title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <Button 
      onClick={handlePrint} 
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm print-hide"
    >
      <Printer className="w-4 h-4 mr-2" />
      Print / Save PDF
    </Button>
  );
}