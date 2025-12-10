"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStats } from "@/lib/hooks/useStats";
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-surface)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            margin: '0 auto var(--space-4)',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Loading your dashboard...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-surface)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'var(--color-background)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        {/* Logo */}
        <div style={{ padding: 'var(--space-8) var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)'
            }}>
              StudyDAO
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0 var(--space-4)', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              border: 'none',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              width: '100%',
              textAlign: 'left'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>

            <Link href="/chat" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                border: 'none',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%',
                textAlign: 'left'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat Agent
              </button>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div style={{
          padding: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-base)'
            }}>
              {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {session.user?.name || 'User'}
              </p>
              <p style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {session.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn btn-ghost btn-sm btn-full"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-10) var(--space-8)' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }} className="animate-fade-in">
            <h2 style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em'
            }}>
              Welcome back, {session.user?.name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)'
            }}>
              Here's your study progress overview
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-10)'
          }} className="animate-fade-in">
            {/* Today's Hours */}
            <div className="card card-interactive" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Today
              </h3>
              <p style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {stats?.todayHours.toFixed(1) || "0.0"}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                {stats?.todayMinutes || 0} minutes
              </p>
            </div>

            {/* Weekly Hours */}
            <div className="card card-interactive" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                This Week
              </h3>
              <p style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {stats?.weeklyHours.toFixed(1) || "0.0"}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                {stats?.weeklyMinutes || 0} minutes
              </p>
            </div>

            {/* Streak */}
            <div className="card card-interactive" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Streak
              </h3>
              <p style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {stats?.currentStreak || 0}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                days
              </p>
            </div>

            {/* Total Sessions */}
            <div className="card card-interactive" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Sessions
              </h3>
              <p style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {stats?.sessionCount || 0}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                Avg {stats?.averageSessionLength || 0}m
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
            {/* Goals & Quick Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
              {/* Goals Section */}
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                  <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                    Active Goals
                  </h2>
                  <Link href="/chat">
                    <button className="btn btn-ghost btn-sm">
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Goal
                    </button>
                  </Link>
                </div>
                {stats?.activeGoals && stats.activeGoals.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {stats.activeGoals.map((goal) => {
                      const progress = Math.min((goal.currentHours / goal.targetHours) * 100, 100);
                      return (
                        <div key={goal.id} style={{
                          padding: 'var(--space-4)',
                          background: 'var(--color-surface)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-border)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                              {goal.type} Goal
                            </span>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                              {goal.currentHours.toFixed(1)}h / {goal.targetHours}h
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${progress}%`,
                              background: progress >= 100 ? 'var(--color-secondary)' : 'var(--color-primary)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width var(--transition-slow)'
                            }} />
                          </div>
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-4)'
                    }}>
                      <svg style={{ width: '32px', height: '32px', color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-base)' }}>
                      No active goals yet
                    </p>
                    <Link href="/chat">
                      <button className="btn btn-primary">
                        Set your first goal
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div style={{
                padding: 'var(--space-8)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d47a1 100%)',
                borderRadius: 'var(--radius-xl)',
                color: 'white',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-6)' }}>
                  Quick Actions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Link href="/chat">
                    <button style={{
                      width: '100%',
                      padding: 'var(--space-4)',
                      background: 'white',
                      color: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-base)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      🚀 Start Study Session
                    </button>
                  </Link>
                  <Link href="/chat">
                    <button style={{
                      width: '100%',
                      padding: 'var(--space-4)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-base)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                    >
                      📊 View Statistics
                    </button>
                  </Link>
                  <Link href="/chat">
                    <button style={{
                      width: '100%',
                      padding: 'var(--space-4)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-base)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                    >
                      🎯 Set New Goal
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                  Recent Sessions
                </h2>
              </div>
              {sessionsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: '80px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }} className="animate-pulse" />
                  ))}
                </div>
              ) : sessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-4)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-fast)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.background = 'var(--color-primary-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.background = 'var(--color-surface)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-lg)',
                          background: 'var(--color-primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg style={{ width: '24px', height: '24px', color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)' }}>
                            {session.courseName || session.notes || "Study Session"}
                          </h3>
                          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {format(new Date(session.startedAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                          {formatDuration(session.durationHours, session.durationMinutes)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-4)'
                  }}>
                    <svg style={{ width: '32px', height: '32px', color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-base)' }}>
                    No sessions yet
                  </p>
                  <Link href="/chat">
                    <button className="btn btn-primary">
                      Start your first session
                    </button>
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
