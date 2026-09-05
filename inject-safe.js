const fs = require('fs');

const safeInject = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // Inject Icons
  if (!txt.includes('Plane,')) txt = txt.replace('import { MapPin', 'import { Plane, MapPin');
  if (!txt.includes('ExternalLink,')) txt = txt.replace('import { MapPin', 'import { ExternalLink, MapPin');

  // Inject Button in Share Page if missing
  if (filepath.includes('share') && !txt.includes('import { Button }')) {
    txt = txt.replace('import { Badge }', 'import { Badge }\nimport { Button } from "@/components/ui/button";');
  }

  // Inject Flights Button
  const summaryBlockEnd = /<\/p>\s*\}\)\}\s*<\/div>/;
  if (!txt.includes('Check Flights')) {
    const flightButton = `</p>\n                      )}\n                    </div>\n\n                    <div className="mt-2 mb-12 flex justify-center gap-4">\n                      <a href={\`https://www.google.com/travel/flights?q=\${encodeURIComponent('Flights to ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer">\n                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">\n                          <Plane className="w-5 h-5 mr-2" /> Check Flights\n                        </Button>\n                      </a>\n                    </div>`;
    txt = txt.replace(summaryBlockEnd, flightButton);
  }

  // Inject Accommodations Button specifically inside the accommodations map
  // Find the exact block for accommodations
  const accStartRegex = /itinerary\.accommodations\.map\(\(acc: any, i: number\) => \(/;
  const match = txt.match(accStartRegex);
  
  if (match && !txt.includes('Check Availability')) {
    const startIdx = match.index;
    const searchArea = txt.substring(startIdx, startIdx + 2000); // Look in the immediate vicinity
    const firstCardContentEnd = searchArea.indexOf('</CardContent>');
    if (firstCardContentEnd !== -1) {
      // Find the subsequent </Card>
      const localCardEnd = searchArea.indexOf('</Card>', firstCardContentEnd);
      if (localCardEnd !== -1) {
        // Build the replacement
        const targetString = searchArea.substring(firstCardContentEnd, localCardEnd + 7);
        const bookingButton = `</CardContent>\n                                <div className="p-4 pt-0 mt-auto w-full">\n                                  <a href={\`https://www.booking.com/searchresults.html?ss=\${encodeURIComponent(acc.name + ' ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer" className="block w-full">\n                                    <Button variant="outline" className="w-full font-bold border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 group flex items-center justify-center">\n                                      Check Availability <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />\n                                    </Button>\n                                  </a>\n                                </div>\n                              </Card>`;
        
        txt = txt.replace(targetString, bookingButton);
      }
    }
  }

  fs.writeFileSync(filepath, txt, 'utf8');
}

safeInject('app/page.tsx');
safeInject('app/share/[id]/page.tsx');