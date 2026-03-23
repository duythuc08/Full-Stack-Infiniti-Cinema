"use client";

import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@/types";

interface Props {
  orders: Order[];
  loading: boolean;
  onSelectOrder: (order: Order) => void;
}

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

const formatDate = (v?: string) =>
  v
    ? new Date(v).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "---";

export function OrderHistory({ orders, loading, onSelectOrder }: Props) {
  const sorted = [...orders].sort(
    (a, b) => new Date(b.bookingTime || "").getTime() - new Date(a.bookingTime || "").getTime()
  );

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Ticket className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-base font-bold text-foreground">Đơn hàng &amp; Vé</h2>
        </div>
        {!loading && (
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {sorted.length} đơn
          </span>
        )}
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 border border-border rounded-xl"
              >
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-secondary/20">
            <Ticket className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-0.5">
            {sorted.map((order) => {
              const status     = getStatus(order.orderStatus || "");
              const shortId    = String(order.orderId ?? "").slice(0, 8).toUpperCase();
              const ticketCount = order.tickets?.length ?? 0;

              return (
                <div
                  key={String(order.orderId)}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-border rounded-xl hover:bg-secondary/30 transition-colors"
                >
                  {/* Left: id + status + date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-foreground font-mono">#{shortId}</span>
                      <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span>{formatDate(order.bookingTime)}</span>
                      {ticketCount > 0 && <span>{ticketCount} vé</span>}
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-base font-black text-foreground tabular-nums sm:text-right shrink-0">
                    {formatCurrency(order.finalPrice)}
                  </p>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectOrder(order)}
                    className="cursor-pointer text-primary hover:text-primary hover:bg-primary/10 rounded-lg font-semibold text-xs shrink-0"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
