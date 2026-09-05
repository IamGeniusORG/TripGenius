const fs = require('fs');

const enhanceTransport = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // Inject Icons
  if (!txt.includes('Train,')) txt = txt.replace('import { MapPin', 'import { Train, Car, Plane, ExternalLink, MapPin');

  const transportButtons = `
                    <div className="mt-6 mb-12 flex flex-wrap justify-center gap-3">
                      <a href={\`https://www.google.com/travel/flights?q=\${encodeURIComponent('Flights to ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                          <Plane className="w-4 h-4 mr-2" /> Flights
                        </Button>
                      </a>
                      <a href={\`https://www.rome2rio.com/search?q=\${encodeURIComponent(itinerary.title || '')}\`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                          <Train className="w-4 h-4 mr-2" /> Trains & Buses
                        </Button>
                      </a>
                      <a href={\`https://www.rentalcars.com/search-results?locn=\${encodeURIComponent(itinerary.title || '')}\`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm">
                          <Car className="w-4 h-4 mr-2" /> Rental Cars
                        </Button>
                      </a>
                    </div>
`;

  // For app/page.tsx
  if (filepath.includes('app/page.tsx')) {
    // Remove the old Flights button if it exists
    txt = txt.replace(/<div className="mt-2 mb-12 flex justify-center gap-4">[\s\S]*?<\/div>/, '');
    
    // Inject the new cluster right before {/* Interactive Map */}
    txt = txt.replace('{/* Interactive Map */}', transportButtons + '\n                    {/* Interactive Map */}');
  }

  // For app/share/[id]/page.tsx
  if (filepath.includes('share')) {
    // Remove old Flights button if I accidentally injected it somewhere weird
    txt = txt.replace(/<div className="mt-2 mb-12 flex justify-center gap-4">[\s\S]*?<\/div>/, '');
    
    // Find the summary paragraph end
    const summaryRegex = /(<p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">\s*\{itinerary\.summary\}\s*<\/p>)/;
    
    // Inject right after the summary block, before the badge row
    if (!txt.includes('Trains & Buses')) {
      txt = txt.replace(summaryRegex, '$1\n' + transportButtons);
    }
  }

  fs.writeFileSync(filepath, txt, 'utf8');
}

enhanceTransport('app/page.tsx');
enhanceTransport('app/share/[id]/page.tsx');