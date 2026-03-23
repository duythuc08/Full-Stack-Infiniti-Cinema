"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Download, Home, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOrderById } from "@/libs/service/order.service";
import type { OrderData, OrderExtraInfo } from "@/types/order.types";

export default function PaymentSuccessPage() {
  const { id: pathId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [extraInfo, setExtraInfo] = useState<OrderExtraInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderIdFromUrl = searchParams.get("orderId") || (pathId !== "momo" ? pathId : null);

  useEffect(() => {
    const loadData = async () => {
      const savedOrder = localStorage.getItem("pendingOrder");

      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          setExtraInfo({
            movie: parsed.movie,
            moviePoster: parsed.moviePoster,
            format: parsed.format,
            cinema: parsed.cinema,
            roomName: parsed.roomName,
            date: parsed.date,
            time: parsed.time,
            paymentMethod: parsed.paymentMethod,
          });

          if (!orderIdFromUrl && parsed.orderId) {
            await loadOrderFromAPI(parsed.orderId);
            return;
          }
        } catch (e) {
          console.error("Error parsing localStorage:", e);
        }
      }

      if (!orderIdFromUrl) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      await loadOrderFromAPI(orderIdFromUrl);
    };

    const loadOrderFromAPI = async (orderId: string) => {
      try {
        const token = localStorage.getItem("token") ?? "";
        const data = await fetchOrderById(orderId, token);
        setOrderData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderIdFromUrl]);

  const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeatList = () => {
    if (!orderData?.tickets || orderData.tickets.length === 0) return "---";
    return orderData.tickets.map((t) => t.seatName).join(", ");
  };

  const getTicketSummary = () => {
    if (!orderData?.tickets || orderData.tickets.length === 0) {
      return [{ seatType: "Ghế", count: 1, totalPrice: orderData?.totalTicketPrice || 0 }];
    }
    const grouped = orderData.tickets.reduce<Record<string, { seatType: string; count: number; totalPrice: number }>>((acc, ticket) => {
      const type = ticket.seatType || "STANDARD";
      if (!acc[type]) acc[type] = { seatType: type, count: 0, totalPrice: 0 };
      acc[type].count += 1;
      acc[type].totalPrice += ticket.price || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  if (loading) {
    return (
      <main className="w-full max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4 mb-12">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-8 w-80 rounded-xl" />
          <Skeleton className="h-5 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !orderData) {
    return (
      <main className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-destructive text-xl mb-2 font-bold">Lỗi!</p>
        <p className="text-muted-foreground text-base mb-6">{error || "Không tìm thấy thông tin đơn hàng"}</p>
        <Button onClick={() => router.push("/")} className="gap-2">
          <Home className="w-4 h-4" /> Về trang chủ
        </Button>
      </main>
    );
  }

  const ticketSummary = getTicketSummary();

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col gap-8">
        {/* Success Header */}
        <div className="flex flex-col gap-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight">
            Đặt vé thành công!
          </h1>
          <p className="text-muted-foreground text-sm">
            Mã đơn hàng:{" "}
            <span className="font-bold text-yellow-500">#{orderData.orderId}</span>
            {" "}– Thông tin đã được gửi đến email của bạn.
          </p>
        </div>

        {/* Layout: QR + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* QR Code card */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xl shadow-black/10">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <img
                alt={`QR Code for order ${orderData.orderId}`}
                className="w-full max-w-[200px] aspect-square"
                src={
                  orderData.qrCode?.startsWith("data:image")
                    ? orderData.qrCode
                    : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(orderData.qrCode || orderData.orderId)}`
                }
              />
            </div>
            <div className="text-center">
              <p className="text-base font-bold">{orderData.qrCode || `#${orderData.orderId}`}</p>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                Đưa mã QR này tại quầy vé để nhận vé.
              </p>
            </div>
            <Button className="w-full gap-2 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" /> Tải vé về
            </Button>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Movie info card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/5">
              <div className="flex items-start gap-4 mb-5">
                {extraInfo?.moviePoster && (
                  <img
                    src={extraInfo.moviePoster}
                    alt={extraInfo?.movie}
                    className="w-16 h-24 object-cover rounded-xl border border-border shadow-md flex-shrink-0"
                  />
                )}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Chi tiết vé</p>
                  <p className="text-xl font-bold">{extraInfo?.movie || "---"}</p>
                  <p className="text-muted-foreground text-sm mt-1">{extraInfo?.format || "2D Phụ đề"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 border-t border-border pt-5">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Rạp chiếu</p>
                  <p className="text-sm font-semibold">{extraInfo?.cinema || "---"} – {extraInfo?.roomName || "---"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Suất chiếu</p>
                  <p className="text-sm font-semibold">{extraInfo?.date || "---"} – {extraInfo?.time || "---"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Ghế ngồi</p>
                  <p className="text-sm font-semibold">{getSeatList()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 border-t border-border pt-4 mt-4">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Thời gian đặt</p>
                  <p className="text-sm font-semibold">{formatDate(orderData.bookingTime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Khách hàng</p>
                  <p className="text-sm font-semibold">{orderData.fullName || "---"}</p>
                </div>
              </div>
            </div>

            {/* Order summary card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/5">
              <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-primary" />
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-2.5 border-t border-border pt-4">
                {ticketSummary.map((group, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Vé {group.seatType} (×{group.count})</p>
                    <p className="font-semibold">{formatCurrency(group.totalPrice)}</p>
                  </div>
                ))}
                {orderData.foods?.map((item, index) => (
                  <div key={`food-${index}`} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">{item.name} (×{item.quantity})</p>
                    <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Tổng tiền vé</p>
                  <p className="font-medium">{formatCurrency(orderData.totalTicketPrice)}</p>
                </div>
                {(orderData.totalFoodPrice || 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Tổng tiền đồ ăn</p>
                    <p className="font-medium">{formatCurrency(orderData.totalFoodPrice)}</p>
                  </div>
                )}
                {(orderData.discountAmount || 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Giảm giá {orderData.promotionCode && `(${orderData.promotionCode})`}</p>
                    <p className="text-emerald-500 font-medium">−{formatCurrency(orderData.discountAmount)}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                <p className="font-black text-lg">Tổng cộng</p>
                <p className="text-yellow-500 font-black text-2xl">{formatCurrency(orderData.finalPrice)}</p>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground pt-3 border-t border-border mt-2">
                <span>Thanh toán qua</span>
                <span className="font-bold text-foreground">{extraInfo?.paymentMethod || "VNPAY"}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => { localStorage.removeItem("pendingOrder"); router.push("/"); }}
                variant="outline"
                className="flex-1 gap-2 hover:-translate-y-0.5 transition-all"
              >
                <Home className="w-4 h-4" /> Về trang chủ
              </Button>
              <Button
                onClick={() => { localStorage.removeItem("pendingOrder"); router.push("/profile"); }}
                className="flex-1 gap-2 hover:-translate-y-0.5 shadow-lg shadow-primary/30 transition-all"
              >
                <Ticket className="w-4 h-4" /> Xem vé của tôi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
