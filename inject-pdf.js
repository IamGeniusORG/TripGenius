const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

if (!pageTxt.includes('DownloadPdfButton')) {
  pageTxt = pageTxt.replace('import { TripMapDynamic }', 'import DownloadPdfButton from "@/components/DownloadPdfButton";\nimport { TripMapDynamic }');
  
  const transportHub = `<a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                            <Train className="w-4 h-4 mr-2" /> Train Tickets (IRCTC)
                          </Button>
                        </a>`;
                        
  pageTxt = pageTxt.replace(transportHub, transportHub + '\n                        <DownloadPdfButton targetId="itinerary-results" filename={itinerary.title || "My_Trip"} />');
  
  fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');
}