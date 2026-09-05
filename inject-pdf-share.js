const fs = require('fs');

let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');

if (!shareTxt.includes('DownloadPdfButton')) {
  shareTxt = shareTxt.replace('import { MapPin', 'import DownloadPdfButton from "@/components/DownloadPdfButton";\nimport { MapPin');
  
  // Add an ID to the wrapper
  shareTxt = shareTxt.replace('<div className="max-w-5xl mx-auto space-y-12">', '<div id="itinerary-results" className="max-w-5xl mx-auto space-y-12 bg-zinc-50 dark:bg-zinc-950 p-2 md:p-8 rounded-3xl">');
  
  const transportHub = `<a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                            <Train className="w-4 h-4 mr-2" /> Train Tickets (IRCTC)
                          </Button>
                        </a>`;
                        
  shareTxt = shareTxt.replace(transportHub, transportHub + '\n                        <DownloadPdfButton targetId="itinerary-results" filename={itinerary.title || "My_Trip"} />');
  
  fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');
}