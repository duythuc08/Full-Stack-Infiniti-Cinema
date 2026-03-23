"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PersonalInfo } from "./components/PersonalInfo";
import { OrderHistory } from "./components/OrderHistory";
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import {
  fetchMyInfo,
  updateMyInfo,
  fetchAllMembershipTiers,
  fetchOrdersByUser,
} from "@/libs/service/user.service";
import type { UserInfo, MembershipTier, Order } from "@/types";
import type { ProfileFormState } from "@/types/user.types";

export default function ProfilePage() {
  const router = useRouter();

  const [activeTab,     setActiveTab]     = useState<"info" | "orders">("info");
  const [loadingInfo,   setLoadingInfo]   = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [userInfo,      setUserInfo]      = useState<UserInfo | null>(null);
  const [allTiers,      setAllTiers]      = useState<MembershipTier[]>([]);
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [form,          setForm]          = useState<ProfileFormState>({
    firstname: "", lastname: "", phoneNumber: "", birthday: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen,    setDialogOpen]    = useState(false);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingOrder");
    router.push("/login");
  };

  /* ── Load membership tiers ── */
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetchAllMembershipTiers(token)
      .then(setAllTiers)
      .catch((e) => console.error("Lỗi lấy hạng thành viên:", e));
  }, []);

  /* ── Load user info (1 lần, ghi userId vào localStorage) ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    (async () => {
      try {
        setLoadingInfo(true);
        const info = await fetchMyInfo(token);
        setUserInfo(info);
        setForm({
          firstname:   info.firstname   || "",
          lastname:    info.lastname    || "",
          phoneNumber: info.phoneNumber || "",
          birthday:    info.birthday    || "",
        });
        localStorage.setItem("user", JSON.stringify({
          userId:              info.userId,
          username:            info.username,
          firstname:           info.firstname,
          lastname:            info.lastname,
          birthday:            info.birthday,
          memberShipTierName:  info.membetShipTierName || info.memberShipTierName,
        }));
      } catch (e) {
        const err = e as Error;
        if (err.message?.includes("401") || err.message?.includes("403")) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
        } else {
          toast.error("Không thể tải thông tin tài khoản.");
        }
      } finally {
        setLoadingInfo(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load orders SAU KHI có userId (tránh race condition) ── */
  useEffect(() => {
    if (!userInfo?.userId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        setLoadingOrders(true);
        const result = await fetchOrdersByUser(token, userInfo.userId);
        setOrders(Array.isArray(result) ? result : []);
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải danh sách đơn hàng.");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [userInfo?.userId]);

  /* ── Form handlers ── */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      await updateMyInfo(token, { ...userInfo, ...form });
      setUserInfo((p) => (p ? { ...p, ...form } : p));
      toast.success("Cập nhật thông tin thành công!");
    } catch {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Dialog ── */
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950/50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">

          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userInfo={userInfo}
            onLogout={handleLogout}
            loading={loadingInfo}
          />

          <main className="min-w-0">
            {activeTab === "info" ? (
              <PersonalInfo
                userInfo={userInfo}
                allTiers={allTiers}
                form={form}
                saving={saving}
                loading={loadingInfo}
                onFormChange={handleFormChange}
                onSave={handleSave}
              />
            ) : (
              <OrderHistory
                orders={orders}
                loading={loadingOrders}
                onSelectOrder={handleSelectOrder}
              />
            )}
          </main>

        </div>
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
