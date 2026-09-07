import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const tripId = resolvedParams.id;

    // Check if it's already saved
    const existing = await prisma.savedTrip.findUnique({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
    });

    if (existing) {
      // Unsave
      await prisma.savedTrip.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await prisma.savedTrip.create({
        data: {
          userId,
          tripId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Failed to toggle save trip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ saved: false });
    }

    const resolvedParams = await params;
    const tripId = resolvedParams.id;

    const existing = await prisma.savedTrip.findUnique({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
    });

    return NextResponse.json({ saved: !!existing });
  } catch (error) {
    return NextResponse.json({ saved: false });
  }
}