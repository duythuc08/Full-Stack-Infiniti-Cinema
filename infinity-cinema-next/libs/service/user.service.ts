import type { UserInfo, MembershipTier, Order } from "@/types";

const BASE_URL = "/api-proxy";

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchMyInfo(token: string): Promise<UserInfo> {
  const res = await fetch(`${BASE_URL}/users/myInfo`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không lấy được thông tin người dùng");
  return data.result as UserInfo;
}

export async function updateMyInfo(token: string, payload: Partial<UserInfo>): Promise<UserInfo> {
  const res = await fetch(`${BASE_URL}/users/myInfo`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cập nhật thông tin thất bại");
  return data.result as UserInfo;
}

export async function fetchAllMembershipTiers(token: string): Promise<MembershipTier[]> {
  const res = await fetch(`${BASE_URL}/membership-tiers/getAllMembershipTiers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.result) return [];
  return (data.result as MembershipTier[]).sort(
    (a, b) => (a.pointsRequired || 0) - (b.pointsRequired || 0)
  );
}

export async function fetchMembershipTierByName(token: string, tierName: string): Promise<MembershipTier | null> {
  try {
    const res = await fetch(`${BASE_URL}/membership-tiers/getMembershipTier/${tierName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.result) return data.result as MembershipTier;
    return null;
  } catch {
    return null;
  }
}

export async function fetchOrdersByUser(token: string, userId: string): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders/user/${userId}`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không lấy được danh sách đơn hàng");
  return data.result as Order[];
}

export async function createVnpayRepaymentUrl(token: string, orderId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/payment/create-vnpay-url?orderId=${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.result) throw new Error(data.message || "Không thể lấy link thanh toán");
  return data.result as string;
}
