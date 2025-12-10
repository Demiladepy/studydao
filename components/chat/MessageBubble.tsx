"use client";

import { Message } from "@/lib/hooks/useChat";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        marginBottom: 'var(--space-6)',
        justifyContent: isUser ? 'flex-end' : 'flex-start'
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '75%',
          alignItems: isUser ? 'flex-end' : 'flex-start'
        }}
      >
        {/* Avatar & Name */}
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
            paddingLeft: 'var(--space-2)'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg style={{ width: '14px', height: '14px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-secondary)'
            }}>
              Study Agent
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          style={{
            borderRadius: isUser ? 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)' : 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)',
            padding: 'var(--space-4) var(--space-5)',
            background: isUser
              ? 'var(--color-primary)'
              : 'var(--color-surface)',
            color: isUser
              ? 'white'
              : 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-sm)',
            border: isUser ? 'none' : '1px solid var(--color-border)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <p style={{
            fontSize: 'var(--font-size-base)',
            lineHeight: 'var(--line-height-relaxed)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0
          }}>
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--space-1)',
            paddingLeft: isUser ? 0 : 'var(--space-2)',
            paddingRight: isUser ? 'var(--space-2)' : 0
          }}
        >
          {format(message.timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
}
