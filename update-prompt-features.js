const fs = require('fs');
let file = fs.readFileSync('app/api/plan-trip/route.ts', 'utf8');

const oldSystemPrompt = "CRITICAL: Include 3-4 \"localTips\" and 4-5 \"packingList\" items.\nCRITICAL: Include a \"budgetBreakdown\" array that estimates realistic costs (using numbers only for the value).";

const newSystemPrompt = `CRITICAL: Include 3-4 "localTips".
CRITICAL: Include a structured "packingList" categorized by item type (e.g., Clothing, Electronics, Health).
CRITICAL: PARSE the user's budget currency (e.g., $, €, ₹, INR, USD). You MUST conduct a realistic, context-aware economic analysis of the destination's cost-of-living. DO NOT simply parrot back the user's budget. Calculate highly realistic costs for the duration of the trip and breakdown the "budgetBreakdown" exactly into: 'Accommodation', 'Food & Dining', 'Activities', 'Transportation', and 'Contingency'. Provide "estimatedCost" as a raw number and "currency" as the string symbol.`;

file = file.replace(oldSystemPrompt, newSystemPrompt);

// Now update the schema inside the prompt
const oldSchema = `"budgetBreakdown": [
    { "category": "Accommodation", "estimatedCost": 1500 }
  ],
  "days": [`;
  
const newSchema = `"budgetBreakdown": [
    { "category": "Accommodation", "estimatedCost": 1500, "currency": "$" },
    { "category": "Food & Dining", "estimatedCost": 800, "currency": "$" },
    { "category": "Activities", "estimatedCost": 450, "currency": "$" },
    { "category": "Transportation", "estimatedCost": 300, "currency": "$" },
    { "category": "Contingency", "estimatedCost": 200, "currency": "$" }
  ],
  "packingList": [
    {
      "category": "Electronics",
      "items": ["Power Bank", "Universal Adapter"]
    },
    {
      "category": "Clothing",
      "items": ["Comfortable Walking Shoes", "Light Jacket"]
    }
  ],
  "days": [`;

file = file.replace(oldSchema, newSchema);
fs.writeFileSync('app/api/plan-trip/route.ts', file, 'utf8');
console.log("Updated AI Prompt for Dynamic Currency & Packing List schema.");