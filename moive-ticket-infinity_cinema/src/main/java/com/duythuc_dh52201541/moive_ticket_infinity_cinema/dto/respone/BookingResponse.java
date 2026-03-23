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
public class BookingResponse {
    // ===== THÔNG TIN ĐƠN HÀNG =====
    Long orderId;
    String userId;
    String fullName;
    OrderStatus orderStatus;

    // ===== THÔNG TIN GIÁ TIỀN =====
    BigDecimal totalTicketPrice;   // Tổng tiền vé
    BigDecimal totalFoodPrice;     // Tổng tiền đồ ăn
    BigDecimal discountAmount;     // Số tiền được giảm
    BigDecimal finalPrice;         // Số tiền phải thanh toán
    String promotionCode;          // Mã giảm giá đã áp dụng

    // ===== THÔNG TIN THỜI GIAN =====
    LocalDateTime bookingTime;     // Thời điểm đặt vé
    LocalDateTime expiredTime;     // Thời điểm hết hạn thanh toán

    // ===== CHI TIẾT VÉ & ĐỒ ĂN =====
    List<OrderTicketResponse> tickets;
    List<OrderFoodResponse> foods;

    // ===== THÔNG TIN THANH TOÁN VNPAY =====
    String paymentUrl;             // URL redirect đến VNPay
}
