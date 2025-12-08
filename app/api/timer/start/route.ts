import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findCourseByName } from "@/lib/agent/db-helpers";
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

    const body = await request.json();
    const { subject, notes, courseId } = body;

    const userId = session.user.id;

    // Check if user has an active session
    const activeSession = await prisma.studySession.findFirst({
      where: {
        userId,
        status: "active",
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (activeSession) {
      const elapsed = differenceInMinutes(new Date(), activeSession.startedAt);
      const hours = Math.floor(elapsed / 60);
      const mins = elapsed % 60;
      return NextResponse.json(
        {
          error: "You already have an active study session",
          message: `You have an active session running for ${hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}. Please stop it first.`,
          activeSession: {
            id: activeSession.id,
            startedAt: activeSession.startedAt.toISOString(),
            courseName: null,
            notes: activeSession.notes || undefined,
          },
        },
        { status: 400 }
      );
    }

    // Try to find course by subject name if provided
    let finalCourseId: string | null = courseId || null;
    if (subject && !courseId) {
      finalCourseId = await findCourseByName(userId, subject);
    }

    // Combine subject and notes
    const sessionNotes = subject
      ? notes
        ? `${subject} - ${notes}`
        : subject
      : notes || null;

    // Create new study session
    const newSession = await prisma.studySession.create({
      data: {
        userId,
        courseId: finalCourseId,
        duration: 0,
        startedAt: new Date(),
        status: "active",
        notes: sessionNotes,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Study timer started! ${newSession.course ? `Studying ${newSession.course.name}` : subject ? `Studying ${subject}` : "Let's get focused!"} 🎯`,
      session: {
        id: newSession.id,
        startedAt: newSession.startedAt.toISOString(),
        courseName: newSession.course?.name || undefined,
        notes: newSession.notes || undefined,
      },
    });
  } catch (error) {
    console.error("Error starting timer:", error);
    return NextResponse.json(
      {
        error: "Failed to start study timer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

