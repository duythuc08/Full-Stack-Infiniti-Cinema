"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookingState, mergeBookingState } from "@/utils/bookingStorage";
import { fetchFoods } from "@/libs/service/booking.service";
import type { FoodProduct, FoodDetail } from "@/types";

export default function FoodSelectionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [cart, setCart] = useState<Record<number, number>>({});
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  const bookingInfo = getBookingState();
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Countdown – dùng [] để tránh restart interval khi router reference thay đổi
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch foods
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetchFoods(token)
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error("Lỗi tải món ăn:", error);
        toast.error("Không thể tải danh sách đồ ăn. Vui lòng thử lại.");
        setLoadingProducts(false);
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
              Chọn Combo / Sản phẩm
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            {loadingProducts ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                  <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-5 w-24 rounded-lg" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
                <p>Không có sản phẩm nào.</p>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 hover:border-primary/30"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold mb-1 text-card-foreground">{p.name}</h2>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{p.desc}</p>
                    <p className="text-sm font-bold text-primary">{formatCurrency(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(p.id, -1)}
                      className="w-8 h-8 rounded-full border border-border bg-secondary text-foreground flex items-center justify-center cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-base font-bold min-w-[20px] text-center">{cart[p.id] || 0}</span>
                    <button
                      onClick={() => updateQuantity(p.id, 1)}
                      className="w-8 h-8 rounded-full border border-border bg-secondary text-foreground flex items-center justify-center cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="sticky top-8">
            {/* Countdown timer */}
            <div className="mb-4 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Thời gian giữ ghế</p>
                <div className={`text-3xl font-black font-mono ${timeLeft <= 60 ? "text-red-500 animate-pulse" : "text-primary"}`}>
                  {minutes}:{seconds}
                </div>
              </div>
              <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-[width] duration-300 rounded-full ${timeLeft <= 60 ? "bg-red-500" : "bg-primary"}`}
                  style={{ width: `${(timeLeft / 300) * 100}%` }}
                />
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-xl shadow-black/10">
              {/* Movie info */}
              <div className="flex mb-5 gap-3">
                <img
                  src={bookingInfo?.moviePoster || ""}
                  alt="Poster phim"
                  className="w-20 h-28 rounded-xl object-cover flex-shrink-0 border border-border shadow-md"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold mb-1 text-card-foreground line-clamp-2">{bookingInfo?.movie}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{bookingInfo?.cinema}</p>
                  <p className="text-xs text-muted-foreground">{bookingInfo?.roomName}</p>
                  <p className="text-xs font-semibold text-foreground mt-1">{bookingInfo?.time}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Vé đã đặt</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Ghế: <span className="text-foreground font-medium">{(bookingInfo?.seats || []).map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}</span>
                </p>
                <div className="space-y-1.5">
                  {Object.values(groupedSeats).map((g) => (
                    <div key={g.seatType} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{g.seatType} ×{g.count}</span>
                      <span className="font-medium text-foreground">{formatCurrency(g.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {Object.keys(cart).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Combo đã chọn</p>
                  {Object.entries(cart).map(([pid, qty]) => {
                    const product = products.find((p) => p.id === Number(pid));
                    if (!product) return null;
                    return (
                      <div key={pid} className="flex justify-between items-center text-sm mb-1.5">
                        <span className="flex-1 pr-2 text-muted-foreground">{qty}× {product.name}</span>
                        <span className="whitespace-nowrap font-medium text-foreground">{formatCurrency(product.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-dashed border-border pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">Tổng cộng</span>
                  <span className="text-primary font-black text-xl">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl font-semibold text-primary bg-transparent border-2 border-primary cursor-pointer transition-all hover:bg-primary/10 text-sm"
                  onClick={() => router.back()}
                >
                  Quay lại
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary border-none cursor-pointer transition-all hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/30 text-sm"
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
