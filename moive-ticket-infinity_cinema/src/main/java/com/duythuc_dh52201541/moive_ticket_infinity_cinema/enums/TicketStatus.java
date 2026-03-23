package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

public enum TicketStatus {
    RESERVED,   // Đang giữ - Vé đang được giữ chỗ (chưa thanh toán)
    CONFIRMED,  // Đã xác nhận - Đã thanh toán, vé hợp lệ
    USED,       // Đã sử dụng - Đã check-in vào rạp (quét QR code)
    CANCELLED   // Đã hủy - Vé bị hủy
}
