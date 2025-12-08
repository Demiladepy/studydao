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
    <div className="w-full sm:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your Stats
        </h2>

        <div className="space-y-3">
          {/* Today's Hours */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {todayHours.toFixed(1)}h
                </p>
              </div>
              <div className="text-2xl">📚</div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {streak} days
                </p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {weeklyHours.toFixed(1)}h
                </p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>

          {/* Sessions Count */}
          {stats && stats.sessionCount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.sessionCount}
                  </p>
                </div>
                <div className="text-xl">✅</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

