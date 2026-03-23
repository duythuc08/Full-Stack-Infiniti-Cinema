package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class UserPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    Users users;  // Người dùng

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    Promotion promotion;  // Mã khuyến mãi

    Boolean isUsed;             // Đã dùng chưa
    LocalDateTime usedAt;  // Thời gian sử dụng
}
