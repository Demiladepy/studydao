import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStudyGoals } from "@/lib/agent/db-helpers";
import { differenceInMinutes } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find active session
    const activeSession = await prisma.studySession.findFirst({
      where: {
        userId,
        status: "active",
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        course: true,
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        {
          error: "No active session",
          message: "You don't have an active study session to stop.",
        },
        { status: 400 }
      );
    }

    const endedAt = new Date();
    const duration = differenceInMinutes(endedAt, activeSession.startedAt);

    // Update session
    const updatedSession = await prisma.studySession.update({
      where: {
        id: activeSession.id,
      },
      data: {
        endedAt,
        duration,
        status: "completed",
      },
    });

    // Update study goals
    await updateStudyGoals(userId, duration);

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    let encouragement = "";
    if (duration >= 120) {
      encouragement = "Incredible focus! 🔥";
    } else if (duration >= 60) {
      encouragement = "Excellent session! 🌟";
    } else if (duration >= 25) {
      encouragement = "Great Pomodoro session! 🍅";
    } else {
      encouragement = "Every minute counts! 💪";
    }

    const subjectText = activeSession.course
      ? ` on ${activeSession.course.name}`
      : activeSession.notes
      ? ` on ${activeSession.notes}`
      : "";

    return NextResponse.json({
      success: true,
      message: `Great work! You studied for ${durationText}${subjectText}. ${encouragement}`,
      session: {
        id: updatedSession.id,
        duration,
        durationText,
        hours,
        minutes,
        endedAt: updatedSession.endedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error stopping timer:", error);
    return NextResponse.json(
      {
        error: "Failed to stop study timer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

