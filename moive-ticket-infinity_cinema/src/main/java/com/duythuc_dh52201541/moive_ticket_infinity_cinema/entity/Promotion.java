package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.DayOfWeek;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.PromotionStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.PromotionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name="promotion")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long promotionId;

    @Column(unique = true, nullable = false)
    String code;              // Mã khuyến mãi
    String name;              // Tên chương trình
    @Lob
    String description;       // Mô tả
    BigDecimal discountValue;     // Giá trị giảm
    BigDecimal minOrderValue;     // Giá trị đơn tối thiểu
    BigDecimal maxDiscountAmount; // Giảm tối đa
    Integer useLimit;       // Tổng số lượt sử dụng
    Integer usedCount;        // Đã dùng bao nhiêu lần

    LocalDateTime startTime;  // Thời gian bắt đầu
    LocalDateTime endTime;    // Thời gian kết thúc

    @OneToMany(mappedBy = "promotion")
    Set<UserPromotion> userPromotion;

    @ManyToMany
    @JoinTable(
            name = "promotion_movies",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    Set<Movies> applicableMovies;

    @ElementCollection(targetClass = DayOfWeek.class)
    @Enumerated(EnumType.STRING)
    Set<DayOfWeek> dayOfWeek;    // Các ngày áp dụng

    @Enumerated(EnumType.STRING)
    PromotionStatus status;

    @Enumerated(EnumType.STRING)
    PromotionType type;
}

