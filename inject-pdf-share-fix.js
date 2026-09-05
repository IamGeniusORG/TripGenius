const fs = require('fs');
let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');

const regex = /<Train className="w-4 h-4 mr-2" \/> Train Tickets \(IRCTC\)\s*<\/Button>\s*<\/a>/;

shareTxt = shareTxt.replace(regex, `<Train className="w-4 h-4 mr-2" /> Train Tickets (IRCTC)
                          </Button>
                        </a>
                        <DownloadPdfButton targetId="itinerary-results" filename={itinerary.title || "My_Trip"} />`);

fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');