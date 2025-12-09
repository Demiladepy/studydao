import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get recent completed sessions
    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        status: "completed",
      },
      include: {
        course: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        id: session.id,
        courseName: session.course?.name || null,
        notes: session.notes || null,
        duration: session.duration,
        durationHours: Math.floor(session.duration / 60),
        durationMinutes: session.duration % 60,
        startedAt: session.startedAt.toISOString(),
        endedAt: session.endedAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch study sessions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

