const fs = require('fs');

let txt = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add states
txt = txt.replace('const [isLoading, setIsLoading] = useState(false);', 'const [isLoading, setIsLoading] = useState(false);\n  const [modificationPrompt, setModificationPrompt] = useState("");\n  const [isModifying, setIsModifying] = useState(false);');

// 2. Add handleModify function below handleSubmit
const funcToInsert = `
  const handleModify = async () => {
    if (!modificationPrompt || !itinerary) return;
    setIsModifying(true);
    try {
      const response = await fetch("/api/modify-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          originalItinerary: itinerary, 
          modificationPrompt,
          destination 
        }),
      });
      const data = await response.json();
      if (data.itinerary && !data.error) {
        setItinerary(data.itinerary);
        setModificationPrompt("");
        // Scroll to top of itinerary
        document.getElementById('itinerary-view')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsModifying(false);
    }
  };
`;
txt = txt.replace('const handleRetry =', funcToInsert + '\n\n  const handleRetry =');

// 3. Add modification UI at the end of the itinerary rendering
const uiToInsert = `

                    {/* Modification UI */}
                    <div className="mt-12 w-full max-w-4xl mx-auto mb-8">
                      <Card className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-blue-200 dark:border-blue-900/50 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-400 to-indigo-600" />
                        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
                          <div className="flex-1 w-full relative">
                            <Sparkles className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
                            <Input 
                              placeholder="Want to tweak this trip? (e.g. 'Add a day trip to Kyoto', 'Make dinners cheaper')" 
                              value={modificationPrompt}
                              onChange={(e) => setModificationPrompt(e.target.value)}
                              className="pl-12 h-12 text-base bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 shadow-sm rounded-xl w-full"
                              disabled={isModifying}
                              onKeyDown={(e) => e.key === "Enter" && handleModify()}
                            />
                          </div>
                          <Button 
                            onClick={handleModify}
                            disabled={isModifying || !modificationPrompt}
                            className="w-full md:w-auto h-12 px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all whitespace-nowrap active:scale-[0.98]"
                          >
                            {isModifying ? (
                              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Modifying...</>
                            ) : (
                              "Update Trip"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
`;

txt = txt.replace('</motion.div>\n                )}\n              </AnimatePresence>', uiToInsert + '\n                  </motion.div>\n                )}\n              </AnimatePresence>');

fs.writeFileSync('app/page.tsx', txt, 'utf8');