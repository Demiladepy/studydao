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
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg mb-4 animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl animate-pulse">⏱️</div>
          <div>
            <p className="text-sm opacity-90">Active Session</p>
            <p className="text-xl font-bold font-mono">
              {hours > 0 ? `${formatTime(hours)}:` : ""}
              {formatTime(minutes)}:{formatTime(seconds)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {activeSession.courseName && (
            <p className="text-sm opacity-90">{activeSession.courseName}</p>
          )}
          {activeSession.notes && !activeSession.courseName && (
            <p className="text-sm opacity-90 truncate max-w-[120px]">
              {activeSession.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

