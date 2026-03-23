package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name="orders")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long orderId;  // ID đơn hàng (khóa chính, tự tăng)

    @ManyToOne
    @JoinColumn(name = "user_id")
    Users users;  // Người dùng thực hiện đặt vé

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<OrderTickets> orderTickets;  // Danh sách vé trong đơn hàng

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<OrderFoods> orderFoods;  // Danh sách món ăn đi kèm (nếu có)

    BigDecimal totalTicketPrice;  // Tổng tiền vé
    BigDecimal totalFoodPrice;    // Tổng tiền đồ ăn
    BigDecimal discountAmount;    // Số tiền giảm giá (nếu có)
    BigDecimal finalPrice;        // Tổng tiền phải thanh toán sau giảm giá
    String promotionCode;         // Mã khuyến mãi được áp dụng (nếu có)

    @Enumerated(EnumType.STRING)
    OrderStatus orderStatus;       // Trạng thái đơn hàng (đang xử lý, đã thanh toán, đã hủy,...)

    String qrCode;

    LocalDateTime bookingTime;    // Thời điểm người dùng đặt vé
    LocalDateTime expiredTime;    // Thời điểm hết hạn giữ vé (nếu chưa thanh toán)
    LocalDateTime createdAt;      // Ngày tạo đơn hàng
    LocalDateTime updatedAt;      // Ngày cập nhật cuối cùng

    int pointsEarned;
    BigDecimal memberDiscountAmount;
}

