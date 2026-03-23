package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

public enum SeatShowTimeStatus {
    AVAILABLE,  // Có sẵn - Ghế chưa ai đặt
    RESERVED,   // Đang giữ chỗ - Ai đó đang chọn ghế nhưng chưa thanh toán
    SOLD,       // Đã bán - Đã thanh toán thành công
    BLOCKED     // Bị khóa - Admin chặn ghế (VD: ghế VIP dành riêng)
}
