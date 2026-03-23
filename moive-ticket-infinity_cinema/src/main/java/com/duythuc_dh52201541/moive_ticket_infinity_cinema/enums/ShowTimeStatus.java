package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

public enum ShowTimeStatus {
    SCHEDULED,  // Đã lên lịch - Suất chiếu đã đặt lịch nhưng chưa bắt đầu
    ONGOING,    // Đang chiếu - Phim đang chiếu
    COMPLETED,  // Đã hoàn thành - Phim chiếu xong
    FULLY_BOOKED, //Ghe trong xuat chieu da dat full
    CANCELLED   // Đã hủy - Suất chiếu bị hủy
}
