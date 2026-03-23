package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="loyalty_points_history")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class LoyaltyPointsHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Orders order; // Điểm này đến từ hóa đơn nào?

    int pointsChange; // VD: +50 hoặc -100

    String description; // Nội dung (VD: "Tích điểm mua vé Endgame")

    int oldBalance; // Số dư trước khi thay đổi

    int newBalance; // Số dư sau khi thay đổi

    @CreationTimestamp
    LocalDateTime createdAt;
}
