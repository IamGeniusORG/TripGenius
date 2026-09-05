const fs = require('fs');

let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// We are going to replace everything from `<form className="flex flex-col lg:flex-row items-center gap-2 md:gap-4 w-full" onSubmit={handleSubmit}>`
// all the way down to `</div></div>` which is right before `{(itinerary.topDestinations || itinerary.accommodations) && (`

const startIdx = pageTxt.indexOf('<form className="flex flex-col lg:flex-row items-center gap-2 md:gap-4 w-full" onSubmit={handleSubmit}>');
const endFormIdx = pageTxt.indexOf('</div></div>', startIdx) + '</div></div>'.length;

const newFormHTML = `
                <form className="flex flex-col lg:flex-row items-center gap-0 w-full" onSubmit={handleSubmit}>
                  
                  {/* Origin */}
                  <div className="w-full lg:w-[22%] relative group p-2">
                    <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl lg:rounded-l-full lg:rounded-r-none hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors">
                      <button 
                        type="button"
                        onClick={handleGetLocation}
                        className="absolute left-3 p-2 rounded-full hover:bg-white dark:hover:bg-zinc-900 shadow-sm transition-all z-10 group/btn"
                        title="Use my exact location"
                      >
                        {isLocating ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <Navigation className="h-4 w-4 text-blue-500 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                      <Input 
                        id="origin" 
                        placeholder={isLocating ? "Detecting..." : "Where from?"} 
                        className="pl-14 h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:bg-white dark:focus-visible:bg-zinc-900 rounded-2xl lg:rounded-l-full lg:rounded-r-none transition-colors" 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="w-full lg:w-[26%] relative group p-2 border-t lg:border-t-0 lg:border-l border-white/20 dark:border-zinc-700/50">
                    <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl lg:rounded-none hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors">
                      <MapPin className="absolute left-4 h-5 w-5 text-indigo-500" />
                      <Input 
                        id="destination" 
                        placeholder="Where to? (e.g. Japan)" 
                        className="pl-12 h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:bg-white dark:focus-visible:bg-zinc-900 rounded-2xl lg:rounded-none transition-colors" 
                        value={destination}
                        onChange={handleDestinationChange}
                        onFocus={() => destination.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required
                        autoComplete="off"
                      />
                    </div>
                    {/* Dropdown Suggestions */}
                    <AnimatePresence>
                      {showSuggestions && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-[100]"
                        >
                          <div className="p-2">
                            <button
                              type="button"
                              className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-xl transition-colors text-indigo-700 dark:text-indigo-300 font-bold flex items-center"
                              onClick={() => setShowSuggestions(false)}
                            >
                              <Sparkles className="h-4 w-4 mr-3 text-indigo-500" />
                              Plan trip to "{destination}"
                            </button>
                            {suggestions.length > 0 && (
                              <div className="mt-2">
                                <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Top places</div>
                                {suggestions.map((place, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200 font-medium flex items-center"
                                    onClick={() => {
                                      setDestination(place);
                                      setShowSuggestions(false);
                                    }}
                                  >
                                    <MapPin className="h-4 w-4 mr-3 text-zinc-400" />
                                    {place}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dates */}
                  <div className="w-full lg:w-[20%] relative group p-2 border-t lg:border-t-0 lg:border-l border-white/20 dark:border-zinc-700/50">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="ghost"
                          className={cn(
                            "w-full h-16 justify-start text-left font-medium text-base bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-700/50 rounded-2xl lg:rounded-none border-none transition-colors",
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
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-white/20 dark:border-zinc-700/50" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                          className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Budget */}
                  <div className="w-full lg:w-[17%] relative group p-2 border-t lg:border-t-0 lg:border-l border-white/20 dark:border-zinc-700/50">
                    <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl lg:rounded-none hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors">
                      <Wallet className="absolute left-4 h-5 w-5 text-emerald-500" />
                      <Input 
                        id="budget" 
                        placeholder="Budget" 
                        className="pl-12 h-16 text-base font-medium bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:bg-white dark:focus-visible:bg-zinc-900 rounded-2xl lg:rounded-none transition-colors" 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="w-full lg:w-[15%] p-2 mt-2 lg:mt-0">
                    <Button type="submit" disabled={isLoading || !destination || !(date?.from && date?.to)} className="w-full h-16 rounded-2xl lg:rounded-r-full lg:rounded-l-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Search"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
`;

pageTxt = pageTxt.slice(0, startIdx) + newFormHTML + pageTxt.slice(endFormIdx);

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');