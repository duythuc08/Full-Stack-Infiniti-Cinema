package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

/**
 * Enum đại diện cho các ngày trong tuần.
 * Dùng cho: lịch chiếu, giá vé theo ngày, hoặc khuyến mãi theo ngày cụ thể.
 */
public enum DayOfWeek {
    MONDAY("Thứ Hai"),
    TUESDAY("Thứ Ba"),
    WEDNESDAY("Thứ Tư"),
    THURSDAY("Thứ Năm"),
    FRIDAY("Thứ Sáu"),
    SATURDAY("Thứ Bảy"),
    SUNDAY("Chủ Nhật");

    private final String vietnameseName;

    DayOfWeek(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }
}
