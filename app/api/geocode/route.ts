import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`, {
      headers: {
        "User-Agent": "TripGenius/2.5 (Travel Planner App)"
      }
    });

    if (!res.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server geocoding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
