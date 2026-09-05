const fs = require('fs');

const forceInject = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // Inject Plane and ExternalLink imports
  if (!txt.includes('Plane,')) {
    txt = txt.replace('import { MapPin', 'import { Plane, MapPin');
  }
  if (!txt.includes('ExternalLink,')) {
    txt = txt.replace('import { MapPin', 'import { ExternalLink, MapPin');
  }

  // Inject Flights Button before Interactive Map
  if (!txt.includes('Check Flights')) {
    const flightButton = `<div className="mt-2 mb-12 flex justify-center gap-4">\n                      <a href={\`https://www.google.com/travel/flights?q=\${encodeURIComponent('Flights to ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer">\n                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">\n                          <Plane className="w-5 h-5 mr-2" /> Check Flights\n                        </Button>\n                      </a>\n                    </div>\n\n                    {/* Interactive Map */}`;
    txt = txt.replace('{/* Interactive Map */}', flightButton);
  }

  // Inject Accommodations Button (Replace ALL </CardContent></Card> closures in accommodations section)
  // We can use a global regex replacement for the CardContent closing tag.
  if (!txt.includes('Check Availability')) {
    // We only want to inject in the accommodations card.
    // The accommodations map loops and has <CardContent> ... </CardContent> </Card>
    // So let's replace <CardContent> containing the description.
    const bookingButton = `</CardContent>\n                                <div className="p-4 pt-0 mt-auto w-full">\n                                  <a href={\`https://www.booking.com/searchresults.html?ss=\${encodeURIComponent(acc.name + ' ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer" className="block w-full">\n                                    <Button variant="outline" className="w-full font-bold border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 group flex items-center justify-center">\n                                      Check Availability <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />\n                                    </Button>\n                                  </a>\n                                </div>\n                              </Card>`;
    // This regex looks for </CardContent> followed by whitespace and </Card>
    txt = txt.replace(/<\/CardContent>\s*<\/Card>/g, bookingButton);
  }

  fs.writeFileSync(filepath, txt, 'utf8');
}

forceInject('app/page.tsx');
forceInject('app/share/[id]/page.tsx');