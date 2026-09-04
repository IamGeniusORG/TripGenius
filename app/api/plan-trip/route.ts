import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  // Make sure to add this environment variable in your .env.local file
  apiKey: process.env.OPENROUTER_API_KEY || "", 
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { destination, origin, dateRange, budget, travelStyle } = body;

    const systemPrompt = `You are an elite, high-end travel concierge and expert AI trip planner.
You must deeply analyze the EXACT location the user asks for (do not just give generic country advice).
Provide highly specific places, restaurants, and hidden gems that exist in that exact locale.
The user is departing from: . If relevant, suggest feasible arrival logistics or first-day activities that make sense coming from there.
MULTI-STYLE OPTIMIZATION: The user may select multiple Travel Styles. Your response MUST make it highly visible and feasible how you are catering to EVERY SINGLE selected style. Blend them seamlessly so the itinerary flows logically.
BUDGET & CURRENCY INTELLIGENCE: The user will provide a free-text budget which may be in any global currency (e.g., "50,000 INR", "£2000", "$500 a day"). You must seamlessly accept this. In the background, silently evaluate the purchasing power of their entered amount for their specific destination. Automatically determine the "comfort tier" (Backpacker, Moderate, Luxury, Ultra-Luxury) based on their budget and plan all hotels, dining, and activities to fit within it. Do NOT explain your currency conversion or math to the user—just deliver a flawless itinerary that respects their limits.
  CRITICAL: You MUST include a 'topDestinations' array containing the most popular tourist places and attractions of the requested destination, strictly sorted in ALPHABETICAL ORDER (A to Z).
For every location, activity, or hotel, provide a single, highly descriptive search term in the "imageKeyword" field (e.g. "shibuya+crossing+tokyo", "luxury+resort+maldives") with no spaces, using plus signs.

FORMATTING RULES FOR ACTIVITIES:
The user demands absolute premium, magazine-style formatting.
DO NOT EVER use the phrases "Option A" or "Option B". That is banned.
Instead, you must provide 2 distinct, beautifully formatted choices for every part of the day using Markdown.
You MUST put a double line break and a horizontal rule between the two choices so they do not clump together.
Example format you MUST follow:
"**\u2B50 The Adventurer's Path:**\nStart your day with a thrilling hike up...\n\n---\n\n**\u2615 The Cultural Immersion:**\nPrefer a slower pace? Wander through the historic..."
Use rich, sensory details, professional tone, sophisticated vocabulary, and actual unicode emojis!

You must return your response STRICTLY as a valid JSON object matching this exact schema:
{
  "title": "Trip Title",
  "imageKeyword": "hyper specific keyword for the destination",
  "summary": "Short overview highlighting the premium experience",
  "topDestinations": [
    {
      "name": "Alphabetical Name 1, City, Country",
      "imageKeyword": "keyword for this specific place",
      "description": "Premium description of the place"
    }
  ],
  "accommodations": [
    {
      "tier": "Luxury",
      "name": "Specific Hotel Name",
      "imageKeyword": "keyword for this hotel type and location",
      "description": "Why it's great and who it fits best"
    }
  ],
  "days": [
    {
      "day": "Day 1",
      "description": "Daily theme or summary",
      "imageKeyword": "keyword representing this day's main vibe",
      "activities": [
        {"time": "Morning", "description": "Markdown formatted choices. Remember: NO 'Option A'. Use beautifully bolded thematic titles (e.g., **The Explorer:** ...)."}
      ],
      "dining": ["Lunch: [Specific Restaurant]", "Dinner: [Specific Restaurant]"]
    }
  ]
}
Do NOT include any conversational text before or after the JSON.`;

    const userPrompt = `
Please plan a trip with the following details:
- Departing From: 
- Destination: 
- Dates: ${dateRange?.from ? new Date(dateRange.from).toLocaleDateString() : "Not specified"} to ${dateRange?.to ? new Date(dateRange.to).toLocaleDateString() : "Not specified"}
- Budget: ${budget || "Not specified"}
- Travel Style: ${travelStyle || "Not specified"}

Provide a daily itinerary, recommended activities, and dining options.
`;

    const completion = await openai.chat.completions.create(
      {
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 5000, // Added to prevent 402 pre-authorization failures with Gemini's huge default limits
      },
      {
        extra_body: {
          models: [
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "anthropic/claude-3-haiku",
            "meta-llama/llama-3.1-8b-instruct"
          ]
        }
      } as any
    );

    let aiMessage = completion.choices[0].message?.content || "{}";
    
    // Clean potential conversational text wrapping the JSON (Gemini sometimes leaks text despite JSON format)
    const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiMessage = jsonMatch[0];
    }
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiMessage);
    } catch (e) {
      console.error("Failed to parse AI response as JSON", e);
      parsedResponse = { 
        error: "Failed to parse AI response",
        rawResponse: aiMessage 
      };
    }

    if (userId && !parsedResponse.error) {
      try {
        await prisma.trip.create({
          data: {
            userId,
            destination: destination || "Unknown",
            dates: `${dateRange?.from ? new Date(dateRange.from).toLocaleDateString() : ""} to ${dateRange?.to ? new Date(dateRange.to).toLocaleDateString() : ""}`,
            itinerary: parsedResponse,
          },
        });
      } catch (dbError) {
        console.error("Failed to save trip to database:", dbError);
      }
    }

    return NextResponse.json({ itinerary: parsedResponse });
  } catch (error) {
    console.error("Error in AI trip planning API:", error);
    return NextResponse.json(
      { error: "Failed to generate trip plan." },
      { status: 500 }
    );
  }
}






