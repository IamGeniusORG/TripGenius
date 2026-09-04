import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const tripId = resolvedParams.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // Verify ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip || trip.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    // Delete trip
    await prisma.trip.delete({
      where: { id: tripId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
