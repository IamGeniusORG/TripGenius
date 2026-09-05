const fs = require('fs');

const injectLinks = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // 1. Ensure Plane and ExternalLink imports from lucide-react
  if (!txt.includes('Plane,')) {
    txt = txt.replace('import { MapPin', 'import { Plane, MapPin');
  }
  if (!txt.includes('ExternalLink,')) {
    txt = txt.replace('import { MapPin', 'import { ExternalLink, MapPin');
  }

  // 2. Inject "Check Flights" button below summary
  const summaryClose = '</p>\n                    )}';
  const flightButton = `</p>
                    )}
                    <div className="mt-8 flex justify-center gap-4">
                      <a href={\`https://www.google.com/travel/flights?q=\${encodeURIComponent('Flights to ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">
                          <Plane className="w-5 h-5 mr-2" /> Check Flights
                        </Button>
                      </a>
                    </div>`;
  if (!txt.includes('Check Flights')) {
    txt = txt.replace(summaryClose, flightButton);
  }

  // 3. Inject Booking.com link to accommodations card
  const cardContentClose = `</CardContent>\n                            </Card>`;
  const bookingButton = `</CardContent>
                                <div className="p-4 pt-0 mt-auto w-full">
                                  <a href={\`https://www.booking.com/searchresults.html?ss=\${encodeURIComponent(acc.name + ' ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <Button variant="outline" className="w-full font-bold border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 group">
                                      Check Availability <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                  </a>
                                </div>
                              </Card>`;
  if (!txt.includes('Check Availability')) {
    txt = txt.replace(cardContentClose, bookingButton);
  }

  fs.writeFileSync(filepath, txt, 'utf8');
}

injectLinks('app/page.tsx');
injectLinks('app/share/[id]/page.tsx');