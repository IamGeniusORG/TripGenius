import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { destination, dates, itinerary } = body;

    if (!destination || !itinerary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        destination,
        dates: dates || "Unspecified",
        itinerary,
      },
    });

    return NextResponse.json({ success: true, tripId: trip.id });
  } catch (error) {
    console.error("[Save Guest Trip Error]:", error);
    return NextResponse.json(
      { error: "Could not save the guest trip to your account." },
      { status: 500 }
    );
  }
}