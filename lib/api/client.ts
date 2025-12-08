import {
  ApiResponse,
  TimerStartRequest,
  TimerStartResponse,
  TimerStopResponse,
  StatsResponse,
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/lib/types/api";

const API_BASE = "/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "API request failed");
  }

  return response.json();
}

export const apiClient = {
  // Chat API
  async sendMessage(
    request: ChatMessageRequest
  ): Promise<ChatMessageResponse> {
    return fetchApi<ChatMessageResponse>("/agent/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // Timer API
  async startTimer(request: TimerStartRequest): Promise<TimerStartResponse> {
    return fetchApi<TimerStartResponse>("/timer/start", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async stopTimer(): Promise<TimerStopResponse> {
    return fetchApi<TimerStopResponse>("/timer/stop", {
      method: "POST",
    });
  },

  // Stats API
  async getStats(period: "today" | "week" | "month" | "all" = "week"): Promise<StatsResponse> {
    return fetchApi<StatsResponse>(`/stats?period=${period}`);
  },
};

