const fs = require('fs');

const updatePage = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');

  // Add the import statement
  const importStatement = `import { TripMapDynamic } from "@/components/TripMapDynamic";\n`;
  if (!txt.includes('TripMapDynamic')) {
    txt = txt.replace('import { MapPin', importStatement + 'import { MapPin');
  }

  // Define the map section
  const mapLogic = `
                    {/* Interactive Map */}
                    {(itinerary.topDestinations || itinerary.accommodations) && (
                      <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-12 w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 relative z-0">
                        <TripMapDynamic locations={[
                          ...(itinerary.topDestinations || []).map((d: any) => ({ ...d, type: 'attraction' })),
                          ...(itinerary.accommodations || []).map((a: any) => ({ ...a, type: 'hotel' }))
                        ]} />
                      </motion.div>
                    )}
  `;

  // Inject before Top Destinations in page.tsx or share page
  if (filepath === 'app/page.tsx') {
    const targetStr = '{itinerary.topDestinations && Array.isArray(itinerary.topDestinations)';
    txt = txt.replace(targetStr, mapLogic + '\n                    ' + targetStr);
  } else {
    // In share/[id]/page.tsx, we can inject it right above the first Card (Top Sights)
    const targetStr = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">';
    txt = txt.replace(targetStr, mapLogic + '\n                  ' + targetStr);
  }

  fs.writeFileSync(filepath, txt, 'utf8');
};

updatePage('app/page.tsx');
updatePage('app/share/[id]/page.tsx');