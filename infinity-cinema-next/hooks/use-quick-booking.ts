"use client";

import { useState, useCallback, useEffect } from "react";
import type { BookingDate, Cinema, Movie, QuickBookingSlot } from "@/types";
import {
  fetchNowShowingMovies,
  fetchCinemasByMovieId,
  fetchDatesByCinemaAndMovie,
  fetchSlotsByCinemaMovieDate,
} from "@/libs/service/quick-booking.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

/** Sinh 6 ngày liên tiếp từ hôm nay dạng "YYYY-MM-DD" */
function get6DayWindow(): string[] {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });
}

/** Format nhãn ngày: "Hôm nay (27/03)" hoặc "Thứ 7 (28/03)" */
function buildDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return d.getTime() === today.getTime()
    ? `Hôm nay (${dd}/${mm})`
    : `${WEEKDAY_LABELS[d.getDay()]} (${dd}/${mm})`;
}

/** Lấy chuỗi ngày hôm nay dạng "YYYY-MM-DD" */
function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useQuickBooking() {
  // ── Data lists
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [dates, setDates] = useState<BookingDate[]>([]);
  const [slots, setSlots] = useState<QuickBookingSlot[]>([]);

  // ── Selections
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<QuickBookingSlot | null>(null);

  // ── Loading states
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Bước 0: load phim NOW_SHOWING khi mount
  useEffect(() => {
    setLoadingMovies(true);
    fetchNowShowingMovies()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoadingMovies(false));
  }, []);

  // Bước 1: Chọn Phim → reset downstream, load rạp
  const handleMovieChange = useCallback(
    async (movieId: string) => {
      const movie = movies.find((m) => m.id.toString() === movieId) ?? null;
      setSelectedMovie(movie);
      setSelectedCinema(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setCinemas([]);
      setDates([]);
      setSlots([]);
      if (!movie) return;
      setLoadingCinemas(true);
      try {
        const data = await fetchCinemasByMovieId(movie.id);
        setCinemas(data);
      } finally {
        setLoadingCinemas(false);
      }
    },
    [movies]
  );

  // Bước 2: Chọn Rạp → reset downstream, load ngày (6-day window)
  const handleCinemaChange = useCallback(
    async (cinemaId: string) => {
      const cinema = cinemas.find((c) => c.id.toString() === cinemaId) ?? null;
      setSelectedCinema(cinema);
      setSelectedDate(null);
      setSelectedSlot(null);
      setDates([]);
      setSlots([]);
      if (!cinema || !selectedMovie) return;
      setLoadingDates(true);
      try {
        const rawDates = await fetchDatesByCinemaAndMovie(cinema.id, selectedMovie.id);
        const window6 = new Set(get6DayWindow());
        const bookingDates: BookingDate[] = rawDates
          .filter((d) => window6.has(d))
          .map((d) => ({ value: d, label: buildDateLabel(d) }));
        setDates(bookingDates);
      } finally {
        setLoadingDates(false);
      }
    },
    [cinemas, selectedMovie]
  );

  // Bước 3: Chọn Ngày → reset downstream, load suất (lọc suất quá giờ nếu là hôm nay)
  const handleDateChange = useCallback(
    async (dateValue: string) => {
      setSelectedDate(dateValue || null);
      setSelectedSlot(null);
      setSlots([]);
      if (!dateValue || !selectedCinema || !selectedMovie) return;
      setLoadingSlots(true);
      try {
        const data = await fetchSlotsByCinemaMovieDate(
          selectedCinema.id,
          selectedMovie.id,
          dateValue
        );
        // Lọc client-side bổ sung: loại suất đã qua nếu ngày = hôm nay
        const today = todayStr();
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const filtered =
          dateValue === today
            ? data.filter((s) => {
                const [h, min] = s.startTime.split(":").map(Number);
                return h * 60 + min > nowMinutes;
              })
            : data;
        setSlots(filtered);
      } finally {
        setLoadingSlots(false);
      }
    },
    [selectedCinema, selectedMovie]
  );

  // Bước 4: Chọn Suất
  const handleSlotChange = useCallback(
    (slotId: string) => {
      const slot = slots.find((s) => s.showTimeId.toString() === slotId) ?? null;
      setSelectedSlot(slot);
    },
    [slots]
  );

  return {
    movies,
    cinemas,
    dates,
    slots,
    selectedMovie,
    selectedCinema,
    selectedDate,
    selectedSlot,
    loadingMovies,
    loadingCinemas,
    loadingDates,
    loadingSlots,
    handleMovieChange,
    handleCinemaChange,
    handleDateChange,
    handleSlotChange,
    canBook: !!(selectedMovie && selectedCinema && selectedDate && selectedSlot),
  };
}
