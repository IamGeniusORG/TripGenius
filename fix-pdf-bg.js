const fs = require('fs');
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

pageTxt = pageTxt.replace(
  '<motion.div \n                    id="itinerary-results" \n                    className="w-full max-w-5xl text-left mt-12 scroll-mt-24"',
  '<motion.div \n                    id="itinerary-results" \n                    className="w-full max-w-5xl text-left mt-12 scroll-mt-24 bg-white dark:bg-zinc-950 p-4 md:p-8 rounded-3xl"'
);

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');