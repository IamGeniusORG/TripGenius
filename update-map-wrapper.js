const fs = require('fs');

// 1. Update Map.tsx to include the wrapper styling and return null if no markers
let mapTxt = fs.readFileSync('components/Map.tsx', 'utf8');
mapTxt = mapTxt.replace(
  /if \(markers\.length === 0\) \{\s*return \([\s\S]*?\);\s*\}/,
  'if (markers.length === 0) {\n    return null;\n  }'
);
mapTxt = mapTxt.replace(
  '<MapContainer \n      center={[markers[0].coordinates.lat, markers[0].coordinates.lng]} \n      zoom={13} \n      scrollWheelZoom={false}\n      className="w-full h-full rounded-xl z-0"\n    >',
  '<div className="mb-12 w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 relative z-0">\n    <MapContainer \n      center={[markers[0].coordinates.lat, markers[0].coordinates.lng]} \n      zoom={13} \n      scrollWheelZoom={false}\n      className="w-full h-full z-0"\n    >'
);
mapTxt = mapTxt.replace(/<\/MapContainer>/, '</MapContainer>\n    </div>');

// Also update the loading spinner to use the wrapper classes
mapTxt = mapTxt.replace(
  '<div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl">',
  '<div className="mb-12 w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl">'
);

fs.writeFileSync('components/Map.tsx', mapTxt, 'utf8');

// 2. Remove wrappers from app/page.tsx
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');
pageTxt = pageTxt.replace(
  /<div className="mb-12 w-full h-\[400px\] md:h-\[500px\] rounded-xl overflow-hidden shadow-xl border border-zinc-200\/60 dark:border-zinc-800\/60 relative z-0">\s*<TripMapDynamic([\s\S]*?)\/>\s*<\/div>/,
  '<TripMapDynamic$1/>'
);
// Also it might be a motion.div
pageTxt = pageTxt.replace(
  /<motion\.div[^>]*className="mb-12 w-full h-\[400px\] md:h-\[500px\][^>]*>\s*<TripMapDynamic([\s\S]*?)\/>\s*<\/motion\.div>/,
  '<TripMapDynamic$1/>'
);
fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');

// 3. Remove wrappers from app/share/[id]/page.tsx
let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');
shareTxt = shareTxt.replace(
  /<div className="mb-12 w-full h-\[400px\] md:h-\[500px\] rounded-xl overflow-hidden shadow-xl border border-zinc-200\/60 dark:border-zinc-800\/60 relative z-0">\s*<TripMapDynamic([\s\S]*?)\/>\s*<\/div>/,
  '<TripMapDynamic$1/>'
);
fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');