package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

public enum OrderStatus {
    PENDING,    // Đang chờ - Đơn hàng được tạo nhưng chưa thanh toán
    PAID,       // Đã thanh toán - Thanh toán thành công
    CANCELLED,  // Đã hủy - Khách hủy hoặc admin hủy
    EXPIRED     // Hết hạn - Quá thời gian giữ ghế mà không thanh toán
}
