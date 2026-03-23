"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBookingState, mergeBookingState } from "@/utils/bookingStorage";
import { fetchSeatShowTimes, fetchSeatPrices } from "@/libs/service/booking.service";
import type { SeatShowTime, SeatDetail } from "@/types";

const seatUIConfig: Record<string, { label: string; color: string }> = {
  STANDARD: { label: "Ghế đơn", color: "bg-gray-600" },
  VIP: { label: "VIP", color: "bg-yellow-600" },
  COUPLE: { label: "Ghế đôi", color: "bg-pink-500" },
  DEFAULT: { label: "Ghế", color: "bg-gray-400" },
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
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Đang tải sơ đồ ghế...</p>
      </div>
    );
  }

  const rows = Object.keys(seatData).sort();

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-32 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại
        </button>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold">Chọn ghế của bạn</h1>
          <p className="text-muted-foreground">
            {bookingInfo.movie || "Tên phim"} • {bookingInfo.roomName || "Phòng chiếu"}
          </p>
        </div>

        {/* Screen */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="h-2 bg-gradient-to-b from-white/50 to-transparent rounded-t-[100%] mb-4" />
            <p className="text-center text-sm text-muted-foreground tracking-widest uppercase">Màn hình</p>
          </div>
        </div>

        {/* Seat Map */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="space-y-2 mx-auto w-fit">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-8 text-center text-muted-foreground font-bold text-sm">{row}</span>
                  <div className="flex gap-1 sm:gap-2">
                    {seatData[row].map((seat) => {
                      const isOccupied = isSeatOccupied(seat);
                      const isSelected = isSeatSelected(seat.seatId);
                      const uiInfo = seatUIConfig[seat.seatType] || seatUIConfig.DEFAULT;
                      const price = seatPrices[seat.seatType] || 0;
                      const isCouple = seat.seatType === "COUPLE";
                      const marginClass = isCouple ? "mx-0" : "mx-[1px] sm:mx-[2px]";

                      return (
                        <button
                          key={seat.seatId}
                          onClick={() => toggleSeat(seat)}
                          disabled={isOccupied}
                          className={`${marginClass} group cursor-pointer h-6 sm:h-8 rounded-t-lg transition-all flex items-center justify-center text-[10px]
                            ${isCouple ? "w-8 sm:w-10 rounded-none first:rounded-l-lg last:rounded-r-lg" : "w-6 sm:w-8"}
                            ${isOccupied ? "bg-red-900/50 cursor-not-allowed opacity-60" : isSelected ? "bg-primary scale-110 z-10 shadow-lg" : uiInfo.color + " hover:scale-110 hover:opacity-90"}
                            ${isCouple && !isOccupied && !isSelected ? "border-r border-black/10" : ""}
                          `}
                          title={`${seat.seatRow}${seat.seatNumber} – ${uiInfo.label} (${formatCurrency(price)})`}
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-white font-medium">
                            {seat.seatNumber}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-8 text-center text-muted-foreground font-bold text-sm">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {Object.entries(seatUIConfig).map(([type, config]) => {
            if (type === "DEFAULT") return null;
            const price = seatPrices[type] || 0;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-6 h-6 ${config.color} rounded-t-lg flex-shrink-0`} />
                <span className="text-sm text-muted-foreground">{config.label}{price > 0 ? ` (${formatCurrency(price)})` : ""}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-t-lg flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-900/50 rounded-t-lg flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Đã đặt</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Đã chọn {selectedSeats.length} ghế</p>
              <p className="text-sm font-medium">
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
                <p className="text-2xl text-primary font-bold">{formatCurrency(calculateTotal())}</p>
              </div>
              <Button className="cursor-pointer" size="lg" onClick={handleGoToFoods}>
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
