"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getBookingState, mergeBookingState } from "@/utils/bookingStorage";
import { fetchFoods } from "@/libs/service/booking.service";
import type { FoodProduct, FoodDetail } from "@/types";

export default function FoodSelectionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [cart, setCart] = useState<Record<number, number>>({});
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);

  const bookingInfo = getBookingState();
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Countdown
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
          toast.warning("Còn 1 phút để hoàn tất đặt vé!", { duration: 3000 });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  // Fetch foods
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetchFoods(token)
      .then(setProducts)
      .catch((error) => {
        console.error("Lỗi tải món ăn:", error);
        toast.error("Không thể tải danh sách đồ ăn. Vui lòng thử lại.");
      });
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) + delta;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const foodTotal = Object.entries(cart).reduce((sum, [pid, qty]) => {
    const product = products.find((p) => p.id === Number(pid));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const grandTotal = foodTotal + (bookingInfo?.seatTotal || 0);

  const groupedSeats = (bookingInfo?.seats || []).reduce<
    Record<string, { seatType: string; price: number; count: number; totalPrice: number }>
  >((acc, seat) => {
    const type = seat.seatType;
    if (!acc[type]) acc[type] = { seatType: type, price: seat.price, count: 0, totalPrice: 0 };
    acc[type].count += 1;
    acc[type].totalPrice += seat.price;
    return acc;
  }, {});

  const handleProceedToCheckout = () => {
    if (!bookingInfo?.seats || bookingInfo.seats.length === 0) return;

    const selectedFoods: FoodDetail[] = Object.entries(cart).map(([pid, qty]) => {
      const product = products.find((p) => p.id === Number(pid))!;
      return {
        id: product.id,
        foodId: product.id,
        name: product.name,
        desc: product.desc,
        price: product.price,
        img: product.img,
        qty,
        totalPrice: product.price * qty,
        isCombo: product.isCombo,
      };
    });

    mergeBookingState({
      foods: selectedFoods,
      foodTotal,
      total: (bookingInfo.seatTotal || 0) + foodTotal,
      orderId: id,
    });

    router.push(`/payment/${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-8 px-4">
      <div className="max-w-5xl lg:max-w-[1200px] mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left: Products */}
        <div>
          <h1 className="text-2xl font-semibold mb-6">Chọn Combo / Sản phẩm</h1>
          <div className="flex flex-col gap-4">
            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                <p>Không có sản phẩm nào.</p>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="bg-card rounded-md p-4 flex items-center gap-4 border border-border transition-all hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(229,9,20,0.2)] hover:border-primary/40"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-24 h-24 object-cover rounded-full shrink-0 border-2 border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-1 text-card-foreground">{p.name}</h2>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{p.desc}</p>
                    <p className="text-base font-bold text-primary">{formatCurrency(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => updateQuantity(p.id, -1)}
                      className="w-8 h-8 rounded-full border border-border bg-transparent text-foreground flex items-center justify-center cursor-pointer text-xl transition-all hover:bg-muted hover:border-primary"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold min-w-[24px] text-center">{cart[p.id] || 0}</span>
                    <button
                      onClick={() => updateQuantity(p.id, 1)}
                      className="w-8 h-8 rounded-full border border-border bg-transparent text-foreground flex items-center justify-center cursor-pointer text-xl transition-all hover:bg-muted hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="sticky top-8">
            {/* Countdown */}
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground mb-1">Thời gian giữ ghế:</div>
              <div className={`text-2xl font-bold ${timeLeft <= 60 ? "text-red-500 animate-pulse" : "text-primary"}`}>
                {minutes}:{seconds}
              </div>
            </div>
            <div className="w-full h-1 bg-muted rounded overflow-hidden mb-6">
              <div
                className={`h-full transition-[width] duration-300 ${timeLeft <= 60 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>

            <div className="bg-card rounded-md p-6 border border-border">
              <div className="flex mb-6">
                <img
                  src={bookingInfo?.moviePoster || ""}
                  alt="Poster phim"
                  className="w-24 h-36 rounded-md object-cover mr-4 border border-border flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold mb-1 text-card-foreground">{bookingInfo?.movie}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{bookingInfo?.cinema} – {bookingInfo?.roomName}</p>
                  <p className="text-sm text-muted-foreground">
                    Suất: <span className="font-semibold text-foreground">{bookingInfo?.time}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-6 mb-6">
                <p className="font-semibold mb-3 text-card-foreground">Vé đã đặt</p>
                <p className="text-sm mb-2 text-muted-foreground">
                  Ghế: <span className="text-foreground">{(bookingInfo?.seats || []).map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}</span>
                </p>
                <div className="space-y-1">
                  {Object.values(groupedSeats).map((g) => (
                    <div key={g.seatType} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{g.seatType} x{g.count}</span>
                      <span className="text-foreground">{formatCurrency(g.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {Object.keys(cart).length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold mb-3 text-card-foreground">Combo Bắp &amp; Nước</p>
                  {Object.entries(cart).map(([pid, qty]) => {
                    const product = products.find((p) => p.id === Number(pid));
                    if (!product) return null;
                    return (
                      <div key={pid} className="flex justify-between items-center text-sm mb-2">
                        <span className="flex-1 pr-2 text-muted-foreground">{qty}× {product.name}</span>
                        <span className="whitespace-nowrap text-foreground">{formatCurrency(product.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-dashed border-border pt-6 mb-6">
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 py-3 rounded-md font-semibold text-primary bg-transparent border-2 border-primary cursor-pointer transition-all hover:bg-primary/10"
                  onClick={() => router.back()}
                >
                  Quay lại
                </button>
                <button
                  className="flex-1 py-3 rounded-md font-semibold text-white bg-primary border-none cursor-pointer transition-all hover:bg-primary/90"
                  onClick={handleProceedToCheckout}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
