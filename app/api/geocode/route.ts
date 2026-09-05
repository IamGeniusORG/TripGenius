import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    // We use Open-Meteo's free geocoding API which is highly reliable and doesn't block generic User-Agents
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`);

    if (!res.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await res.json();
    
    // Transform Open-Meteo response to match the expected legacy Nominatim format
    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      return NextResponse.json([{
        lat: result.latitude,
        lon: result.longitude
      }]);
    }
    
    return NextResponse.json([]);
  } catch (error) {
    console.error("Server geocoding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}