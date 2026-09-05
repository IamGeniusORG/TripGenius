const fs = require('fs');

const injectLinksRegex = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // Inject Flights Button
  if (!txt.includes('Check Flights')) {
    const flightButton = `</p>\n                      )}\n                    </div>\n\n                    <div className="mt-2 mb-12 flex justify-center gap-4">\n                      <a href={\`https://www.google.com/travel/flights?q=\${encodeURIComponent('Flights to ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer">\n                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">\n                          <Plane className="w-5 h-5 mr-2" /> Check Flights\n                        </Button>\n                      </a>\n                    </div>`;
    txt = txt.replace(/<\/p>\s*\}\)\}\s*<\/div>/, flightButton);
  }

  // Inject Accommodations Button
  if (!txt.includes('Check Availability')) {
    const bookingButton = `</CardContent>\n                                <div className="p-4 pt-0 mt-auto w-full">\n                                  <a href={\`https://www.booking.com/searchresults.html?ss=\${encodeURIComponent(acc.name + ' ' + (itinerary.title || ''))}\`} target="_blank" rel="noopener noreferrer" className="block w-full">\n                                    <Button variant="outline" className="w-full font-bold border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 group flex items-center justify-center">\n                                      Check Availability <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />\n                                    </Button>\n                                  </a>\n                                </div>\n                              </Card>`;
    txt = txt.replace(/<\/CardContent>\s*<\/Card>/, bookingButton);
  }

  fs.writeFileSync(filepath, txt, 'utf8');
}

injectLinksRegex('app/page.tsx');
injectLinksRegex('app/share/[id]/page.tsx');