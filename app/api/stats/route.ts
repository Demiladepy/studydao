import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserStats, getActiveGoals, getActiveSession } from "@/lib/agent/db-helpers";

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
    const period = (searchParams.get("period") as "today" | "week" | "month" | "all") || "week";

    // Get stats
    const stats = await getUserStats(userId, period);
    
    // Get active goals
    const activeGoals = await getActiveGoals(userId);
    
    // Get active session
    const activeSession = await getActiveSession(userId);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        activeGoals: activeGoals.map((goal) => ({
          id: goal.id,
          type: goal.type,
          targetHours: goal.targetHours,
          currentHours: goal.currentHours,
          progress: Math.round((goal.currentHours / goal.targetHours) * 100),
          periodStart: goal.periodStart.toISOString(),
          periodEnd: goal.periodEnd.toISOString(),
          completed: goal.completed,
        })),
      },
      activeSession: activeSession
        ? {
            id: activeSession.id,
            startedAt: activeSession.startedAt.toISOString(),
            courseName: activeSession.courseName,
            notes: activeSession.notes,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

