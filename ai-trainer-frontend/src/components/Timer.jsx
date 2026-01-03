import React, { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, onComplete, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((duration - timeLeft) / duration) * 100;

  useEffect(() => {
    // Reset when duration changes
    setTimeLeft(duration);
    setIsPaused(false);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);

          // Play sound when timer ends
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              // Audio might fail on some browsers without user interaction
            });
          }

          // Call completion callback after a short delay for alert to show
          setTimeout(() => {
            onComplete?.();
          }, 100);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, timeLeft, onComplete]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const skip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(0);
    onComplete?.();
  };

  return (
    <div className="timer-container">
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,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" type="audio/wav" />
      </audio>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              REST TIME
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: 'var(--card-border)' }}
          >
            <div
              className="h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progress}%`,
                background: timeLeft <= 10
                  ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.9))'
                  : 'linear-gradient(90deg, rgba(120, 120, 125, 0.6), rgba(160, 160, 165, 0.8))'
              }}
            />
          </div>

          {/* Time display */}
          <div className="mt-3 flex items-center justify-center">
            <span
              className="text-4xl font-bold tabular-nums"
              style={{
                color: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.9)' : 'var(--text-primary)',
                letterSpacing: '0.05em'
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={togglePause}
            className="pill flex h-10 w-10 items-center justify-center p-0"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
            )}
          </button>

          <button
            onClick={skip}
            className="pill flex h-10 w-10 items-center justify-center p-0"
            title="Skip rest"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l7-5a1 1 0 000-1.664l-7-5zM15 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
