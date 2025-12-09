import { NextRequest, NextResponse } from "next/server";
import { createStudyAgent } from "@/lib/agent/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatMessageWithContext, getOrCreateContext } from "@/lib/agent/utils";
import { getActiveSession } from "@/lib/agent/db-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);

    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      console.error("No session found");
      return NextResponse.json(
        { error: "Unauthorized. Please log in again to refresh your session." },
        { status: 401 }
      );
    }

    // Get user ID - either from session or lookup by email
    let userId = (session.user as any).id;

    if (!userId && session.user.email) {
      console.log("User ID not in session, looking up by email:", session.user.email);
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (user) {
        userId = user.id;
        console.log("Found user ID:", userId);
      }
    }

    if (!userId) {
      console.error("Could not determine user ID");
      return NextResponse.json(
        { error: "User ID not found. Please log out and log back in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Get or create conversation context
    const context = getOrCreateContext(userId, conversationId);

    // Check for active session to include in context
    const activeSession = await getActiveSession(userId);

    // Create agent instance
    const { runner } = await createStudyAgent();

    // Format message with user context and active session info
    let contextualMessage = formatMessageWithContext(message, context);

    if (activeSession) {
      const elapsed = Math.floor((new Date().getTime() - activeSession.startedAt.getTime()) / 1000 / 60);
      contextualMessage += `\n\nActive Session Info: The user currently has an active study session that started ${elapsed} minutes ago.`;
      if (activeSession.courseName) {
        contextualMessage += ` They are studying ${activeSession.courseName}.`;
      }
      if (activeSession.notes) {
        contextualMessage += ` Notes: ${activeSession.notes}`;
      }
    }

    // Run the agent using runner.ask()
    const response = await runner.ask(contextualMessage);

    // Extract response text - runner.ask() returns a string by default
    const responseText = typeof response === "string"
      ? response
      : "I'm here to help with your studies!";

    // Get updated active session status
    const updatedActiveSession = await getActiveSession(userId);

    return NextResponse.json({
      response: responseText,
      conversationId: context.conversationId,
      userId: context.userId,
      activeSession: updatedActiveSession ? {
        id: updatedActiveSession.id,
        startedAt: updatedActiveSession.startedAt.toISOString(),
        courseName: updatedActiveSession.courseName,
        notes: updatedActiveSession.notes,
      } : null,
    });
  } catch (error) {
    console.error("Error in agent chat:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
