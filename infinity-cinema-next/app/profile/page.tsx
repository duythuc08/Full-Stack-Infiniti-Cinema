"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, Clock, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  fetchMyInfo,
  updateMyInfo,
  fetchAllMembershipTiers,
  fetchOrdersByUser,
  createVnpayRepaymentUrl,
} from "@/libs/service/user.service";
import type { UserInfo, MembershipTier, Order } from "@/types";
import type { ProfileFormState, TierConfig } from "@/types/user.types";

const getTierConfig = (tierName?: string): TierConfig => {
  switch (tierName) {
    case "SILVER":
      return { color: "text-slate-300", glow: "drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]", barColor: "from-slate-500 to-slate-300", label: "Bạc" };
    case "GOLD":
      return { color: "text-yellow-500", glow: "drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]", barColor: "from-yellow-700 to-yellow-400", label: "Vàng" };
    case "DIAMOND":
      return { color: "text-cyan-400", glow: "drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]", barColor: "from-cyan-600 to-cyan-300", animation: "animate-pulse", label: "Kim Cương" };
    default:
      return { color: "text-zinc-500", glow: "", barColor: "from-zinc-700 to-zinc-500", label: "Thành viên" };
  }
};

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

const formatDateTime = (value?: string) => {
  if (!value) return "---";
  return new Date(value).toLocaleString("vi-VN", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [allTiers, setAllTiers] = useState<MembershipTier[]>([]);
  const [form, setForm] = useState<ProfileFormState>({ firstname: "", lastname: "", phoneNumber: "", birthday: "" });
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch all membership tiers
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetchAllMembershipTiers(token)
      .then(setAllTiers)
      .catch((e) => console.error("Lỗi lấy danh sách hạng:", e));
  }, []);

  // Compute membership progress
  const progressData = useMemo(() => {
    if (!userInfo || allTiers.length === 0) return null;
    const currentPoints = userInfo.loyaltyPoints || 0;
    const nextTier = allTiers.find((t) => (t.pointsRequired || 0) > currentPoints);
    const currentTier = [...allTiers].reverse().find((t) => (t.pointsRequired || 0) <= currentPoints);

    if (!nextTier) return { isMax: true, currentPoints };

    const minPoints = currentTier ? (currentTier.pointsRequired || 0) : 0;
    const maxPoints = nextTier.pointsRequired || 0;
    const percentage = ((currentPoints - minPoints) / (maxPoints - minPoints)) * 100;

    return { percentage, nextTierName: nextTier.name, neededPoints: maxPoints - currentPoints, isMax: false };
  }, [userInfo, allTiers]);

  // Fetch user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadInfo = async () => {
      try {
        setLoadingInfo(true);
        const info = await fetchMyInfo(token);
        setUserInfo(info);
        setForm({
          firstname: info.firstname || "",
          lastname: info.lastname || "",
          phoneNumber: info.phoneNumber || "",
          birthday: info.birthday || "",
        });
        localStorage.setItem("user", JSON.stringify({
          userId: info.userId,
          username: info.username,
          firstname: info.firstname,
          lastname: info.lastname,
        }));
      } catch (e) {
        console.error(e);
        const err = e as Error;
        if (err.message?.includes("401") || err.message?.includes("403")) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
        } else {
          toast.error("Không thể tải thông tin tài khoản. Vui lòng thử lại.");
        }
      } finally {
        setLoadingInfo(false);
      }
    };

    loadInfo();
  }, [router]);

  // Fetch orders
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        let userId: string | null = null;
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed.userId || parsed.id || parsed.sub;
          }
        } catch { /* ignore */ }
        const finalUserId = userId || "ee389479-8571-4dd0-a76f-1a917fa24199";
        const result = await fetchOrdersByUser(token, finalUserId);
        setOrders(result);
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      await updateMyInfo(token, { ...userInfo, ...form });
      setUserInfo((prev) => prev ? { ...prev, ...form } : prev);
      toast.success("Cập nhật thông tin thành công!");
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Đang chờ thanh toán", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/40", icon: <Clock className="w-4 h-4" /> };
      case "CANCELLED":
        return { label: "Đã hủy", className: "bg-red-500/10 text-red-400 border-red-500/40", icon: <XCircle className="w-4 h-4" /> };
      default:
        return { label: "Đã thanh toán", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40", icon: <CheckCircle2 className="w-4 h-4" /> };
    }
  };

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.bookingTime || "").getTime() - new Date(a.bookingTime || "").getTime()),
    [orders]
  );

  const groupTickets = (tickets?: Order["tickets"]) => {
    if (!tickets) return [];
    return Object.values(
      tickets.reduce<Record<string, { seatType: string; count: number; totalPrice: number }>>((acc, t) => {
        const key = t.seatType;
        if (!acc[key]) acc[key] = { seatType: t.seatType, count: 0, totalPrice: 0 };
        acc[key].count += 1;
        acc[key].totalPrice += t.price;
        return acc;
      }, {})
    );
  };

  const groupFoods = (foods?: Order["foods"]) => {
    if (!foods) return [];
    return Object.values(
      foods.reduce<Record<string, { name: string; quantity: number; totalPrice: number }>>((acc, f) => {
        const key = f.name;
        if (!acc[key]) acc[key] = { name: f.name, quantity: 0, totalPrice: 0 };
        acc[key].quantity += f.quantity;
        acc[key].totalPrice += f.totalPrice;
        return acc;
      }, {})
    );
  };

  const handleRePayment = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const url = await createVnpayRepaymentUrl(token, orderId);
      window.location.href = url;
    } catch {
      toast.error("Không thể kết nối đến máy chủ thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-56 bg-card border border-border rounded-xl p-4 space-y-4 h-fit">
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white font-semibold">
              {(userInfo?.firstname?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Xin chào,</p>
              <p className="text-base font-semibold truncate max-w-[120px]">
                {userInfo ? `${userInfo.firstname || ""} ${userInfo.lastname || ""}`.trim() : "Người dùng"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("info")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${activeTab === "info" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            <User className="w-4 h-4" /> Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${activeTab === "orders" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            <CreditCard className="w-4 h-4" /> Thanh toán &amp; Đơn hàng
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "info" ? (
            <section className="bg-card border border-border rounded-xl p-6 sm:p-8 justify-items-center">
              <h1 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h1>

              {/* Membership Progress */}
              {!loadingInfo && userInfo && progressData && (
                <div className="w-full max-w-xl mb-8 p-6 rounded-xl bg-muted/40 border border-border shadow-inner">
                  <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Hạng hiện tại</p>
                      {(() => {
                        const tier = getTierConfig(userInfo.membetShipTierName);
                        return (
                          <div className={`flex items-center gap-2 font-black italic text-lg transition-all duration-500 ${tier.color} ${tier.glow} ${tier.animation || ""}`}>
                            <Trophy className="w-5 h-5" />
                            <span>{userInfo.membetShipTierName || "MEMBER"}</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Điểm tích lũy</p>
                      <p className="text-xl font-black">
                        {userInfo.loyaltyPoints || 0} <span className="text-xs text-muted-foreground font-normal">điểm</span>
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r transition-all duration-1000 ease-out ${getTierConfig(userInfo.membetShipTierName).barColor}`}
                      style={{ width: `${progressData.isMax ? 100 : progressData.percentage}%` }}
                    />
                  </div>

                  {!progressData.isMax ? (
                    <p className="text-[11px] mt-3 text-muted-foreground flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      Bạn cần thêm <span className="text-foreground font-bold">&nbsp;{progressData.neededPoints} điểm&nbsp;</span> để đạt hạng{" "}
                      <span className={`${getTierConfig(progressData.nextTierName).color} font-bold uppercase`}>&nbsp;{progressData.nextTierName}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] mt-3 text-yellow-500 font-bold italic flex items-center gap-1.5">
                      ✨ Tuyệt vời! Bạn đang ở hạng thành viên cao nhất.
                    </p>
                  )}
                </div>
              )}
              <hr className="w-full max-w-xl border-border mb-8" />

              {loadingInfo ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Đang tải thông tin...
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">Họ</Label>
                      <Input id="firstname" name="firstname" value={form.firstname} onChange={handleChange} className="bg-background border-input text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname">Tên</Label>
                      <Input id="lastname" name="lastname" value={form.lastname} onChange={handleChange} className="bg-background border-input text-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={userInfo?.username || ""} disabled className="bg-muted border-input text-muted-foreground cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="bg-background border-input text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Ngày sinh</Label>
                    <Input id="birthday" name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className="bg-background border-input text-foreground" />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={saving} className="cursor-pointer">
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              )}
            </section>
          ) : (
            <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Thanh toán &amp; Đơn hàng</h1>
              </div>

              {loadingOrders ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Đang tải đơn hàng...
                </div>
              ) : sortedOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">Bạn chưa có đơn hàng nào.</p>
              ) : (
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  {sortedOrders.map((order) => {
                    const statusCfg = getStatusConfig(order.orderStatus || "PAID");
                    return (
                      <div key={order.orderId} className="rounded-lg border border-border bg-muted/30 p-4 sm:p-5 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Mã đơn: <span className="text-foreground font-medium">#{order.orderId}</span></p>
                            <p className="text-sm text-muted-foreground">Thời gian đặt: <span className="text-foreground">{formatDateTime(order.bookingTime)}</span></p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`flex items-center gap-1 border ${statusCfg.className}`}>
                              {statusCfg.icon} <span className="text-xs sm:text-sm">{statusCfg.label}</span>
                            </Badge>
                            {order.orderStatus === "PENDING" && (
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 animate-pulse font-black uppercase text-[10px] sm:text-xs cursor-pointer"
                                onClick={() => handleRePayment(order.orderId)}
                              >
                                Thanh toán ngay
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm mt-4 bg-muted/40 p-5 rounded-lg border border-border items-center">
                          <div className="space-y-3 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 pr-4">
                            <div className="flex justify-between sm:flex-col">
                              <p className="text-muted-foreground">Tổng vé</p>
                              <p className="font-medium">{formatCurrency(order.totalTicketPrice)}</p>
                            </div>
                            <div className="flex justify-between sm:flex-col">
                              <p className="text-muted-foreground">Đồ ăn</p>
                              <p className="font-medium">{formatCurrency(order.totalFoodPrice)}</p>
                            </div>
                            <div className="flex justify-between sm:flex-col">
                              <p className="text-muted-foreground">Giảm giá</p>
                              <p className="text-red-400 font-medium">−{formatCurrency(order.discountAmount)}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center sm:items-start border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0">
                            <p className="text-muted-foreground mb-1">Tổng thanh toán</p>
                            <p className="text-primary font-bold text-2xl sm:text-3xl tracking-tight">{formatCurrency(order.finalPrice)}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-3">
                            {order.orderStatus === "PAID" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-muted-foreground text-[10px] uppercase">Mã vé QR</p>
                                  <p className="font-mono font-semibold text-sm break-all">{order.qrCode || order.orderId}</p>
                                </div>
                                <div className="bg-white p-1.5 rounded-md shadow-lg">
                                  <img
                                    alt="QR Code"
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                                    src={
                                      order.qrCode?.startsWith("data:image")
                                        ? order.qrCode
                                        : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(order.qrCode || order.orderId)}`
                                    }
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="w-24 h-24 rounded-md border-2 border-dashed border-border flex items-center justify-center text-[9px] text-muted-foreground text-center">
                                Chưa có mã QR
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border pt-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1 font-bold">Vé</p>
                            {order.tickets && order.tickets.length > 0 ? (
                              <ul className="space-y-1">
                                {groupTickets(order.tickets).map((t, idx) => (
                                  <li key={idx} className="flex justify-between">
                                    <span className="text-muted-foreground">{t.seatType} x{t.count}</span>
                                    <span>{formatCurrency(t.totalPrice)}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground italic text-[10px]">Không có dữ liệu vé</p>
                            )}
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1 font-bold">Đồ ăn</p>
                            {order.foods && order.foods.length > 0 ? (
                              <ul className="space-y-1">
                                {groupFoods(order.foods).map((f, idx) => (
                                  <li key={idx} className="flex justify-between">
                                    <span className="text-muted-foreground">{f.name} x{f.quantity}</span>
                                    <span>{formatCurrency(f.totalPrice)}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground italic text-[10px]">Không có đồ ăn</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
