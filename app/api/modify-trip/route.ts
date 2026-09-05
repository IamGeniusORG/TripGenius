import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "", 
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { originalItinerary, modificationPrompt, destination } = body;

    const systemPrompt = `You are an elite AI travel concierge. 
The user already has a generated itinerary, but they want to modify it.
You must return the ENTIRE modified itinerary strictly as a valid JSON object matching the exact schema of the original itinerary.
Incorporate the user's requested changes seamlessly into the days, activities, or accommodations. Do not mention that you modified it, just output the updated JSON.

CRITICAL: You MUST include a 'topDestinations' array containing the most popular tourist places and attractions of the requested destination, strictly sorted in ALPHABETICAL ORDER (A to Z).
For every location, activity, or hotel, provide a single, highly descriptive search term in the "imageKeyword" field (e.g. "shibuya+crossing+tokyo", "luxury+resort+maldives") with no spaces, using plus signs.
CRITICAL: You MUST also provide exact GPS coordinates for every location and accommodation in a "coordinates" object containing "lat" and "lng" as numbers (e.g. "coordinates": { "lat": 35.6595, "lng": 139.7005 }).

FORMATTING RULES FOR ACTIVITIES:
The user demands absolute premium, magazine-style formatting.
DO NOT EVER use the phrases "Option A" or "Option B". That is banned.
Instead, you must provide 2 distinct, beautifully formatted choices for every part of the day using Markdown.
You MUST put a double line break and a horizontal rule between the two choices so they do not clump together.
Example format you MUST follow:
"**\u2B50 The Adventurer's Path:**\nStart your day with a thrilling hike up...\n\n---\n\n**\u2615 The Cultural Immersion:**\nPrefer a slower pace? Wander through the historic..."
Use rich, sensory details, professional tone, sophisticated vocabulary, and actual unicode emojis!

You must return your response STRICTLY as a valid JSON object matching the original schema structure.`;

    const userPrompt = `
Here is the original itinerary:
${JSON.stringify(originalItinerary)}

The user wants to make the following modification:
"${modificationPrompt}"

Rewrite the itinerary to include these modifications. Return ONLY the new JSON object.
`;

    const completion = await openai.chat.completions.create(
      {
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 5000,
      },
      {
        extra_body: {
          models: [
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "anthropic/claude-3-haiku"
          ]
        }
      } as any
    );

    let aiMessage = completion.choices[0].message?.content || "{}";
    
    const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiMessage = jsonMatch[0];
    }
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiMessage);
    } catch (e) {
      console.error("Failed to parse modified AI response as JSON", e);
      parsedResponse = { error: "Failed to parse AI response" };
    }

    if (userId && !parsedResponse.error) {
      try {
        await prisma.trip.create({
          data: {
            userId,
            destination: destination || parsedResponse.title || "Unknown",
            dates: "Modified Trip",
            itinerary: parsedResponse,
          },
        });
      } catch (dbError) {
        console.error("Failed to save modified trip to database:", dbError);
      }
    }

    return NextResponse.json({ itinerary: parsedResponse });
  } catch (error) {
    console.error("Error in modify API:", error);
    return NextResponse.json({ error: "Failed to modify trip." }, { status: 500 });
  }
}
