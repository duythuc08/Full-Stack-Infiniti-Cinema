package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class MembershipTierResponse {
    String name;
    String description;
    Long pointsRequired; // Điểm tối thiểu để đạt hạng này
    BigDecimal discountPercent; // % giảm giá mặc định cho mỗi vé
    BigDecimal birthdayDiscount; // Ưu đãi tháng sinh nhật
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
