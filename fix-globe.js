const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// Rename Lucide Globe to GlobeIcon
pageTxt = pageTxt.replace(/Globe(\s*,|\s*\})/, 'Globe: GlobeIcon$1');
pageTxt = pageTxt.replace(/<Globe className=/g, '<GlobeIcon className=');
pageTxt = pageTxt.replace(/<Globe \/>/g, '<InteractiveGlobe />'); // We will rename the Cobe globe to InteractiveGlobe

// Rename our import
pageTxt = pageTxt.replace('import Globe from "@/components/Globe";', 'import InteractiveGlobe from "@/components/Globe";');

// Let's also make the Hero completely full-screen
pageTxt = pageTxt.replace(
  '<main className="flex-1 relative z-10 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]">',
  '<main className="flex-1 relative z-10 w-full overflow-x-hidden">'
);

pageTxt = pageTxt.replace(
  '<section className="relative pt-32 pb-48 lg:pt-40 lg:pb-56 flex flex-col items-center justify-center min-h-[80vh]">',
  '<section className="relative w-full min-h-screen pt-32 pb-48 lg:pt-40 lg:pb-56 flex flex-col items-center justify-center overflow-hidden">'
);

// We need to fix the Globe container to be massively full screen
const oldGlobeContainerRegex = /<div className="relative w-full flex flex-col items-center justify-center pt-10 pb-4">[\s\S]*?<div className="absolute inset-0 pointer-events-none -z-10 translate-y-\[20%\] scale-150 md:scale-100 opacity-60 dark:opacity-40">[\s\S]*?<InteractiveGlobe \/>[\s\S]*?<\/div>/;

const newGlobeContainer = `
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-20 opacity-80 mix-blend-screen translate-y-[15%] scale-150 lg:scale-100 lg:translate-y-[10%]">
                 <InteractiveGlobe />
              </div>
              <div className="relative w-full flex flex-col items-center justify-center pt-10 pb-4 z-10">
`;

pageTxt = pageTxt.replace(oldGlobeContainerRegex, newGlobeContainer);

// Make the form card translucent
pageTxt = pageTxt.replace(
  'border-white/20 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-3xl',
  'border-white/10 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl'
);

// Completely hide the "Plan your next adventure" text and small text because it clashes with the massive header
pageTxt = pageTxt.replace(
  '<CardHeader className="pb-6 text-center md:text-left">',
  '<CardHeader className="pb-6 text-center md:text-left hidden">'
);

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');