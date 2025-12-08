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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Stats Sidebar - Hidden on mobile, visible on sm+ */}
      <div className="hidden sm:block">
        <StatsSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  StudyDAO Agent
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your study accountability companion
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Settings"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Timer Display */}
        {activeSession && (
          <div className="px-4 pt-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <TimerDisplay activeSession={activeSession} />
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to StudyDAO Agent!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  I'm here to help you track your study sessions, set goals, and stay
                  motivated. Try saying:
                </p>
                <div className="space-y-2 text-left max-w-md">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💬 <span className="font-medium">"start studying math"</span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📊 <span className="font-medium">"show my progress"</span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🎯 <span className="font-medium">"I want to study 3 hours today"</span>
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

      {/* Mobile Stats - Bottom Sheet */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <StatsSidebar />
      </div>
    </div>
  );
}

