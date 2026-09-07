import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ count: 0, limit: 2 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTripsCount = await prisma.trip.count({
      where: {
        userId: userId,
        createdAt: { gte: twentyFourHoursAgo }
      }
    });

    return NextResponse.json({ count: recentTripsCount, limit: 2 });
  } catch (error) {
    console.error("Error fetching trip count:", error);
    return NextResponse.json({ count: 0, limit: 2 }, { status: 500 });
  }
}