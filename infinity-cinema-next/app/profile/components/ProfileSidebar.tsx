"use client";

import { User, Ticket, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserInfo } from "@/types";

interface Props {
  activeTab: "info" | "orders";
  onTabChange: (tab: "info" | "orders") => void;
  userInfo: UserInfo | null;
  onLogout: () => void;
  loading: boolean;
}

const TIER_COLORS: Record<string, string> = {
  MEMBER:  "text-slate-500",
  SILVER:  "text-blue-500",
  GOLD:    "text-amber-500",
  DIAMOND: "text-cyan-400",
};

const TABS = [
  { key: "info"   as const, label: "Thông tin cá nhân", icon: <User   className="w-4 h-4" /> },
  { key: "orders" as const, label: "Đơn hàng & Vé",     icon: <Ticket className="w-4 h-4" /> },
];

export function ProfileSidebar({ activeTab, onTabChange, userInfo, onLogout, loading }: Props) {
  const tierName  = userInfo?.memberShipTierName ?? "MEMBER";
  const tierColor = TIER_COLORS[tierName] ?? "text-slate-500";
  const fullName  = userInfo ? `${userInfo.firstname || ""} ${userInfo.lastname || ""}`.trim() : "";
  const initials  = userInfo
    ? `${(userInfo.firstname?.[0] || "").toUpperCase()}${(userInfo.lastname?.[0] || "").toUpperCase()}`
    : "U";

  return (
    <aside className="flex flex-col gap-3">
      {/* User Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5">
        {loading ? (
          <div className="flex items-center gap-3 mb-5">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-md shadow-primary/30 flex-shrink-0 select-none">
              {initials || <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground text-sm truncate">{fullName || "Người dùng"}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo?.username}</p>
              <p className={`text-xs font-semibold mt-0.5 ${tierColor}`}>{tierName}</p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-150 cursor-pointer ${
                activeTab === key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
