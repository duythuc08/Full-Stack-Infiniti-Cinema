"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, Home, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AttemptedOrderInfo } from "@/types/order.types";

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [attemptedInfo, setAttemptedInfo] = useState<AttemptedOrderInfo | null>(null);

  const responseCode = searchParams.get("vnp_ResponseCode");
  const errorMessageParam = searchParams.get("error_message");

  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      try {
        setAttemptedInfo(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Error parsing localStorage pendingOrder:", e);
      }
    }
  }, []);

  const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

  const getErrorMessage = () => {
    if (errorMessageParam) return decodeURIComponent(errorMessageParam);
    if (responseCode === "24") return "Giao dịch bị hủy bởi khách hàng.";
    if (responseCode === "51") return "Tài khoản của quý khách không đủ số dư.";
    if (responseCode) return `Mã lỗi từ cổng thanh toán: ${responseCode}`;
    return "Đã có lỗi xảy ra trong quá trình xử lý thanh toán.";
  };

  const handleGoHome = () => {
    localStorage.removeItem("pendingOrder");
    router.push("/");
  };

  const handleRetry = () => {
    router.back();
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
      <div className="flex flex-col gap-10 items-center">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center items-center max-w-2xl">
          <div className="mb-2">
            <XCircle className="w-24 h-24 text-red-500" />
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Thanh toán thất bại!
          </h1>
          <p className="text-muted-foreground text-lg font-normal leading-normal">
            Rất tiếc, giao dịch của bạn chưa được hoàn tất. Vui lòng kiểm tra lại thông tin hoặc thử phương thức thanh toán khác.
          </p>

          <div className="mt-4 bg-red-950/30 border border-red-900/50 p-4 rounded-lg flex items-start gap-3 text-left w-full">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Chi tiết lỗi:</p>
              <p className="text-red-300/80 text-sm">{getErrorMessage()}</p>
            </div>
          </div>
        </div>

        {/* Attempted Order Info */}
        {attemptedInfo && (
          <div className="w-full bg-[#141414] border border-white/10 rounded-lg p-6 shadow-xs">
            <h3 className="text-white text-lg font-bold mb-4">Thông tin giao dịch chưa hoàn tất</h3>

            <div className="flex flex-col md:flex-row gap-6 border-b border-white/10 pb-6 mb-6">
              {attemptedInfo.moviePoster && (
                <img
                  src={attemptedInfo.moviePoster}
                  alt={attemptedInfo.movie}
                  className="w-20 h-28 object-cover rounded-md hidden sm:block"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div>
                  <p className="text-muted-foreground text-sm">Phim</p>
                  <p className="text-white font-medium">{attemptedInfo.movie || "---"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Rạp chiếu</p>
                  <p className="text-white font-medium">{attemptedInfo.cinema} - {attemptedInfo.roomName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Suất chiếu</p>
                  <p className="text-white font-medium">{attemptedInfo.time} - {attemptedInfo.date}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">Phương thức</p>
                <p className="text-white font-medium">{attemptedInfo.paymentMethod || "---"}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm mb-1">Tổng tiền cần thanh toán</p>
                <p className="text-yellow-500 font-bold text-2xl">
                  {formatCurrency(attemptedInfo.finalPrice || attemptedInfo.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-white/20 hover:bg-white/10"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Button>
          <Button
            onClick={handleRetry}
            size="lg"
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
          >
            <RefreshCcw className="w-5 h-5" />
            Thử thanh toán lại
          </Button>
        </div>
        <p className="text-muted-foreground text-sm text-center mt-4">
          Nếu bạn cho rằng đây là lỗi hệ thống và đã bị trừ tiền, vui lòng liên hệ bộ phận CSKH.
        </p>
      </div>
    </main>
  );
}
