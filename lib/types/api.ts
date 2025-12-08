export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  details?: string;
}

export interface ActiveSession {
  id: string;
  startedAt: string;
  courseName?: string;
  notes?: string;
}

export interface TimerStartRequest {
  subject?: string;
  notes?: string;
  courseId?: string;
}

export interface TimerStartResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    startedAt: string;
    courseName?: string;
    notes?: string;
  };
}

export interface TimerStopResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    duration: number;
    durationText: string;
    hours: number;
    minutes: number;
    endedAt?: string;
  };
}

export interface StatsResponse {
  success: boolean;
  stats: {
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
  };
  activeSession: {
    id: string;
    startedAt: string;
    courseName?: string;
    notes?: string;
  } | null;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

export interface ChatMessageResponse {
  response: string;
  conversationId: string;
  userId: string;
  activeSession: {
    id: string;
    startedAt: string;
    courseName?: string;
    notes?: string;
  } | null;
}

