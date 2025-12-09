"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStats } from "@/lib/hooks/useStats";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import Link from "next/link";

interface StudySession {
  id: string;
  courseName: string | null;
  notes: string | null;
  duration: number;
  durationHours: number;
  durationMinutes: number;
  startedAt: string;
  endedAt: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, isLoading: statsLoading } = useStats("week");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSessions();
    }
  }, [session]);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions?limit=10");
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  };

  if (status === "loading" || statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDuration = (hours: number, minutes: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">StudyDAO</h1>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-700 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            <Link href="/chat">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat Agent
              </button>
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full text-sm text-gray-600 hover:text-gray-900 text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {session.user?.name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p className="text-gray-600">Here's what's happening with your studies today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Hours */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Today</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.todayHours.toFixed(1) || "0.0"}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stats?.todayMinutes || 0} minutes</p>
            </div>

            {/* Weekly Hours */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">This Week</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.weeklyHours.toFixed(1) || "0.0"}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stats?.weeklyMinutes || 0} minutes</p>
            </div>

            {/* Streak */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Streak</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.currentStreak || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">days</p>
            </div>

            {/* Total Sessions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Sessions</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.sessionCount || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Avg {stats?.averageSessionLength || 0}m</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
                  <Link href="/chat">
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      + Add Goal
                    </button>
                  </Link>
                </div>
                {stats?.activeGoals && stats.activeGoals.length > 0 ? (
                  <div className="space-y-4">
                    {stats.activeGoals.map((goal) => {
                      const progress = Math.min((goal.currentHours / goal.targetHours) * 100, 100);
                      return (
                        <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-900 capitalize">
                              {goal.type} Goal
                            </span>
                            <span className="text-sm font-bold text-purple-600">
                              {goal.currentHours.toFixed(1)}h / {goal.targetHours}h
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${progress >= 100
                                  ? "bg-green-500"
                                  : progress >= 75
                                    ? "bg-blue-500"
                                    : progress >= 50
                                      ? "bg-yellow-500"
                                      : "bg-purple-500"
                                }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">No active goals yet</p>
                    <Link href="/chat">
                      <Button variant="primary" size="sm">
                        Set your first goal
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/chat" className="block">
                    <button className="w-full py-3 px-4 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transition-all">
                      Start Session
                    </button>
                  </Link>
                  <Link href="/chat" className="block">
                    <button className="w-full py-3 px-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all">
                      View Stats
                    </button>
                  </Link>
                  <Link href="/chat" className="block">
                    <button className="w-full py-3 px-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all">
                      Set Goal
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mt-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Sessions</h2>
              </div>
              {sessionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {session.courseName || session.notes || "Study Session"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(session.startedAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">
                          {formatDuration(session.durationHours, session.durationMinutes)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">No sessions yet</p>
                  <Link href="/chat">
                    <Button variant="primary" size="sm">
                      Start your first session
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
