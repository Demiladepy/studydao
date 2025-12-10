"use client";

export function LoadingIndicator() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 'var(--space-6)'
    }} className="animate-fade-in">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '75%',
        alignItems: 'flex-start'
      }}>
        {/* Avatar & Name */}
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

        {/* Loading Bubble */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)',
          padding: 'var(--space-4) var(--space-5)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Animated dots */}
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '-0.32s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '-0.16s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both'
              }}></div>
            </div>
            <span style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Thinking...
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
