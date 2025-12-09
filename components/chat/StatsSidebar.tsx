"use client";

import { useStats } from "@/lib/hooks/useStats";

export function StatsSidebar() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="w-full sm:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 h-full overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Stats
          </h2>
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const todayHours = stats?.todayHours || 0;
  const streak = stats?.currentStreak || 0;
  const weeklyHours = stats?.weeklyHours || 0;

  return (
    <div className="w-full sm:w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-3 h-full overflow-y-auto">
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
          Stats
        </h2>

        <div className="space-y-2">
          {/* Today's Hours */}
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Today</p>
              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              {todayHours.toFixed(1)}h
            </p>
          </div>

          {/* Streak */}
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-3 border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Streak</p>
              <svg className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
              {streak} days
            </p>
          </div>

          {/* Weekly Hours */}
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
              {weeklyHours.toFixed(1)}h
            </p>
          </div>

          {/* Sessions Count */}
          {stats && stats.sessionCount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.sessionCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

