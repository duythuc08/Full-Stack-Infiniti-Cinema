"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { getBookingState, clearBookingState } from "@/utils/bookingStorage";
import { createVnpayBooking } from "@/libs/service/booking.service";
import { fetchMembershipTierByName } from "@/libs/service/user.service";
import { useBookingTimer } from "@/hooks/use-booking-timer";
import type { MembershipTier } from "@/types";

export default function PaymentPage() {
  const router = useRouter();
  useParams<{ id: string }>();

  const bookingInfo = getBookingState();

  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [loading, setLoading] = useState(false);
  const { minutes, seconds, isUrgent, clearTimer } = useBookingTimer();
  const [membershipData, setMembershipData] = useState<MembershipTier | null>(null);
  const [isTierLoading, setIsTierLoading] = useState(true);

  useEffect(() => {
    if (!bookingInfo) {
      toast.error("Không có thông tin đặt vé. Vui lòng bắt đầu lại.");
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const storedUser = JSON.parse(userStr);
        const tierName = storedUser.memberShipTierName;
        const token = localStorage.getItem("token") ?? "";
        const tier = await fetchMembershipTierByName(token, tierName);
        if (tier) setMembershipData(tier);
      } catch (error) {
        console.error("Lỗi lấy thông tin hạng thẻ:", error);
      } finally {
        setIsTierLoading(false);
      }
    };
    fetchTierInfo();
  }, []);

  const discountInfo = useMemo(() => {
    const total = bookingInfo?.total || 0;
    if (!membershipData) return { amount: 0, label: "MEMBER" };

    let rate = membershipData.discountPercent || 0;
    let label = membershipData.name || "MEMBER";

    const now = new Date();
    const storedUser = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
    if (storedUser.birthday) {
      const birthDate = new Date(storedUser.birthday);
      if (birthDate.getMonth() === now.getMonth()) {
        rate = membershipData.birthdayDiscount || 0;
        label = "Sinh Nhật";
      }
    }

    const amount = total * (rate / 100);
    return { amount, label };
  }, [membershipData, bookingInfo]);

  const finalPrice = (bookingInfo?.total || 0) - discountInfo.amount;

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.sub || payload.id;
    } catch {
      return null;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token") ?? "";
    const userId = getUserId();

    if (!userId) {
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      router.push("/login");
      setLoading(false);
      return;
    }

    if (paymentMethod === "VNPAY") {
      try {
        const result = await createVnpayBooking(token, {
          userId,
          seatShowTimeIds: (bookingInfo?.seats || []).map((seat) => seat.seatShowTimeId),
          foods: (bookingInfo?.foods || []).map((food) => ({
            foodId: food.id,
            quantity: food.qty,
          })),
          promotionCode: bookingInfo?.promotionCode,
        });

        const orderData = {
          ...result,
          paymentMethod: "VNPAY",
          movie: bookingInfo?.movie,
          moviePoster: bookingInfo?.moviePoster,
          cinema: bookingInfo?.cinema,
          roomName: bookingInfo?.roomName,
          time: bookingInfo?.time,
          date: bookingInfo?.date,
          seats: bookingInfo?.seats,
        };

        clearTimer();
        localStorage.setItem("pendingOrder", JSON.stringify(orderData));
        window.location.href = result.paymentUrl;
      } catch (err) {
        const error = err as Error;
        if (error.message?.includes("401") || error.message?.includes("403")) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
        } else if (error.message?.includes("500")) {
          toast.error("Hệ thống đang bận, vui lòng thử lại sau.");
        } else {
          toast.error(error.message || "Tạo thanh toán thất bại. Vui lòng thử lại.");
        }
        setLoading(false);
      }
    }

    if (paymentMethod === "MOMO") {
      const pendingOrder = {
        ...bookingInfo,
        finalPrice,
        discountAmount: discountInfo.amount,
        paymentMethod: "MOMO",
      };
      clearTimer();
      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
      clearBookingState();
      router.push(`/payment-success/momo`);
    }
  };

  const groupedSeats = (bookingInfo?.seats || []).reduce<
    Record<string, { seatType: string; count: number; totalPrice: number }>
  >((acc, seat) => {
    const type = seat.seatType;
    if (!acc[type]) acc[type] = { seatType: type, count: 0, totalPrice: 0 };
    acc[type].count += 1;
    acc[type].totalPrice += seat.price;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 pb-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
                  Chọn Phương Thức Thanh Toán
                </h1>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "MOMO"
                      ? "border-[#d82d8b] bg-[#d82d8b]/8 shadow-lg shadow-[#d82d8b]/10"
                      : "border-border hover:border-[#d82d8b]/40 bg-secondary/30"
                  }`}
                >
                  <RadioGroupItem value="MOMO" id="pm1" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#d82d8b]">MOMO</p>
                    <p className="text-sm text-muted-foreground">Thanh toán qua ví MoMo</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#d82d8b]/10 flex items-center justify-center">
                    <span className="text-lg font-black text-[#d82d8b]">M</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "VNPAY"
                      ? "border-[#0066b3] bg-[#0066b3]/8 shadow-lg shadow-[#0066b3]/10"
                      : "border-border hover:border-[#0066b3]/40 bg-secondary/30"
                  }`}
                >
                  <RadioGroupItem value="VNPAY" id="pm2" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#0066b3]">VNPAY</p>
                    <p className="text-sm text-muted-foreground">Thanh toán qua cổng VNPAY (ATM/QR)</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#0066b3]/10 flex items-center justify-center">
                    <span className="text-lg font-black text-[#0066b3]">V</span>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-20 shadow-xl shadow-black/10">
              {/* Movie poster + info */}
              <div className="flex mb-5 gap-3">
                {bookingInfo?.moviePoster && (
                  <img
                    src={bookingInfo.moviePoster}
                    alt="Poster phim"
                    className="w-16 h-24 rounded-xl object-cover flex-shrink-0 border border-border shadow-md"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-tight text-card-foreground line-clamp-2 mb-1">
                    {bookingInfo?.movie}
                  </h3>
                  <p className="text-xs text-muted-foreground">{bookingInfo?.cinema}</p>
                  <p className="text-xs text-muted-foreground">{bookingInfo?.date}</p>
                  <p className="text-xs font-semibold text-foreground">{bookingInfo?.time}</p>
                </div>
              </div>

              {/* Seats */}
              <div className="border-t border-dashed border-border pt-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Vé đã đặt</p>
                {Object.values(groupedSeats).map((group) => (
                  <div key={group.seatType} className="flex justify-between items-center text-sm mb-1.5">
                    <span className="text-muted-foreground">{group.count}× {group.seatType}</span>
                    <span className="font-medium">{formatCurrency(group.totalPrice)}</span>
                  </div>
                ))}
                <p className="text-xs mt-2 text-muted-foreground">
                  Ghế: <span className="text-foreground font-medium">{(bookingInfo?.seats || []).map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}</span>
                </p>
              </div>

              {bookingInfo?.foods && bookingInfo.foods.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Đồ ăn &amp; Nước</p>
                  {bookingInfo.foods.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm mb-1.5">
                      <span className="flex-1 pr-2 text-muted-foreground">{item.qty}× {item.name}</span>
                      <span className="whitespace-nowrap font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price summary */}
              <div className="border-t border-dashed border-border pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(bookingInfo?.total || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-500">
                  <span>Giảm giá ({isTierLoading ? "..." : discountInfo.label})</span>
                  <span>−{formatCurrency(discountInfo.amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-border">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(finalPrice)}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className={`mb-5 py-3 px-4 rounded-xl border text-center ${isUrgent ? "bg-destructive/10 border-destructive/30" : "bg-primary/8 border-primary/20"}`}>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Thời gian còn lại</p>
                <div className={`text-2xl font-black font-mono ${isUrgent ? "text-destructive animate-pulse" : "text-primary"}`}>
                  {minutes}:{seconds}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base font-black bg-primary hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/30 transition-all cursor-pointer"
                disabled={loading || isTierLoading}
              >
                {loading ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
