import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { ActiveSession } from "@/lib/types/api";

interface UseTimerReturn {
  activeSession: ActiveSession | null;
  isLoading: boolean;
  error: string | null;
  startTimer: (subject?: string, notes?: string, courseId?: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useTimer(): UseTimerReturn {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTimer = useCallback(async (
    subject?: string,
    notes?: string,
    courseId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.startTimer({
        subject,
        notes,
        courseId,
      });

      setActiveSession(response.session);
    } catch (err: any) {
      setError(err.message || "Failed to start timer");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopTimer = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.stopTimer();
      setActiveSession(null);
    } catch (err: any) {
      setError(err.message || "Failed to stop timer");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const stats = await apiClient.getStats();
      setActiveSession(stats.activeSession);
    } catch (err: any) {
      // Silently fail for refresh
      console.error("Failed to refresh session:", err);
    }
  }, []);

  return {
    activeSession,
    isLoading,
    error,
    startTimer,
    stopTimer,
    refreshSession,
  };
}

