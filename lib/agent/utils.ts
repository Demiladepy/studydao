import { prisma } from "@/lib/prisma";

export interface AgentContext {
  userId: string;
  conversationId: string;
  lastMessage?: string;
  lastResponse?: string;
}

// Store conversation context (in production, use Redis or database)
const conversationContexts = new Map<string, AgentContext>();

export function getOrCreateContext(userId: string, conversationId?: string): AgentContext {
  const id = conversationId || `conv-${userId}-${Date.now()}`;
  
  if (!conversationContexts.has(id)) {
    conversationContexts.set(id, {
      userId,
      conversationId: id,
    });
  }

  return conversationContexts.get(id)!;
}

export function updateContext(conversationId: string, updates: Partial<AgentContext>): void {
  const context = conversationContexts.get(conversationId);
  if (context) {
    Object.assign(context, updates);
    conversationContexts.set(conversationId, context);
  }
}

export function getContext(conversationId: string): AgentContext | undefined {
  return conversationContexts.get(conversationId);
}

// Helper to format user message with context
export function formatMessageWithContext(
  message: string,
  context: AgentContext
): string {
  // Get user info for context
  return `User Context:
- User ID: ${context.userId}
- Conversation ID: ${context.conversationId}

User Message: ${message}

Remember to use the available tools (startTimer, stopTimer, showStats, setGoal, getMotivation) when appropriate. Always include the userId parameter when calling tools.`;
}

