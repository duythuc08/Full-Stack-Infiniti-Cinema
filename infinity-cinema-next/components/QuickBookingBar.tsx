"use client";

import { ChevronDown, Ticket, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuickBooking } from "@/hooks/use-quick-booking";
import { saveBookingState } from "@/utils/bookingStorage";

export function QuickBookingBar() {
  const router = useRouter();

  const {
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
    canBook,
  } = useQuickBooking();

  const handleBuyTicket = () => {
    if (!canBook || !selectedSlot || !selectedMovie || !selectedCinema || !selectedDate) return;
    saveBookingState({
      movie: selectedMovie.title,
      movieDuration: selectedMovie.durationText,
      moviePoster: selectedMovie.poster,
      cinema: selectedCinema.name,
      location: selectedCinema.address,
      time: selectedSlot.startTime,
      showTimeId: selectedSlot.showTimeId,
      date: selectedDate,
      roomName: selectedSlot.roomName,
    });
    router.push(`/seat-selection/${selectedMovie.id}`);
  };

  return (
    <div className="w-full border-t-[3px] border-t-primary bg-card shadow-md dark:shadow-[0_4px_24px_0_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

        {/* ── Mobile: title inline ─────────────────────── */}
        <div className="flex items-center gap-2 mb-3 lg:hidden">
          <Zap className="w-4 h-4 text-primary fill-primary shrink-0" />
          <span className="text-sm font-black tracking-widest text-primary uppercase">
            Đặt Vé Nhanh
          </span>
        </div>

        {/* ── Desktop: full layout ngang ───────────────── */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">

          {/*
           * Title block — cấu trúc giống hệt SelectField để align đúng:
           *   row 1 (h≈16px) = label row "Quick Booking"
           *   gap-1.5
           *   row 2 (h-11=44px) = "ĐẶT VÉ NHANH" trong khung h-11
           */}
          <div className="hidden lg:flex flex-col gap-1.5 shrink-0">
            {/* Label row — cùng height với label của SelectField */}
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-none">
                Quick Booking
              </span>
            </div>
            {/* Select row — h-11 giống select element */}
            <div className="h-11 flex items-center border-l-2 border-primary pl-3">
              <span className="text-[15px] font-black tracking-widest text-primary uppercase whitespace-nowrap leading-none">
                ĐẶT VÉ NHANH
              </span>
            </div>
          </div>

          {/* Divider dọc */}
          <div className="hidden lg:block w-px self-stretch bg-border shrink-0" />

          {/* Bước 1 — Chọn Phim */}
          <SelectField
            label="Chọn Phim"
            value={selectedMovie?.id.toString() ?? ""}
            onChange={handleMovieChange}
            disabled={loadingMovies}
            loading={loadingMovies}
            placeholder={loadingMovies ? "Đang tải phim..." : "-- Chọn phim --"}
          >
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </SelectField>

          {/* Bước 2 — Chọn Rạp */}
          <SelectField
            label="Chọn Rạp"
            value={selectedCinema?.id.toString() ?? ""}
            onChange={handleCinemaChange}
            disabled={!selectedMovie || loadingCinemas}
            loading={loadingCinemas}
            placeholder={loadingCinemas ? "Đang tải rạp..." : "-- Chọn rạp --"}
          >
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>

          {/* Bước 3 — Chọn Ngày */}
          <SelectField
            label="Chọn Ngày"
            value={selectedDate ?? ""}
            onChange={handleDateChange}
            disabled={!selectedCinema || loadingDates}
            loading={loadingDates}
            placeholder={loadingDates ? "Đang tải ngày..." : "-- Chọn ngày --"}
          >
            {dates.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </SelectField>

          {/* Bước 4 — Chọn Suất */}
          <SelectField
            label="Chọn Suất"
            value={selectedSlot?.showTimeId.toString() ?? ""}
            onChange={handleSlotChange}
            disabled={!selectedDate || loadingSlots}
            loading={loadingSlots}
            placeholder={loadingSlots ? "Đang tải suất..." : "-- Chọn suất --"}
          >
            {slots.map((s) => (
              <option key={s.showTimeId} value={s.showTimeId}>
                {s.startTime} — {s.roomName}
              </option>
            ))}
          </SelectField>

          {/* Button Mua Vé — cùng gap-1.5 + h-11 structure */}
          <div className="hidden lg:flex flex-col gap-1.5 shrink-0">
            {/* Spacer = label row height */}
            <span className="text-xs leading-none text-transparent select-none" aria-hidden>‎</span>
            <Button
              onClick={handleBuyTicket}
              disabled={!canBook}
              className="h-11 px-7 text-sm font-bold whitespace-nowrap gap-2
                shadow-lg shadow-primary/30 hover:shadow-primary/50
                hover:-translate-y-0.5 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:shadow-none disabled:translate-y-0 cursor-pointer"
            >
              <Ticket className="w-4 h-4 shrink-0" />
              Mua Vé Ngay
            </Button>
          </div>

          {/* Button Mobile (full-width) */}
          <Button
            onClick={handleBuyTicket}
            disabled={!canBook}
            className="lg:hidden h-11 w-full text-sm font-bold gap-2 mt-1
              shadow-lg shadow-primary/30"
          >
            <Ticket className="w-4 h-4 shrink-0" />
            Mua Vé Ngay
          </Button>

        </div>
      </div>
    </div>
  );
}

// ─── SelectField sub-component ──────────────────────────────

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  loading: boolean;
  placeholder: string;
  children: React.ReactNode;
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  loading,
  placeholder,
  children,
}: SelectFieldProps) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-none">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="
            w-full h-11 rounded-lg
            border border-border bg-card text-foreground
            text-sm px-3 pr-9
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent
            hover:border-primary/50
            disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted/30
            transition-colors duration-150
          "
        >
          <option value="">{loading ? "Đang tải..." : placeholder}</option>
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden
        />
      </div>
    </div>
  );
}
