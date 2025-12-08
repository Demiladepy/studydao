import { useState, useCallback, useRef, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { ActiveSession } from "@/lib/types/api";

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  activeSession: ActiveSession | null;
  sendMessage: (content: string) => Promise<void>;
  conversationId: string;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [conversationId] = useState<string>(() => `conv-${Date.now()}`);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const data = await apiClient.sendMessage({
        message: content.trim(),
        conversationId,
      });

      const agentMessage: Message = {
        id: `msg-${Date.now()}-agent`,
        role: "agent",
        content: data.response || "I'm here to help with your studies!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setActiveSession(data.activeSession || null);
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
      const errorMessage = err.message || "Failed to send message. Please try again.";
      setError(errorMessage);
      
      const errorMsg: Message = {
        id: `msg-${Date.now()}-error`,
        role: "agent",
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, conversationId]);

  // Poll for active session updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (activeSession) {
        try {
          const stats = await apiClient.getStats();
          setActiveSession(stats.activeSession);
        } catch (err) {
          // Silently fail for polling
        }
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [activeSession]);

  return {
    messages,
    isLoading,
    error,
    activeSession,
    sendMessage,
    conversationId,
  };
}

