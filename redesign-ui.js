const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// Import Globe
if (!pageTxt.includes('Globe')) {
  pageTxt = pageTxt.replace('import { TripMapDynamic } from "@/components/TripMapDynamic";', 'import { TripMapDynamic } from "@/components/TripMapDynamic";\nimport Globe from "@/components/Globe";');
}

// Redesign the hero container and add the Globe
const oldHeroRegex = /<h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl mb-6 drop-shadow-sm text-zinc-900 dark:text-zinc-50 leading-\[1\.1\]">[\s\S]*?<\/p>/;

const newHero = `
              <div className="relative w-full flex flex-col items-center justify-center pt-10 pb-4">
                <div className="absolute inset-0 pointer-events-none -z-10 translate-y-[20%] scale-150 md:scale-100 opacity-60 dark:opacity-40">
                  <Globe />
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl mb-6 drop-shadow-md text-zinc-900 dark:text-zinc-50 leading-[1.05] relative z-10 text-center">
                  Discover the world in <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-sm filter">breathtaking detail.</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed tracking-wide text-center relative z-10">
                  Tell us your dream destination. Our AI will instantly craft a stunning, hyper-personalized itinerary mapped beautifully across the globe.
                </p>
              </div>
`;

pageTxt = pageTxt.replace(oldHeroRegex, newHero);

// Update Card Styling to be ultra-premium glassmorphism
pageTxt = pageTxt.replace(
  'border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl',
  'border-white/20 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
);

// Update background to be richer
pageTxt = pageTxt.replace(
  'bg-zinc-50 dark:bg-zinc-950',
  'bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/20'
);

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');