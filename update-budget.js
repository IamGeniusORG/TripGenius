const fs = require('fs');

let txt = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add states
txt = txt.replace('const [budget, setBudget] = useState("");', 'const [budget, setBudget] = useState("");\n  const [customBudget, setCustomBudget] = useState("");\n  const [isCustomBudget, setIsCustomBudget] = useState(false);');

// 2. Replace the payload submission
txt = txt.replace('budget, travelStyle: travelStyle.join(', 'budget: isCustomBudget ? customBudget : budget, travelStyle: travelStyle.join(');

// 3. Replace the Budget UI block
const oldBudgetBlockRegex = /\{\[\s*\{ id: "budget".*?\]\.map\(opt => \(\s*<button.*?<\/button>\s*\)\)\}/s;

const newBudgetBlock = `{[
                          { id: "budget", label: "Budget", icon: "🎒" },
                          { id: "moderate", label: "Moderate", icon: "🏨" },
                          { id: "luxury", label: "Luxury", icon: "✨" },
                          { id: "custom", label: "Custom", icon: "✏️" }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (opt.id === "custom") {
                                setIsCustomBudget(true);
                                setBudget("");
                              } else {
                                setIsCustomBudget(false);
                                setBudget(opt.id);
                              }
                            }}
                            className={cn(
                              "flex items-center w-full px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border-2 text-left",
                              (!isCustomBudget && budget === opt.id) || (isCustomBudget && opt.id === "custom")
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm" 
                                : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                            )}
                          >
                            <span className="mr-3 text-lg">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                        {isCustomBudget && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1">
                            <Input 
                              placeholder="e.g. $5,000 for 2 people" 
                              value={customBudget}
                              onChange={(e) => setCustomBudget(e.target.value)}
                              className="bg-zinc-50 dark:bg-zinc-900/50 border-blue-200 dark:border-blue-800/50 focus-visible:ring-blue-500"
                            />
                          </motion.div>
                        )}`;

txt = txt.replace(oldBudgetBlockRegex, newBudgetBlock);

// 4. Fix Travel Style emojis using replace directly on the array definition
const oldTravelStyleRegex = /\{\[\s*\{ id: "relaxed".*?\]\.map\(opt => \(/s;
const newTravelStyleBlock = `{[
                          { id: "relaxed", label: "Relaxed", icon: "🌴" },
                          { id: "adventure", label: "Adventure", icon: "🏔️" },
                          { id: "culture", label: "Culture", icon: "🏛️" },
                          { id: "foodie", label: "Foodie", icon: "🍜" },
                          { id: "party", label: "Nightlife", icon: "🎉" }
                        ].map(opt => (`;

txt = txt.replace(oldTravelStyleRegex, newTravelStyleBlock);

// 5. Update the Badges shown when generated
txt = txt.replace('{budget && (', '{(budget || customBudget) && (');
txt = txt.replace('💰 {budget}', '💰 {isCustomBudget ? customBudget : budget}');

fs.writeFileSync('app/page.tsx', txt, 'utf8');