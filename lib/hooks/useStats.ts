import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

export interface StudyStats {
  totalHours: number;
  totalMinutes: number;
  sessionCount: number;
  averageSessionLength: number;
  currentStreak: number;
  todayMinutes: number;
  todayHours: number;
  weeklyHours: number;
  weeklyMinutes: number;
  activeGoals: Array<{
    id: string;
    type: string;
    targetHours: number;
    currentHours: number;
    progress: number;
    periodStart: string;
    periodEnd: string;
    completed: boolean;
  }>;
}

interface UseStatsReturn {
  stats: StudyStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: (period?: "today" | "week" | "month" | "all") => Promise<void>;
}

const defaultStats: StudyStats = {
  totalHours: 0,
  totalMinutes: 0,
  sessionCount: 0,
  averageSessionLength: 0,
  currentStreak: 0,
  todayMinutes: 0,
  todayHours: 0,
  weeklyHours: 0,
  weeklyMinutes: 0,
  activeGoals: [],
};

export function useStats(period: "today" | "week" | "month" | "all" = "week"): UseStatsReturn {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (statsPeriod: "today" | "week" | "month" | "all" = period) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient.getStats(statsPeriod);
      
      if (data.success && data.stats) {
        setStats({
          totalHours: data.stats.totalHours,
          totalMinutes: data.stats.totalMinutes,
          sessionCount: data.stats.sessionCount,
          averageSessionLength: data.stats.averageSessionLength,
          currentStreak: data.stats.currentStreak,
          todayMinutes: data.stats.todayMinutes,
          todayHours: data.stats.todayHours,
          weeklyHours: data.stats.weeklyHours,
          weeklyMinutes: data.stats.weeklyMinutes,
          activeGoals: data.stats.activeGoals || [],
        });
      } else {
        setStats(defaultStats);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load statistics");
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(() => fetchStats(), 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

