import { NextRequest, NextResponse } from "next/server";
import { createStudyAgent } from "@/lib/agent/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatMessageWithContext, getOrCreateContext } from "@/lib/agent/utils";
import { getActiveSession } from "@/lib/agent/db-helpers";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
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
    const context = getOrCreateContext(session.user.id, conversationId);

    // Check for active session to include in context
    const activeSession = await getActiveSession(session.user.id);

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
    const updatedActiveSession = await getActiveSession(session.user.id);

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

