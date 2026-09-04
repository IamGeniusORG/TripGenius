const fs = require('fs');

// --- 1. Update UI (app/page.tsx) ---
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');

// Remove custom budget states
pageTxt = pageTxt.replace(/const \[budget, setBudget\] = useState\(""\);\s*const \[customBudget, setCustomBudget\] = useState\(""\);\s*const \[isCustomBudget, setIsCustomBudget\] = useState\(false\);/, 'const [budget, setBudget] = useState("");');

// Replace submission payload
pageTxt = pageTxt.replace('budget: isCustomBudget ? customBudget : budget, travelStyle: travelStyle.join(', 'budget, travelStyle: travelStyle.join(');

// Replace the Budget section
const oldBudgetSection = /<div className="flex flex-col space-y-2">\s*\{\[\s*\{ id: "budget".*?<\/motion\.div>\s*\)\}\s*<\/div>/s;
const newBudgetSection = `<div className="relative">
                        <Wallet className="absolute left-4 top-3.5 h-5 w-5 text-emerald-500" />
                        <Input 
                          placeholder="e.g. $5,000, or 50,000 INR for 2 adults" 
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="pl-12 h-12 text-base bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 shadow-sm rounded-xl"
                        />
                      </div>`;
pageTxt = pageTxt.replace(oldBudgetSection, newBudgetSection);

// Update badge rendering
pageTxt = pageTxt.replace(/\{\(budget \|\| customBudget\) && \(/g, '{budget && (');
pageTxt = pageTxt.replace(/💰 \{isCustomBudget \? customBudget : budget\}/g, '💰 {budget}');

fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');


// --- 2. Update AI Prompt (app/api/plan-trip/route.ts) ---
let routeTxt = fs.readFileSync('app/api/plan-trip/route.ts', 'utf8');

const promptInsertionPoint = `MULTI-STYLE OPTIMIZATION: The user may select multiple Travel Styles. Your response MUST make it highly visible and feasible how you are catering to EVERY SINGLE selected style. Blend them seamlessly so the itinerary flows logically.`;

const budgetInstructions = `BUDGET & CURRENCY INTELLIGENCE: The user will provide a free-text budget which may be in any global currency (e.g., "50,000 INR", "£2000", "$500 a day"). You must seamlessly accept this. In the background, silently evaluate the purchasing power of their entered amount for their specific destination. Automatically determine the "comfort tier" (Backpacker, Moderate, Luxury, Ultra-Luxury) based on their budget and plan all hotels, dining, and activities to fit within it. Do NOT explain your currency conversion or math to the user—just deliver a flawless itinerary that respects their limits.`;

routeTxt = routeTxt.replace(promptInsertionPoint, promptInsertionPoint + "\n" + budgetInstructions);

fs.writeFileSync('app/api/plan-trip/route.ts', routeTxt, 'utf8');
