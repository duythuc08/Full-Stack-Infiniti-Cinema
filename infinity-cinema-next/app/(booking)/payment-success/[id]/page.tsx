"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
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

          // If MOMO (no orderId from URL), use orderId from localStorage
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
      <main className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-white text-xl">Đang tải thông tin đơn hàng...</p>
        </div>
      </main>
    );
  }

  if (error || !orderData) {
    return (
      <main className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-xl mb-2">Lỗi!</p>
        <p className="text-white text-lg mb-4">{error || "Không tìm thấy thông tin đơn hàng"}</p>
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
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <p className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Chúc mừng! Bạn đã đặt vé thành công.
          </p>
          <p className="text-muted-foreground text-base font-normal leading-normal">
            Mã đơn hàng: <span className="font-bold text-yellow-400">#{orderData.orderId}</span> – Thông tin đã được gửi đến email của bạn.
          </p>
        </div>

        {/* Layout: QR + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* QR Code */}
          <div className="lg:col-span-1 bg-[#141414] border border-white/10 p-6 rounded-lg flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-md">
              <img
                alt={`QR Code for order ${orderData.orderId}`}
                className="w-full max-w-[220px] aspect-square"
                src={
                  orderData.qrCode?.startsWith("data:image")
                    ? orderData.qrCode
                    : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(orderData.qrCode || orderData.orderId)}`
                }
              />
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-bold">Mã đặt vé: {orderData.qrCode || `#${orderData.orderId}`}</p>
              <p className="text-muted-foreground text-sm mt-1">Vui lòng đưa mã QR này tại quầy vé để nhận vé của bạn.</p>
            </div>
            <Button className="w-full gap-2">
              <Download className="w-4 h-4" /> Tải vé về
            </Button>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-[#141414] border border-white/10 rounded-lg p-6 flex flex-col gap-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  {extraInfo?.moviePoster && (
                    <img src={extraInfo.moviePoster} alt={extraInfo?.movie} className="w-20 h-28 object-cover rounded-md" />
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Chi tiết vé</p>
                    <p className="text-white text-2xl font-bold">{extraInfo?.movie || "---"}</p>
                    <p className="text-muted-foreground text-sm">{extraInfo?.format || "2D Phụ đề"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-6 border-t border-white/10 pt-5">
                <div>
                  <p className="text-muted-foreground text-sm">Rạp chiếu</p>
                  <p className="text-white text-sm font-medium mt-1">{extraInfo?.cinema || "---"} - {extraInfo?.roomName || "---"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Suất chiếu</p>
                  <p className="text-white text-sm font-medium mt-1">{extraInfo?.date || "---"} - {extraInfo?.time || "---"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Ghế ngồi</p>
                  <p className="text-white text-sm font-medium mt-1">{getSeatList()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 border-t border-white/10 pt-5">
                <div>
                  <p className="text-muted-foreground text-sm">Thời gian đặt</p>
                  <p className="text-white text-sm font-medium mt-1">{formatDate(orderData.bookingTime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Khách hàng</p>
                  <p className="text-white text-sm font-medium mt-1">{orderData.fullName || "---"}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#141414] border border-white/10 rounded-lg p-6 flex flex-col gap-4 mb-5">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <Ticket className="w-5 h-5" /> Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3 border-t border-white/10 pt-4">
                {ticketSummary.map((group, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Vé {group.seatType} (x{group.count})</p>
                    <p className="text-white font-medium">{formatCurrency(group.totalPrice)}</p>
                  </div>
                ))}
                {orderData.foods?.map((item, index) => (
                  <div key={`food-${index}`} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">{item.name} (x{item.quantity})</p>
                    <p className="text-white font-medium">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Tổng tiền vé</p>
                  <p className="text-white">{formatCurrency(orderData.totalTicketPrice)}</p>
                </div>
                {(orderData.totalFoodPrice || 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Tổng tiền đồ ăn</p>
                    <p className="text-white">{formatCurrency(orderData.totalFoodPrice)}</p>
                  </div>
                )}
                {(orderData.discountAmount || 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Giảm giá {orderData.promotionCode && `(${orderData.promotionCode})`}</p>
                    <p className="text-green-500">-{formatCurrency(orderData.discountAmount)}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <p className="text-white font-bold text-lg">Tổng cộng</p>
                <p className="text-yellow-500 font-bold text-xl">{formatCurrency(orderData.finalPrice)}</p>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                <span>Thanh toán qua</span>
                <span className="font-medium text-white">{extraInfo?.paymentMethod || "VNPAY"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <Button
                onClick={() => { localStorage.removeItem("pendingOrder"); router.push("/"); }}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Home className="w-4 h-4" /> Về trang chủ
              </Button>
              <Button
                onClick={() => { localStorage.removeItem("pendingOrder"); router.push("/profile"); }}
                className="flex-1 gap-2"
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
