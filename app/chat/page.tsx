"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { StatsSidebar } from "@/components/chat/StatsSidebar";
import { TimerDisplay } from "@/components/chat/TimerDisplay";
import { LoadingIndicator } from "@/components/chat/LoadingIndicator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatPage() {
  const { messages, isLoading, activeSession, sendMessage } = useChat();
  const { data: session, status } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
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
            Loading chat...
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

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-surface)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'var(--color-background)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column'
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
        <nav style={{ padding: '0 var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            </Link>

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
              width: '100%',
              textAlign: 'left'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat Agent
            </button>
          </div>
        </nav>

        {/* Stats Sidebar */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6) var(--space-4)', marginTop: 'var(--space-6)' }}>
          <StatsSidebar />
        </div>
      </aside>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-background)' }}>
        {/* Header */}
        <header style={{
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-6) var(--space-8)',
          background: 'var(--color-background)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d47a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Study Agent
                </h1>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Your AI study companion
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Timer Display */}
        {activeSession && (
          <div style={{ padding: '0 var(--space-8)', paddingTop: 'var(--space-6)' }}>
            <TimerDisplay activeSession={activeSession} />
          </div>
        )}

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--space-16) var(--space-6)',
                minHeight: '60vh'
              }} className="animate-fade-in">
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-8)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '-0.01em'
                }}>
                  Welcome to Study Agent
                </h2>
                <p style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '500px',
                  marginBottom: 'var(--space-10)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  I can help you track study sessions, set goals, and stay motivated on your learning journey.
                </p>

                {/* Suggestion Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'var(--space-4)',
                  width: '100%',
                  maxWidth: '900px'
                }}>
                  <div className="card card-interactive" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                    }}>
                      <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>
                      Start Studying
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                      "start studying math"
                    </p>
                  </div>

                  <div className="card card-interactive" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                    }}>
                      <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>
                      View Progress
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                      "show my progress"
                    </p>
                  </div>

                  <div className="card card-interactive" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}>
                      <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>
                      Set Goals
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                      "I want to study 3 hours today"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
