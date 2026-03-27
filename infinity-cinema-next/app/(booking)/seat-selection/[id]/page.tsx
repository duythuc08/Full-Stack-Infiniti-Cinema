"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookingState, mergeBookingState } from "@/utils/bookingStorage";
import { fetchSeatShowTimes, fetchSeatPrices } from "@/libs/service/booking.service";
import type { SeatShowTime, SeatDetail } from "@/types";

// ─── Cấu hình màu ghế ────────────────────────────────────────────────────────
// Màu chuẩn TMDT/booking: tương phản rõ trên cả dark & light theme.
// - light: màu pastel sáng → dễ nhìn, không gây mỏi mắt
// - dark : màu đậm hơn 1 bậc, giữ đủ contrast với nền tối
const SEAT_STYLES: Record<
  string,
  { label: string; idle: string; legend: string }
> = {
  STANDARD: {
    label: "Ghế thường",
    idle: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 border border-slate-300 dark:border-slate-500",
    legend: "bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-500",
  },
  VIP: {
    label: "Ghế VIP",
    idle: "bg-amber-200 hover:bg-amber-300 dark:bg-amber-700 dark:hover:bg-amber-600 border border-amber-300 dark:border-amber-600",
    legend: "bg-amber-200 dark:bg-amber-700 border border-amber-300 dark:border-amber-600",
  },
  COUPLE: {
    label: "Ghế đôi",
    idle: "bg-rose-200 hover:bg-rose-300 dark:bg-rose-800 dark:hover:bg-rose-700 border border-rose-300 dark:border-rose-700",
    legend: "bg-rose-200 dark:bg-rose-800 border border-rose-300 dark:border-rose-700",
  },
  DEFAULT: {
    label: "Ghế",
    idle: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 border border-slate-300 dark:border-slate-500",
    legend: "bg-slate-200 dark:bg-slate-600",
  },
};


