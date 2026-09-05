const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// Fix PopoverTrigger
pageTxt = pageTxt.replace(
  /<PopoverTrigger asChild>[\s\S]*?<Button[\s\S]*?id="date"[\s\S]*?className=\{cn\([\s\S]*?"w-full h-16 justify-start text-left font-medium text-base bg-zinc-100\/50 dark:bg-zinc-800\/50 hover:bg-white dark:hover:bg-zinc-700\/50 rounded-2xl lg:rounded-none border-none transition-colors",[\s\S]*?!\(date\?.from && date\?.to\) && "text-zinc-500 dark:text-zinc-400"[\s\S]*?\)\}[\s\S]*?>[\s\S]*?<CalendarIcon className="mr-3 h-5 w-5 text-purple-500" \/>[\s\S]*?\{date\?.from \? \([\s\S]*?date\.to \? \([\s\S]*?<span className="truncate">\{format\(date\.from, "LLL dd"\)\} - \{format\(date\.to, "LLL dd"\)\}<\/span>[\s\S]*?\) : \([\s\S]*?format\(date\.from, "LLL dd"\)[\s\S]*?\)[\s\S]*?\) : \([\s\S]*?<span>Dates<\/span>[\s\S]*?\)[\s\S]*?<\/Button>[\s\S]*?<\/PopoverTrigger>/,
  `<PopoverTrigger
                          id="date"
                          className={cn(
                            "w-full h-16 flex items-center justify-start text-left font-medium text-base bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-700/50 rounded-2xl lg:rounded-none border-none transition-colors px-4",
                            !(date?.from && date?.to) && "text-zinc-500 dark:text-zinc-400"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-purple-500" />
                          {date?.from ? (
                            date.to ? (
                              <span className="truncate">{format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}</span>
                            ) : (
                              format(date.from, "LLL dd")
                            )
                          ) : (
                            <span>Dates</span>
                          )}
                        </PopoverTrigger>`
);

// Fix initialFocus on Calendar
pageTxt = pageTxt.replace(/initialFocus\n\s*mode="range"/, 'mode="range"');

// Fix InteractiveGlobe container
pageTxt = pageTxt.replace(
  '<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-20 opacity-80 mix-blend-screen translate-y-[15%] scale-150 lg:scale-100 lg:translate-y-[10%]">\n                 <InteractiveGlobe />\n              </div>',
  '<div className="absolute inset-0 pointer-events-none overflow-hidden -z-20 opacity-80">\n                 <InteractiveGlobe />\n              </div>'
);

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');