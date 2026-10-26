import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ count: 0, limit: 2, remaining: 2 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { generationCount: true, lastGenerationDate: true },
    });

    if (!user) {
      return NextResponse.json({ count: 0, limit: 2, remaining: 2 });
    }

    const lastGen = user.lastGenerationDate ? new Date(user.lastGenerationDate).getTime() : 0;
    const isExpired = Date.now() - lastGen > THIRTY_DAYS_MS;
    const count = isExpired ? 0 : user.generationCount;

    return NextResponse.json({
      count,
      limit: 2,
      remaining: Math.max(0, 2 - count),
      resetsAt: user.lastGenerationDate ? new Date(lastGen + THIRTY_DAYS_MS).toISOString() : null,
    });
  } catch (error) {
    console.error("Error fetching trip count:", error);
    return NextResponse.json({ count: 0, limit: 2, remaining: 2 }, { status: 500 });
  }
}
