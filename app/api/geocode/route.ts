import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    // Strictly follow Nominatim's usage policy by providing a unique contact email in the User-Agent
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
      headers: {
        "User-Agent": "TripGenius/3.0 (admin@tripgenius.com)",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!res.ok) {
      throw new Error(`Geocoding failed with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server geocoding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}