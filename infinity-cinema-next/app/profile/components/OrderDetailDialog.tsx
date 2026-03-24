"use client";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Badge, BadgeProps} from "@/components/ui/badge";
import { createVnpayRepaymentUrl } from "@/libs/service/user.service";
import type { Order } from "@/types";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_MAP: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    PENDING: {
        label: "Chờ thanh toán",
        variant: "pending",
    },
    CANCELLED: {
        label: "Đã hủy",
        variant: "cancelled", // hoặc dùng "destructive" tùy bạn thiết lập ở file Badge.tsx
    },
    PAID: {
        label: "Đã thanh toán",
        variant: "paid",
    },
};

const getStatus = (status: string) =>
    STATUS_MAP[status] ?? {
        label: status,
        variant: "default",
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
  const allSeats  = grouped.flatMap((g) => g.seatNames);

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
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex flex-col">
          {/* ── Header: Tiêu đề bên trái + Trạng thái & thời gian bên phải ── */}
          <div className="px-6 pt-6 ">
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="cursor-pointer text-xs text-foreground hover:text-primary hover:bg-red-100 rounded-lg -mt-1 -mr-2"
                  >
                      Đóng
                  </Button>
              </div>
            <div className="flex items-start justify-between gap-4">
              <DialogHeader className="space-y-1 flex-1 min-w-0">
                <DialogTitle className="text-xl font-black text-foreground leading-tight">
                 <div>{order.movieTitle || "Thông tin đơn hàng"}</div>
                </DialogTitle>
                {order.cinemaName && (
                  <p className="text-sm font-semibold text-foreground">{order.cinemaName}</p>
                )}
                {order.cinemaAddress && (
                  <p className="text-xs text-muted-foreground">{order.cinemaAddress}</p>
                )}
                  <DialogTitle className="">
                      <div className="flex items-center gap-2">
                          <Badge variant={status.variant} className="text-xs font-semibold px-2 py-0.5 rounded-full">
                              {status.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDateTime(order.bookingTime)}
                      </span>
                      </div>
                  </DialogTitle>
              </DialogHeader>

            </div>
          </div>

            {/* ── Đường phân cách ── */}
            <div className="mx-6 border-t border-dashed border-border" />

          {/* ── Phần giữa: Chi tiết bên trái + QR Code bên phải ── */}
          <div className="flex flex-col sm:flex-row">

            {/* BÊN TRÁI: Thông tin vé + Đồ ăn */}
            <div className="flex-1 min-w-0 px-6 py-4 space-y-4">

              {/* Grid thông tin vé */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã đặt vé</p>
                  <p className="text-sm font-bold font-mono text-foreground mt-0.5">#{shortId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suất chiếu</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.showTime || formatDateTime(order.bookingTime)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phòng chiếu</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.roomName || "---"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số vé</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{order.tickets?.length ?? 0} vé</p>
                </div>
                {grouped.length > 0 && (
                  <>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loại vé</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {grouped.map((g) => g.seatType).join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số ghế</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {allSeats.map((sn, i) => (
                          <span
                            key={i}
                            className="bg-secondary text-foreground text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                          >
                            {sn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Đồ ăn & Thức uống */}
              {foods.length > 0 && (
                <>
                  <div className="border-t border-dashed border-border" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Đồ ăn &amp; Thức uống
                    </p>
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
                  </div>
                </>
              )}
            </div>

            {/* ĐƯỜNG PHÂN CÁCH DỌC */}
            <div className="hidden sm:block w-px border-l border-dashed border-border my-4" />
            <div className="sm:hidden mx-6 border-t border-dashed border-border" />

            {/* BÊN PHẢI: QR Code */}
            <div className="flex sm:flex-col items-center justify-center gap-3 p-5 sm:w-[180px] sm:min-w-[180px]">
              {completed ? (
                <>
                  <div className="bg-background border border-border p-3 rounded-2xl shadow-sm">
                    <img
                      alt="QR Code"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain block"
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
                      <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">
                        {order.fullName}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center leading-tight px-3">
                    Chờ thanh toán
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Đường phân cách ── */}
          <div className="mx-6 border-t border-dashed border-border" />

          {/* ── Tổng tiền + Nút hành động ── */}
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
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
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xs text-muted-foreground">Tổng cộng:</span>
                <span className="text-xl font-black text-primary tabular-nums">
                  {formatCurrency(order.finalPrice)}
                </span>
              </div>
            </div>

            {order.orderStatus === "PENDING" && (
              <Button
                size="sm"
                onClick={handleRePayment}
                className="cursor-pointer text-xs font-semibold rounded-lg hover:-translate-y-0.5 transition-all shadow-sm shadow-primary/20"
              >
                Thanh toán ngay
              </Button>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
