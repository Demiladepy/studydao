"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSend(message);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-background)',
      padding: 'var(--space-6) var(--space-8)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'var(--space-3)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            disabled={isLoading || disabled}
            rows={1}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              paddingRight: 'var(--space-12)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-elevated)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family)',
              lineHeight: 'var(--line-height-normal)',
              resize: 'none',
              overflow: 'hidden',
              outline: 'none',
              transition: 'all var(--transition-fast)',
              minHeight: '52px',
              maxHeight: '160px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* Character hint */}
          {input.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: 'var(--space-2)',
              right: 'var(--space-3)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-tertiary)',
              pointerEvents: 'none'
            }}>
              {input.length}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || disabled}
          style={{
            padding: 'var(--space-4)',
            background: !input.trim() || isLoading || disabled
              ? 'var(--color-surface)'
              : 'var(--color-primary)',
            color: !input.trim() || isLoading || disabled
              ? 'var(--color-text-disabled)'
              : 'white',
            border: 'none',
            borderRadius: 'var(--radius-xl)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: !input.trim() || isLoading || disabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '52px',
            height: '52px',
            boxShadow: !input.trim() || isLoading || disabled ? 'none' : 'var(--shadow-md)',
            opacity: !input.trim() || isLoading || disabled ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!(!input.trim() || isLoading || disabled)) {
              e.currentTarget.style.background = 'var(--color-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!input.trim() || isLoading || disabled)) {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }
          }}
        >
          {isLoading ? (
            <svg
              style={{ width: '20px', height: '20px' }}
              className="animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                style={{ opacity: 0.25 }}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                style={{ opacity: 0.75 }}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              style={{ width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Quick suggestions when empty */}
      {input.length === 0 && (
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-3)',
          maxWidth: '900px',
          margin: 'var(--space-3) auto 0',
          flexWrap: 'wrap'
        }}>
          {['Start studying', 'Show my progress', 'Set a goal'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontWeight: 'var(--font-weight-medium)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-light)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-surface)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
