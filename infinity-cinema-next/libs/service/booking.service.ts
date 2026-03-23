import type { SeatShowTime, FoodProduct } from "@/types";

const BASE_URL = "/api-proxy";

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchSeatShowTimes(showTimeId: number, token: string): Promise<SeatShowTime[]> {
  const res = await fetch(
    `${BASE_URL}/seatShowTimes/getSeatShowTimes/by-showTime/${showTimeId}`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error("Lỗi kết nối API seatShowTimes");
  const data = await res.json();
  if (Array.isArray(data)) return data as SeatShowTime[];
  return (data.result ?? []) as SeatShowTime[];
}

export async function fetchSeatPrices(showTimeId: number, token: string): Promise<Record<string, number>> {
  const res = await fetch(
    `${BASE_URL}/showTimePrice/getPrice/by-showtime/${showTimeId}`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error("Lỗi kết nối API showTimePrice");
  const data = await res.json();

  const priceMap: Record<string, number> = {};
  if (data.result && Array.isArray(data.result)) {
    (data.result as { seatType: string; price: number }[]).forEach((item) => {
      priceMap[item.seatType] = item.price;
    });
  }
  return priceMap;
}

export async function fetchFoods(token: string): Promise<FoodProduct[]> {
  const res = await fetch(`${BASE_URL}/foods/getFoods`, { headers: authHeaders(token) });
  const data = await res.json();
  return ((data.result ?? []) as Record<string, unknown>[]).map((item) => ({
    id: item.foodId as number,
    name: item.name as string,
    desc: item.description as string,
    price: item.price as number,
    img: item.imageUrl as string,
    stock: item.stockQuantity as number,
    isCombo: item.isCombo as boolean,
  }));
}

export interface VnpayBookingPayload {
  userId: string;
  seatShowTimeIds: (number | undefined)[];
  foods: { foodId: number; quantity: number }[];
  promotionCode?: string;
}

export async function createVnpayBooking(
  token: string,
  payload: VnpayBookingPayload
): Promise<{ orderId: string; paymentUrl: string; finalPrice: number; discountAmount: number; [key: string]: unknown }> {
  const res = await fetch(`${BASE_URL}/payment/create-vnpay-booking`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.code !== 1000) throw new Error(data.message || "Tạo thanh toán VNPAY thất bại");
  return data.result;
}
