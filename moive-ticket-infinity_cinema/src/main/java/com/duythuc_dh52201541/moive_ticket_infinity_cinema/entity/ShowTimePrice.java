package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class ShowTimePrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long showTimePriceId;

    @ManyToOne
    @JoinColumn(name = "show_time_id")
    ShowTimes showtimes;

    @Enumerated(EnumType.STRING)
    SeatType seatType;

    BigDecimal price;
}
