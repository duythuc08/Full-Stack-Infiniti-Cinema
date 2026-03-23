// ─── Payment Success ─────────────────────────────────────────
export interface OrderData {
  orderId: string;
  qrCode?: string;
  bookingTime?: string;
  fullName?: string;
  totalTicketPrice?: number;
  totalFoodPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  promotionCode?: string;
  tickets?: { seatName: string; seatType: string; price: number }[];
  foods?: { name: string; quantity: number; totalPrice: number }[];
}

export interface OrderExtraInfo {
  movie?: string;
  moviePoster?: string;
  format?: string;
  cinema?: string;
  roomName?: string;
  date?: string;
  time?: string;
  paymentMethod?: string;
}

// ─── Payment Fail ─────────────────────────────────────────────
export interface AttemptedOrderInfo {
  movie?: string;
  moviePoster?: string;
  cinema?: string;
  roomName?: string;
  time?: string;
  date?: string;
  paymentMethod?: string;
  finalPrice?: number;
  totalAmount?: number;
}
