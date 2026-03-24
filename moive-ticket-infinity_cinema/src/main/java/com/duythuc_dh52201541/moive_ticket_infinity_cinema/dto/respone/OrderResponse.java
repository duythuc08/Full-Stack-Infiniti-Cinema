package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long orderId;
    String userId;
    String fullName;

    BigDecimal totalTicketPrice;  // Tổng tiền vé
    BigDecimal totalFoodPrice;    // Tổng tiền đồ ăn
    BigDecimal discountAmount;    // Số tiền giảm giá (nếu có)
    BigDecimal finalPrice;        // Tổng tiền phải thanh toán sau giảm giá
    String promotionCode;
    OrderStatus orderStatus;
    LocalDateTime bookingTime;    // Thời điểm người dùng đặt vé
    LocalDateTime expiredTime;    // Thời điểm hết hạn giữ vé (nếu chưa thanh toán)
    LocalDateTime createdAt;      // Ngày tạo đơn hàng
    LocalDateTime updatedAt;      // Ngày cập nhật cuối cùng
    String qrCode;

    List<OrderTicketResponse> tickets;
    List<OrderFoodResponse> foods;

    BigDecimal memberDiscountAmount;
    int pointsEarned;

    // Thông tin rạp chiếu & phim (trích từ vé đầu tiên)
    String movieTitle;
    String cinemaName;
    String cinemaAddress;
    String showTime;
    String roomName;
}
