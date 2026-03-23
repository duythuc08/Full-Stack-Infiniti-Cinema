import type { OrderData } from "@/types/order.types";

const BASE_URL = "/api-proxy";

export async function fetchOrderById(orderId: string, token: string): Promise<OrderData> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  if (!data.result) throw new Error(data.message || "Không có dữ liệu");
  return data.result as OrderData;
}
