package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="membership_tiers")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class MembershipTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long tierId;

    @Column(nullable = false, length = 50)
    String name;

    @Lob
    String description;

    Long pointsRequired; // Điểm tối thiểu để đạt hạng này

    @Column(precision = 5, scale = 2)
    BigDecimal discountPercent; // % giảm giá mặc định cho mỗi vé

    @Column(precision = 5, scale = 2)
    BigDecimal birthdayDiscount; // Ưu đãi tháng sinh nhật


    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
}
