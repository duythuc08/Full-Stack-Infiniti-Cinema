"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { getBookingState, clearBookingState } from "@/utils/bookingStorage";
import { createVnpayBooking } from "@/libs/service/booking.service";
import { fetchMembershipTierByName } from "@/libs/service/user.service";
import type { MembershipTier } from "@/types";

export default function PaymentPage() {
  const router = useRouter();
  useParams<{ id: string }>();

  const bookingInfo = getBookingState();

  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);
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
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("Hết thời gian giữ ghế! Vui lòng đặt vé lại.", { duration: 5000 });
          router.push("/");
          return 0;
        }
        if (prev === 60) {
          toast.warning("Còn 1 phút để hoàn tất thanh toán!", { duration: 3000 });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

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
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mt-5 flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại
        </button>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-md p-6">
              <h1 className="text-2xl font-semibold mb-6">Chọn Phương Thức Thanh Toán</h1>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "MOMO" ? "border-[#d82d8b] bg-[#d82d8b]/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="MOMO" id="pm1" />
                  <div>
                    <p className="text-lg font-semibold text-[#d82d8b]">MOMO</p>
                    <p className="text-sm text-muted-foreground">Thanh toán qua ví MoMo</p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "VNPAY" ? "border-[#0066b3] bg-[#0066b3]/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="VNPAY" id="pm2" />
                  <div>
                    <p className="text-lg font-semibold text-[#0066b3]">VNPAY</p>
                    <p className="text-sm text-muted-foreground">Thanh toán qua cổng VNPAY (ATM/QR)</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-md p-6 sticky top-24">
              <div className="flex mb-6">
                {bookingInfo?.moviePoster && (
                  <img
                    src={bookingInfo.moviePoster}
                    alt="Poster phim"
                    className="w-20 h-28 rounded-md object-cover mr-4 border border-border flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-tight text-card-foreground">{bookingInfo?.movie}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{bookingInfo?.cinema}</p>
                  <p className="text-sm text-muted-foreground">{bookingInfo?.date} – {bookingInfo?.time}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-6 mb-6">
                <p className="font-semibold mb-3">Vé đã đặt</p>
                {Object.values(groupedSeats).map((group) => (
                  <div key={group.seatType} className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground"><span className="mr-1">{group.count}×</span>{group.seatType}</span>
                    <span>{formatCurrency(group.totalPrice)}</span>
                  </div>
                ))}
                <p className="text-sm mt-2 text-muted-foreground">
                  Ghế: <span className="text-foreground">{(bookingInfo?.seats || []).map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}</span>
                </p>
              </div>

              {bookingInfo?.foods && bookingInfo.foods.length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold mb-3">Đồ ăn &amp; Nước uống</p>
                  {bookingInfo.foods.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm mb-2">
                      <span className="flex-1 pr-2 text-muted-foreground">{item.qty}× {item.name}</span>
                      <span className="whitespace-nowrap">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-dashed border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(bookingInfo?.total || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-500">
                  <span>Giảm giá ({isTierLoading ? "..." : discountInfo.label})</span>
                  <span>−{formatCurrency(discountInfo.amount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(finalPrice)}</span>
                </div>
              </div>

              <div className="my-6 py-3 bg-primary/10 rounded-lg text-center border border-primary/20">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Thời gian còn lại</p>
                <div className={`text-2xl font-mono font-bold ${timeLeft <= 60 ? "text-red-500 animate-pulse" : "text-primary"}`}>
                  {minutes}:{seconds}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 cursor-pointer"
                disabled={loading || isTierLoading}
              >
                {loading ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
