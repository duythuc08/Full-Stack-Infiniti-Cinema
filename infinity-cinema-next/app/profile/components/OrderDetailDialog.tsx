"use client";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createVnpayRepaymentUrl } from "@/libs/service/user.service";
import type { Order } from "@/types";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

/* ─── Helpers ─────────────────────────────────────────────── */
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Đang chờ thanh toán",
    className: "text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-transparent",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 border-transparent",
  },
};

const getStatus = (status: string) =>
  STATUS_MAP[status] ?? {
    label: "Đã thanh toán",
    className: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent",
  };

const formatCurrency = (n?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

const formatDateTime = (v?: string) =>
  v
    ? new Date(v).toLocaleString("vi-VN", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      })
    : "---";

const isCompleted = (status: string) => status !== "PENDING" && status !== "CANCELLED";

function groupTickets(tickets?: Order["tickets"]) {
  if (!tickets?.length) return [];
  return Object.values(
    tickets.reduce<Record<string, { seatType: string; count: number; totalPrice: number; seatNames: string[] }>>(
      (acc, t) => {
        if (!acc[t.seatType]) acc[t.seatType] = { seatType: t.seatType, count: 0, totalPrice: 0, seatNames: [] };
        acc[t.seatType].count      += 1;
        acc[t.seatType].totalPrice += t.price;
        acc[t.seatType].seatNames.push(t.seatName);
        return acc;
      }, {}
    )
  );
}

function groupFoods(foods?: Order["foods"]) {
  if (!foods?.length) return [];
  return Object.values(
    foods.reduce<Record<string, { name: string; quantity: number; totalPrice: number }>>(
      (acc, f) => {
        if (!acc[f.name]) acc[f.name] = { name: f.name, quantity: 0, totalPrice: 0 };
        acc[f.name].quantity   += f.quantity;
        acc[f.name].totalPrice += f.totalPrice;
        return acc;
      }, {}
    )
  );
}

/* ─── Component ───────────────────────────────────────────── */
export function OrderDetailDialog({ order, open, onClose }: Props) {
  if (!order) return null;

  const status    = getStatus(order.orderStatus || "");
  const shortId   = String(order.orderId ?? "").slice(0, 8).toUpperCase();
  const grouped   = groupTickets(order.tickets);
  const foods     = groupFoods(order.foods);
  const completed = isCompleted(order.orderStatus || "");

  const handleRePayment = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const url   = await createVnpayRepaymentUrl(token, String(order.orderId));
      window.location.href = url;
    } catch {
      toast.error("Không thể kết nối đến máy chủ thanh toán.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">

        {/* ── Header ── */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
              <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                <span className="text-xs font-mono font-semibold text-muted-foreground">#{shortId}</span>
                <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                  {status.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDateTime(order.bookingTime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {order.orderStatus === "PENDING" && (
                <Button
                  size="sm"
                  onClick={handleRePayment}
                  className="cursor-pointer text-xs font-semibold rounded-lg hover:-translate-y-0.5 transition-all shadow-sm shadow-primary/20"
                >
                  Thanh toán ngay
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground rounded-lg"
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="flex flex-col sm:flex-row">

          {/* LEFT: Seat + Food */}
          <div className="flex-1 min-w-0 p-5 space-y-5">

            {/* Seats */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Ghế ngồi ({order.tickets?.length ?? 0} vé)
              </p>
              {grouped.length > 0 ? (
                <div className="space-y-3">
                  {grouped.map((t, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground">{t.seatType}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">×{t.count}</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.seatNames.map((sn, si) => (
                            <span
                              key={si}
                              className="bg-secondary text-foreground text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                            >
                              {sn}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-foreground tabular-nums whitespace-nowrap">
                        {formatCurrency(t.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Không có dữ liệu ghế</p>
              )}
            </div>

            {/* Foods */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Đồ ăn &amp; Thức uống
              </p>
              {foods.length > 0 ? (
                <div className="space-y-2">
                  {foods.map((f, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
                          {f.quantity}
                        </span>
                        <span className="text-sm text-foreground">{f.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {formatCurrency(f.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Không có đồ ăn</p>
              )}
            </div>
          </div>

          {/* DASHED SEPARATOR */}
          <div className="hidden sm:block w-px border-l border-dashed border-border my-5" />
          <div className="sm:hidden mx-5 h-px border-t border-dashed border-border" />

          {/* RIGHT: QR */}
          <div className="flex sm:flex-col items-center justify-center gap-4 sm:gap-3 p-5 sm:w-[160px] sm:min-w-[160px]">
            {completed ? (
              <>
                <div className="bg-white p-2.5 rounded-xl shadow-md flex-shrink-0">
                  <img
                    alt="QR Code"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain block"
                    src={
                      order.qrCode?.startsWith("data:image")
                        ? order.qrCode
                        : `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
                            order.qrCode || String(order.orderId)
                          )}`
                    }
                  />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Mã vé
                  </p>
                  <p className="text-xs font-mono font-bold text-foreground break-all leading-tight">
                    #{shortId}
                  </p>
                  {order.fullName && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[130px]">
                      {order.fullName}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-border flex items-center justify-center p-3">
                <p className="text-[10px] text-muted-foreground text-center leading-tight">
                  Không có QR
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: Price breakdown ── */}
        <div className="border-t border-border bg-secondary/20 px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Vé:{" "}
              <span className="text-foreground font-medium tabular-nums">
                {formatCurrency(order.totalTicketPrice)}
              </span>
            </span>
            <span>
              Đồ ăn:{" "}
              <span className="text-foreground font-medium tabular-nums">
                {formatCurrency(order.totalFoodPrice)}
              </span>
            </span>
            {(order.discountAmount || 0) > 0 && (
              <span>
                Giảm:{" "}
                <span className="text-rose-500 font-medium tabular-nums">
                  −{formatCurrency(order.discountAmount)}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">Tổng:</span>
            <span className="text-lg font-black text-primary tabular-nums">
              {formatCurrency(order.finalPrice)}
            </span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
