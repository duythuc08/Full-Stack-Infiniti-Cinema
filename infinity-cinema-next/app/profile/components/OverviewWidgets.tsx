"use client";

import { Trophy, Ticket, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserInfo, MembershipTier, Order } from "@/types";

interface Props {
  userInfo: UserInfo | null;
  allTiers: MembershipTier[];
  orders: Order[];
  loadingInfo: boolean;
  loadingOrders: boolean;
}

const TIER_STYLE: Record<string, { text: string; bar: string; bg: string; border: string }> = {
  MEMBER:  { text: "text-slate-500",  bar: "bg-slate-400",  bg: "bg-slate-50 dark:bg-slate-800/20",   border: "border-slate-200 dark:border-slate-700"  },
  SILVER:  { text: "text-blue-500",   bar: "bg-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/20",     border: "border-blue-200 dark:border-blue-800"    },
  GOLD:    { text: "text-amber-500",  bar: "bg-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20",   border: "border-amber-200 dark:border-amber-800"  },
  DIAMOND: { text: "text-cyan-400",   bar: "bg-cyan-400",   bg: "bg-cyan-50 dark:bg-cyan-900/20",     border: "border-cyan-200 dark:border-cyan-800"    },
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

export function OverviewWidgets({ userInfo, allTiers, orders, loadingInfo, loadingOrders }: Props) {
  const tierName = userInfo?.memberShipTierName ?? "MEMBER";
  const tier     = TIER_STYLE[tierName] ?? TIER_STYLE["MEMBER"];
  const pts      = userInfo?.loyaltyPoints ?? 0;

  const sortedTiers     = [...allTiers].sort((a, b) => a.pointsRequired - b.pointsRequired);
  const nextTier        = sortedTiers.find((t) => t.pointsRequired > pts);
  const curTier         = [...sortedTiers].reverse().find((t) => t.pointsRequired <= pts);
  const progressPercent = nextTier
    ? Math.min(100, ((pts - (curTier?.pointsRequired ?? 0)) / (nextTier.pointsRequired - (curTier?.pointsRequired ?? 0))) * 100)
    : 100;

  const totalTickets = orders.reduce((sum, o) => sum + o.tickets.length, 0);
  const totalSpent   = orders
    .filter((o) => o.orderStatus !== "PENDING" && o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + o.finalPrice, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

      {/* ── Widget 1: Hạng thành viên & Điểm ── */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5">
        {loadingInfo ? (
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-7 w-24 rounded" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className={`w-4 h-4 flex-shrink-0 ${tier.text}`} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hạng thành viên
              </span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${tier.bg} border ${tier.border} mb-3`}>
              <span className={`text-xl font-black ${tier.text}`}>{tierName}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {pts.toLocaleString("vi-VN")} điểm
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{pts.toLocaleString("vi-VN")} điểm</span>
                {nextTier && (
                  <span>{nextTier.pointsRequired.toLocaleString("vi-VN")} điểm</span>
                )}
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${tier.bar}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {nextTier ? (
                <p className="text-[10px] text-muted-foreground">
                  Còn{" "}
                  <span className={`font-bold ${tier.text}`}>
                    {(nextTier.pointsRequired - pts).toLocaleString("vi-VN")} điểm
                  </span>{" "}
                  để lên hạng{" "}
                  <span className={`font-bold ${TIER_STYLE[nextTier.name]?.text ?? "text-foreground"}`}>
                    {nextTier.name}
                  </span>
                </p>
              ) : (
                <p className="text-[10px] text-amber-500 font-semibold">Bạn đang ở hạng cao nhất ✦</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Widget 2: Tổng vé đã mua ── */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col justify-between">
        {loadingOrders ? (
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-9 w-16 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Ticket className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tổng vé đã mua
              </span>
            </div>
            <div>
              <p className="text-4xl font-black text-foreground tabular-nums leading-none">
                {totalTickets.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Từ{" "}
                <span className="font-semibold text-foreground">
                  {orders.length}
                </span>{" "}
                đơn hàng
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Widget 3: Tổng chi tiêu ── */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col justify-between">
        {loadingOrders ? (
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-9 w-36 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tổng chi tiêu
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground tabular-nums leading-none break-all">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">Từ các đơn đã thanh toán</p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
