import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  durationMinutes: number;
  onComplete?: () => void;
}

const STORAGE_KEY = "focus-timer-state";

export function useTimer({ durationMinutes, onComplete }: UseTimerOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- LOAD STATE ---------------- */

  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return {
        initialDuration: durationMinutes * 60,
        secondsLeft: durationMinutes * 60,
        isRunning: false,
        lastUpdated: Date.now(),
      };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seconds = durationMinutes * 60;
      return {
        initialDuration: seconds,
        secondsLeft: seconds,
        isRunning: false,
        lastUpdated: Date.now(),
      };
    }

    try {
      const saved = JSON.parse(raw);
      const elapsed = Math.floor(
        (Date.now() - saved.lastUpdated) / 1000
      );

      const secondsLeft = saved.isRunning
        ? Math.max(saved.secondsLeft - elapsed, 0)
        : saved.secondsLeft;

      return {
        initialDuration: saved.initialDuration,
        secondsLeft,
        isRunning: saved.isRunning,
        lastUpdated: Date.now(),
      };
    } catch {
      const seconds = durationMinutes * 60;
      return {
        initialDuration: seconds,
        secondsLeft: seconds,
        isRunning: false,
        lastUpdated: Date.now(),
      };
    }
  });

  const { secondsLeft, isRunning, initialDuration } = state;

  /* ---------------- TICK ---------------- */

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsLeft <= 1) {
          clearInterval(intervalRef.current!);
          onComplete?.();
          return {
            ...prev,
            secondsLeft: 0,
            isRunning: false,
          };
        }

        return {
          ...prev,
          secondsLeft: prev.secondsLeft - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onComplete]);

  /* ---------------- PERSIST ---------------- */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        initialDuration,
        secondsLeft,
        isRunning,
        lastUpdated: Date.now(),
      })
    );
  }, [initialDuration, secondsLeft, isRunning]);

  /* ---------------- ACTIONS ---------------- */

  const start = useCallback(() => {
    setState((s) => ({ ...s, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState((s) => ({ ...s, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    const seconds = durationMinutes * 60;
    setState({
      initialDuration: seconds,
      secondsLeft: seconds,
      isRunning: false,
      lastUpdated: Date.now(),
    });
  }, [durationMinutes]);

  /* ---------------- DERIVED ---------------- */

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    minutes,
    seconds,
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
  };
}
