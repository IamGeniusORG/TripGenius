const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the old card UI with a sleek floating glass pill layout
const oldFormCardStart = /<Card className="w-full max-w-5xl text-left shadow-xl hover:shadow-2xl transition-shadow duration-500 border-white\/10 dark:border-white\/5 bg-white\/40 dark:bg-zinc-950\/40 backdrop-blur-3xl shadow-\[0_8px_32px_0_rgba\(31,38,135,0\.07\)\] dark:shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.3\)\] mb-8">[\s\S]*?<CardContent>/;

const newFormCardStart = `
              <div className="w-full max-w-5xl mx-auto p-2 md:p-4 rounded-3xl md:rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl mb-12 relative z-20">
                <div className="w-full">
`;

pageTxt = pageTxt.replace(oldFormCardStart, newFormCardStart);

const oldFormLayout = /<form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit=\{handleSubmit\}>/;
const newFormLayout = `<form className="flex flex-col lg:flex-row items-center gap-2 md:gap-4 w-full" onSubmit={handleSubmit}>`;
pageTxt = pageTxt.replace(oldFormLayout, newFormLayout);

// Convert Labels and Inputs into minimal, sleek fields without bulky spacing
// Origin
pageTxt = pageTxt.replace(
  /<div className="space-y-3 md:col-span-1 lg:col-span-1 relative">[\s\S]*?<Label htmlFor="origin"[\s\S]*?<\/Label>/,
  '<div className="w-full lg:w-1/5 relative group">'
);
pageTxt = pageTxt.replace(
  'className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500"',
  'className="pl-12 h-14 md:h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 px-4 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"'
);

// Destination
pageTxt = pageTxt.replace(
  /<div className="space-y-3 md:col-span-1 lg:col-span-2 mb-4 relative z-50">[\s\S]*?<Label htmlFor="destination"[\s\S]*?<\/Label>/,
  '<div className="w-full lg:w-1/4 relative z-50 group border-t lg:border-t-0 lg:border-l border-zinc-200/50 dark:border-zinc-800/50">'
);
pageTxt = pageTxt.replace(
  'className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500"',
  'className="pl-12 h-14 md:h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 px-4 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"'
);

// Dates
pageTxt = pageTxt.replace(
  /<div className="space-y-3 md:col-span-1 lg:col-span-1 relative z-40">[\s\S]*?<Label className="text-lg font-bold text-zinc-900 dark:text-zinc-50">[\s\S]*?<\/Label>/,
  '<div className="w-full lg:w-1/4 relative z-40 group border-t lg:border-t-0 lg:border-l border-zinc-200/50 dark:border-zinc-800/50">'
);
// Fix the Date button styling
pageTxt = pageTxt.replace(
  /className=\{cn\([\s\S]*?"w-full h-14 text-left font-normal text-lg bg-zinc-50 dark:bg-zinc-900\/50 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800",[\s\S]*?!\(date\?.from && date\?.to\) && "text-muted-foreground"[\s\S]*?\)\}/,
  'className={cn("w-full h-14 md:h-16 text-left font-medium text-base bg-transparent border-none shadow-none hover:bg-black/5 dark:hover:bg-white/5 rounded-none md:rounded-full", !(date?.from && date?.to) && "text-zinc-500 dark:text-zinc-400")}'
);

// Budget
pageTxt = pageTxt.replace(
  /<div className="space-y-3 md:col-span-1 lg:col-span-1 relative">[\s\S]*?<Label htmlFor="budget"[\s\S]*?<\/Label>/,
  '<div className="w-full lg:w-1/6 relative group border-t lg:border-t-0 lg:border-l border-zinc-200/50 dark:border-zinc-800/50">'
);
pageTxt = pageTxt.replace(
  'className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500"',
  'className="pl-12 h-14 md:h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 px-4 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"'
);

// Travel Style
pageTxt = pageTxt.replace(
  /<div className="space-y-3 md:col-span-1 lg:col-span-1 relative">[\s\S]*?<Label htmlFor="travelStyle"[\s\S]*?<\/Label>/,
  '<div className="w-full lg:w-1/6 relative group border-t lg:border-t-0 lg:border-l border-zinc-200/50 dark:border-zinc-800/50">'
);
pageTxt = pageTxt.replace(
  'className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500"',
  'className="pl-12 h-14 md:h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 px-4 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"'
);

// Generate Button
pageTxt = pageTxt.replace(
  /<div className="md:col-span-2 lg:col-span-3 mt-4">[\s\S]*?<Button[\s\S]*?<\/Button>[\s\S]*?<\/div>/,
  `<div className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2">
    <Button type="submit" disabled={isLoading || !destination || !(date?.from && date?.to)} className="w-full h-14 md:h-16 rounded-2xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
      {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Planning...</> : "Generate"}
    </Button>
  </div>`
);

// Close the wrapper
pageTxt = pageTxt.replace(/<\/CardContent>[\s\S]*?<\/Card>/, '</div></div>');

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');