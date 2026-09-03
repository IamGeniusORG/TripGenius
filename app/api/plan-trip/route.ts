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
    const { destination, dateRange, budget, travelStyle } = body;

    const systemPrompt = `You are an expert AI trip planner and flexible travel advisor. 
You must deeply analyze the EXACT location the user asks for (do not just give generic country advice).
Instead of giving strict orders, provide multiple options so the user can choose based on their mood and exact budget. 
Provide highly specific places, restaurants, and hidden gems that exist in that exact locale.
CRITICAL: You MUST include a 'topDestinations' array containing the most popular tourist places and attractions of the requested destination, and they MUST be strictly sorted in ALPHABETICAL ORDER (A to Z).
For every location, activity, or hotel, provide a single, highly descriptive search term in the "imageKeyword" field (e.g. "shibuya+crossing+tokyo", "ryokan+kyoto", "eiffel+tower+paris") with no spaces, using plus signs.
You must return your response STRICTLY as a valid JSON object matching this exact schema:
{
  "title": "Trip Title",
  "imageKeyword": "hyper specific keyword for the destination",
  "summary": "Short overview highlighting the flexibility and various options of the trip",
  "topDestinations": [
    {
      "name": "Alphabetical Name 1 (e.g. Akihabara)",
      "imageKeyword": "keyword for this specific place",
      "description": "Short description of the place"
    }
  ],
  "accommodations": [
    {
      "tier": "Luxury",
      "name": "Specific Hotel Name",
      "imageKeyword": "keyword for this hotel type and location",
      "description": "Why it's great and who it fits best"
    },
    {
      "tier": "Comfort / Mid-Range",
      "name": "Specific Hotel Name",
      "imageKeyword": "keyword for this hotel type and location",
      "description": "Why it's great and who it fits best"
    },
    {
      "tier": "Budget / Value",
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
        {"time": "Morning", "description": "Suggest 2 distinct options (e.g., Option A: Adventure... OR Option B: Relaxing...)"}
      ],
      "dining": ["Lunch: [Specific Restaurant 1] or [Specific Restaurant 2]", "Dinner: [Specific Restaurant 1] or [Specific Restaurant 2]"]
    }
  ]
}
Do NOT include any conversational text before or after the JSON.`;

    const userPrompt = `
Please plan a trip with the following details:
- Destination: ${destination || "Not specified"}
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
        response_format: { type: "json_object" },
        max_tokens: 2500, // Added to prevent 402 pre-authorization failures with Gemini's huge default limits
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
