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
      className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col max-w-[80%] sm:max-w-[70%] md:max-w-[60%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          }`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span
          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {format(message.timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
}

