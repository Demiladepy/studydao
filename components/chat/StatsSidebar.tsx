"use client";

import { useStats } from "@/lib/hooks/useStats";

export function StatsSidebar() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div style={{ width: '100%' }}>
        <h2 style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Quick Stats
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: '80px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }} className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const todayHours = stats?.todayHours || 0;
  const streak = stats?.currentStreak || 0;
  const weeklyHours = stats?.weeklyHours || 0;

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Quick Stats
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Today's Hours */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: '#1e40af' }}>
              Today
            </p>
            <svg style={{ width: '16px', height: '16px', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: '#1e40af' }}>
            {todayHours.toFixed(1)}h
          </p>
        </div>

        {/* Streak */}
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: '#c2410c' }}>
              Streak
            </p>
            <svg style={{ width: '16px', height: '16px', color: '#f97316' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: '#c2410c' }}>
            {streak} <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>days</span>
          </p>
        </div>

        {/* Weekly Hours */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: '#15803d' }}>
              This Week
            </p>
            <svg style={{ width: '16px', height: '16px', color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: '#15803d' }}>
            {weeklyHours.toFixed(1)}h
          </p>
        </div>

        {/* Sessions Count */}
        {stats && stats.sessionCount > 0 && (
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
                Total Sessions
              </p>
              <svg style={{ width: '16px', height: '16px', color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {stats.sessionCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
