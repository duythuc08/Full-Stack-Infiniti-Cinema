package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="order_ticket")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class OrderTickets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long orderTicketId;
    @Column(nullable = false)
    BigDecimal price;


    @Enumerated(EnumType.STRING)
    TicketStatus ticketStatus;

    LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    Orders orders;

    @ManyToOne(fetch = FetchType.LAZY) // Đổi thành ManyToOne
    @JoinColumn(name = "seat_show_time_id")
    SeatShowTime seatShowTime;
}