export default function SeatSelectionPage() {
  const router = useRouter();
  const { id: showTimeIdParam } = useParams<{ id: string }>();
  const showTimeId = Number(showTimeIdParam) || 1;

  const bookingInfo = getBookingState() ?? {};

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatData, setSeatData] = useState<Record<string, SeatShowTime[]>>({});
  const [seatPrices, setSeatPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const seatLabel = (row: string, num: number) =>
    `${row}${String(num).padStart(2, "0")}`;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để tiếp tục đặt vé.");
        router.push(`/login?from=/seat-selection/${showTimeId}`);
        return;
      }
      try {
        const [seats, prices] = await Promise.all([
          fetchSeatShowTimes(showTimeId, token),
          fetchSeatPrices(showTimeId, token),
        ]);
        processSeatData(seats);
        setSeatPrices(prices);
      } catch {
        toast.error("Không thể tải thông tin ghế. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showTimeId, router]);

  const processSeatData = (data: SeatShowTime[]) => {
    const grouped = data.reduce<Record<string, SeatShowTime[]>>((acc, seat) => {
      const row = seat.seatRow;
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});

    Object.keys(grouped).forEach((row) => {
      const sorted = grouped[row].sort((a, b) => a.seatNumber - b.seatNumber);
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].seatType === "COUPLE" && sorted[i + 1].seatType === "COUPLE") {
          sorted[i].partnerId = sorted[i + 1].seatId;
          sorted[i + 1].partnerId = sorted[i].seatId;
          i++;
        }
      }
      grouped[row] = sorted;
    });

    setSeatData(grouped);
  };

  const isSeatOccupied = (seat: SeatShowTime) => seat.seatShowTimeStatus !== "AVAILABLE";
  const isSeatSelected = (seatId: number) => selectedSeats.includes(seatId);

  const toggleSeat = (seat: SeatShowTime) => {
    if (isSeatOccupied(seat)) return;
    const seatsToToggle = [seat.seatId];
    if (seat.partnerId) {
      const partner = Object.values(seatData).flat().find((s) => s.seatId === seat.partnerId);
      if (partner && isSeatOccupied(partner)) {
        toast.error("Ghế đôi này không còn khả dụng. Vui lòng chọn ghế khác.");
        return;
      }
      seatsToToggle.push(seat.partnerId);
    }
    const isSelected = isSeatSelected(seat.seatId);
    setSelectedSeats((prev) =>
      isSelected
        ? prev.filter((id) => !seatsToToggle.includes(id))
        : [...prev, ...seatsToToggle]
    );
  };

  const calculateTotal = () =>
    Object.values(seatData)
      .flat()
      .filter((s) => selectedSeats.includes(s.seatId))
      .reduce((sum, s) => sum + (seatPrices[s.seatType] || 0), 0);

  const handleGoToFoods = () => {
    if (selectedSeats.length === 0) return;
    const selectedSeatDetails: SeatDetail[] = Object.values(seatData)
      .flat()
      .filter((s) => selectedSeats.includes(s.seatId))
      .map((seat) => ({
        seatId: seat.seatId,
        seatRow: seat.seatRow,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seatPrices[seat.seatType] || 0,
        seatShowTimeId: seat.seatShowTimeId,
        partnerId: seat.partnerId,
        seatShowTimeStatus: seat.seatShowTimeStatus,
      }));
    mergeBookingState({ seats: selectedSeatDetails, seatTotal: calculateTotal() });
    router.push(`/food-selection/${showTimeId}`);
  };

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 pb-32 bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 rounded-xl" />
            <Skeleton className="h-4 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-3 max-w-2xl mx-auto rounded-full" />
          <div className="space-y-2.5 w-fit mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded" />
                <div className="flex gap-1.5">
                  {[...Array(10)].map((_, j) => (
                    <Skeleton key={j} className="w-11 h-11 rounded-t-lg" />
                  ))}
                </div>
                <Skeleton className="w-7 h-7 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rows = Object.keys(seatData).sort();

  return (
    <div className="min-h-screen pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 pb-36 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold text-foreground">Chọn ghế của bạn</h1>
          <p className="text-sm text-muted-foreground">
            {bookingInfo.movie || "Tên phim"} • {bookingInfo.roomName || "Phòng chiếu"}
          </p>
        </div>

        {/* Screen */}
        <div className="mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative h-3 rounded-t-[50%] overflow-hidden bg-gradient-to-b from-foreground/20 dark:from-white/40 to-transparent shadow-[0_-6px_18px_rgba(0,0,0,0.1)] dark:shadow-[0_-6px_18px_rgba(255,255,255,0.12)]" />
            <p className="text-center text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-1.5 font-medium">
              Màn hình
            </p>
          </div>
        </div>

        {/* Seat map
            overflow-x-auto chỉ bao ngoài cùng.
            Không dùng hover:scale → tránh lỗi scroll cursor khi hover ghế.
            Thay bằng hover:-translate-y-1 (chỉ dịch trục Y, không gây overflow ngang).
        */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="w-fit mx-auto">
            <div className="flex flex-col gap-1.5">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-1.5 sm:gap-2">
                  {/* Row label */}
                  <span className="w-7 text-center text-xs font-bold text-muted-foreground flex-shrink-0 select-none">
                    {row}
                  </span>

                  {/* Seats */}
                  <div className="flex gap-1 sm:gap-1.5">
                    {seatData[row].map((seat) => {
                      const occupied = isSeatOccupied(seat);
                      const selected = isSeatSelected(seat.seatId);
                      const style = SEAT_STYLES[seat.seatType] ?? SEAT_STYLES.DEFAULT;
                      const price = seatPrices[seat.seatType] || 0;
                      const isCouple = seat.seatType === "COUPLE";
                      const label = seatLabel(seat.seatRow, seat.seatNumber);

                      let seatClass = "";
                      if (occupied) {
                        // Ghế đã đặt: nền kẻ chéo, opacity thấp, rõ ràng không thể chọn
                        seatClass =
                          "bg-slate-300/60 dark:bg-slate-700/50 border border-dashed border-slate-400/60 dark:border-slate-600/60 cursor-not-allowed opacity-60";
                      } else if (selected) {
                        seatClass =
                          "bg-primary border-2 border-primary/80 -translate-y-1 z-10 shadow-lg shadow-primary/40 cursor-pointer";
                      } else {
                        seatClass = `${style.idle} cursor-pointer hover:-translate-y-1 hover:shadow-md hover:z-10`;
                      }

                      return (
                        <button
                          key={seat.seatId}
                          type="button"
                          onClick={() => toggleSeat(seat)}
                          disabled={occupied}
                          title={`${label} – ${style.label}${price > 0 ? ` (${formatCurrency(price)})` : ""}`}
                          className={[
                            // Base size — to hơn để hiển thị label rõ
                            "relative flex flex-col items-center justify-center rounded-t-lg transition-all duration-150 select-none",
                            isCouple ? "w-11 sm:w-12 h-11 sm:h-12" : "w-10 sm:w-11 h-10 sm:h-11",
                            seatClass,
                            // Ghế đôi: bo góc trái/phải tuỳ vị trí
                            isCouple ? "rounded-none first:rounded-tl-lg last:rounded-tr-lg" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {/* Tên ghế — luôn hiển thị */}
                          <span
                            className={
                              occupied
                                ? "text-[9px] sm:text-[10px] font-bold leading-none tracking-tight text-muted-foreground/60"
                                : selected
                                ? "text-[9px] sm:text-[10px] font-bold leading-none tracking-tight text-primary-foreground"
                                : "text-[9px] sm:text-[10px] font-bold leading-none tracking-tight text-[#663399] dark:text-violet-200"
                            }
                          >
                            {label}
                          </span>

                          {/* Icon ghế đôi */}
                          {isCouple && !occupied && (
                            <span
                              className={
                                selected
                                  ? "text-[7px] leading-none mt-0.5 opacity-70 text-primary-foreground"
                                  : "text-[7px] leading-none mt-0.5 opacity-60 text-[#663399] dark:text-violet-500"
                              }
                            >
                              ♥
                            </span>
                          )}

                          {/* Icon ghế đã đặt */}
                          {occupied && (
                            <span className="text-[8px] leading-none mt-0.5 text-muted-foreground/50">
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row label (right) */}
                  <span className="w-7 text-center text-xs font-bold text-muted-foreground flex-shrink-0 select-none">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 py-4 px-5 bg-muted/40 rounded-2xl border border-border mb-6">
          {Object.entries(SEAT_STYLES)
            .filter(([type]) => type !== "DEFAULT")
            .map(([type, cfg]) => {
              const price = seatPrices[type] || 0;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-t-lg flex-shrink-0 ${cfg.legend}`} />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {cfg.label}
                    {price > 0 && (
                      <span className="ml-1 font-medium text-foreground">
                        {formatCurrency(price)}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}

          {/* Selected */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-primary shadow-[0_0_8px_2px] shadow-primary/40 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Đang chọn</span>
          </div>

          {/* Occupied */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-slate-300/60 dark:bg-slate-700/50 border border-dashed border-slate-400/60 dark:border-slate-600/60 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] text-muted-foreground/60">✕</span>
            </div>
            <span className="text-xs text-muted-foreground">Đã đặt</span>
          </div>
        </div>
      </div>

      {/* Bottom sticky bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                Đã chọn <span className="font-semibold text-foreground">{selectedSeats.length}</span> ghế
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {Object.values(seatData)
                  .flat()
                  .filter((s) => selectedSeats.includes(s.seatId))
                  .map((s) => seatLabel(s.seatRow, s.seatNumber))
                  .join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tạm tính</p>
                <p className="text-xl sm:text-2xl text-primary font-black tabular-nums">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
              <Button
                size="lg"
                className="cursor-pointer shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold"
                onClick={handleGoToFoods}
              >
                Tiếp tục →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
