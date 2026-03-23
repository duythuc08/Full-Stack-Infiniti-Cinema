import type { BookingState } from "@/types";

const KEY = "infinityCinema_bookingState";

export function saveBookingState(state: BookingState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function getBookingState(): BookingState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingState;
  } catch {
    return null;
  }
}

export function clearBookingState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function mergeBookingState(partial: Partial<BookingState>): BookingState {
  const existing = getBookingState() ?? {};
  const merged = { ...existing, ...partial };
  saveBookingState(merged);
  return merged;
}
