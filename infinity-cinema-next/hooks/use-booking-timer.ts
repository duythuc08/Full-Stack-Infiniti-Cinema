"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TIMER_KEY = "infinityCinema_seatHoldEndTime";
const HOLD_DURATION_S = 10 * 60; // 10 phút giữ ghế

function getOrCreateEndTime(): number {
  const stored = sessionStorage.getItem(TIMER_KEY);
  if (stored) {
    const endTime = parseInt(stored, 10);
    if (!isNaN(endTime) && endTime > Date.now()) return endTime;
  }
  const newEndTime = Date.now() + HOLD_DURATION_S * 1000;
  sessionStorage.setItem(TIMER_KEY, String(newEndTime));
  return newEndTime;
}

export function useBookingTimer() {
  const router = useRouter();
  const endTimeRef = useRef<number>(0);
  const hasWarnedRef = useRef(false);

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window === "undefined") return HOLD_DURATION_S;
    const endTime = getOrCreateEndTime();
    endTimeRef.current = endTime;
    return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  });

  useEffect(() => {
    if (endTimeRef.current === 0) {
      endTimeRef.current = getOrCreateEndTime();
    }

    const intervalRef = { current: 0 as ReturnType<typeof setInterval> };

    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 60 && !hasWarnedRef.current) {
        hasWarnedRef.current = true;
        toast.warning("Còn 1 phút để hoàn tất đặt vé!", { duration: 3000 });
      }

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        sessionStorage.removeItem(TIMER_KEY);
        toast.error("Hết thời gian giữ ghế! Vui lòng đặt vé lại.", { duration: 5000 });
        router.push("/");
      }
    };

    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [router]);

  const clearTimer = () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(TIMER_KEY);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = (timeLeft / HOLD_DURATION_S) * 100;
  const isUrgent = timeLeft <= 60;

  return { timeLeft, minutes, seconds, progress, isUrgent, clearTimer };
}
