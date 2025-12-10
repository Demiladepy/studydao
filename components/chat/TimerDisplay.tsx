"use client";

import { useEffect, useState } from "react";
import { ActiveSession } from "@/lib/types/api";

interface TimerDisplayProps {
  activeSession: ActiveSession | null;
}

export function TimerDisplay({ activeSession }: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }

    const startTime = new Date(activeSession.startedAt).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000); // seconds
      setElapsed(diff);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  if (!activeSession) {
    return null;
  }

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-secondary) 0%, #059669 100%)',
      color: 'white',
      padding: 'var(--space-5) var(--space-6)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      marginBottom: 'var(--space-6)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Pulsing icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <p style={{
              fontSize: 'var(--font-size-xs)',
              opacity: 0.9,
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Active Session
            </p>
            <p style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}>
              {hours > 0 ? `${formatTime(hours)}:` : ""}
              {formatTime(minutes)}:{formatTime(seconds)}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {activeSession.courseName && (
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              📚 {activeSession.courseName}
            </div>
          )}
          {activeSession.notes && !activeSession.courseName && (
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {activeSession.notes}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
