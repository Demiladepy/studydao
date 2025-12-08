"use client";

export function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col max-w-[80%] sm:max-w-[70%] md:max-w-[60%] items-start">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              StudyBot is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

