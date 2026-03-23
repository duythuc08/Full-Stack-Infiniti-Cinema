"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookingState, mergeBookingState } from "@/utils/bookingStorage";
import { fetchSeatShowTimes, fetchSeatPrices } from "@/libs/service/booking.service";
import type { SeatShowTime, SeatDetail } from "@/types";

const seatUIConfig: Record<string, { label: string; color: string; selectedColor: string }> = {
  STANDARD: { label: "Ghế đơn", color: "bg-zinc-600 hover:bg-zinc-500", selectedColor: "bg-primary" },
  VIP: { label: "VIP", color: "bg-yellow-700 hover:bg-yellow-600", selectedColor: "bg-primary" },
  COUPLE: { label: "Ghế đôi", color: "bg-pink-700 hover:bg-pink-600", selectedColor: "bg-primary" },
  DEFAULT: { label: "Ghế", color: "bg-zinc-500 hover:bg-zinc-400", selectedColor: "bg-primary" },
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
      } catch (error) {
        console.error("Lỗi:", error);
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
      const sortedSeats = grouped[row].sort((a, b) => a.seatNumber - b.seatNumber);

      for (let i = 0; i < sortedSeats.length - 1; i++) {
        const currentSeat = sortedSeats[i];
        const nextSeat = sortedSeats[i + 1];

        if (currentSeat.seatType === "COUPLE" && nextSeat.seatType === "COUPLE") {
          currentSeat.partnerId = nextSeat.seatId;
          nextSeat.partnerId = currentSeat.seatId;
          i++;
        }
      }
      grouped[row] = sortedSeats;
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
    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((id) => !seatsToToggle.includes(id)));
    } else {
      setSelectedSeats((prev) => [...prev, ...seatsToToggle]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(seatData)
      .flat()
      .forEach((seat) => {
        if (selectedSeats.includes(seat.seatId)) {
          total += seatPrices[seat.seatType] || 0;
        }
      });
    return total;
  };

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

    mergeBookingState({
      seats: selectedSeatDetails,
      seatTotal: calculateTotal(),
    });

    router.push(`/food-selection/${showTimeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-32 bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-6 w-24 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-xl" />
          </div>
          {/* Screen skeleton */}
          <Skeleton className="h-3 max-w-3xl mx-auto rounded-full" />
          {/* Seat grid skeleton */}
          <div className="space-y-3 w-fit mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-md" />
                <div className="flex gap-1.5">
                  {[...Array(10)].map((_, j) => (
                    <Skeleton key={j} className="w-8 h-8 rounded-t-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rows = Object.keys(seatData).sort();

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-32 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          Quay lại
        </button>

        <div className="mb-8">
          <h1 className="mb-1.5 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
            Chọn ghế của bạn
          </h1>
          <p className="text-muted-foreground">
            {bookingInfo.movie || "Tên phim"} • {bookingInfo.roomName || "Phòng chiếu"}
          </p>
        </div>

        {/* Screen indicator */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="h-2.5 bg-gradient-to-b from-white/60 to-transparent rounded-t-[100%] mb-2 shadow-[0_-4px_20px_rgba(255,255,255,0.15)]" />
            <p className="text-center text-xs text-muted-foreground tracking-[0.3em] uppercase font-medium">
              Màn hình
            </p>
          </div>
        </div>

        {/* Seat Map */}
        <div className="mb-10 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="space-y-2 mx-auto w-fit">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-8 text-center text-muted-foreground font-bold text-xs">{row}</span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {seatData[row].map((seat) => {
                      const isOccupied = isSeatOccupied(seat);
                      const isSelected = isSeatSelected(seat.seatId);
                      const uiInfo = seatUIConfig[seat.seatType] || seatUIConfig.DEFAULT;
                      const price = seatPrices[seat.seatType] || 0;
                      const isCouple = seat.seatType === "COUPLE";
                      const marginClass = isCouple ? "mx-0" : "mx-[1px] sm:mx-[1px]";

                      return (
                        <button
                          key={seat.seatId}
                          onClick={() => toggleSeat(seat)}
                          disabled={isOccupied}
                          className={`
                            ${marginClass} group cursor-pointer h-6 sm:h-8 rounded-t-lg transition-all duration-150 flex items-center justify-center text-[10px]
                            ${isCouple ? "w-8 sm:w-10 rounded-none first:rounded-l-lg last:rounded-r-lg" : "w-6 sm:w-8"}
                            ${
                              isOccupied
                                ? "bg-red-900/40 cursor-not-allowed opacity-50"
                                : isSelected
                                ? "bg-primary scale-110 z-10 ring-2 ring-primary/60 ring-offset-1 ring-offset-background shadow-[0_0_10px_2px] shadow-primary/50"
                                : uiInfo.color + " hover:scale-110 hover:z-10"
                            }
                            ${isCouple && !isOccupied && !isSelected ? "border-r border-black/20" : ""}
                          `}
                          title={`${seat.seatRow}${seat.seatNumber} – ${uiInfo.label} (${formatCurrency(price)})`}
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none text-white font-bold text-[9px]">
                            {seat.seatNumber}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-8 text-center text-muted-foreground font-bold text-xs">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 py-4 px-6 bg-secondary/30 rounded-2xl border border-border/50">
          {Object.entries(seatUIConfig).map(([type, config]) => {
            if (type === "DEFAULT") return null;
            const price = seatPrices[type] || 0;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-6 h-6 ${config.color.split(" ")[0]} rounded-t-lg flex-shrink-0`} />
                <span className="text-xs text-muted-foreground">
                  {config.label}
                  {price > 0 ? ` – ${formatCurrency(price)}` : ""}
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-t-lg flex-shrink-0 shadow-[0_0_8px_2px] shadow-primary/50" />
            <span className="text-xs text-muted-foreground">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-900/40 rounded-t-lg flex-shrink-0 opacity-60" />
            <span className="text-xs text-muted-foreground">Đã đặt</span>
          </div>
        </div>
      </div>

      {/* Bottom sticky bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Đã chọn {selectedSeats.length} ghế
              </p>
              <p className="text-sm font-medium text-foreground">
                {Object.values(seatData)
                  .flat()
                  .filter((s) => selectedSeats.includes(s.seatId))
                  .map((s) => `${s.seatRow}${s.seatNumber}`)
                  .join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tạm tính</p>
                <p className="text-2xl text-primary font-black">{formatCurrency(calculateTotal())}</p>
              </div>
              <Button
                className="cursor-pointer shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                size="lg"
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
