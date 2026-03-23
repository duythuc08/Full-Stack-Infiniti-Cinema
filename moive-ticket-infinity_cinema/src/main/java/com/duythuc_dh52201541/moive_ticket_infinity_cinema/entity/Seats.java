package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "seat")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Seats {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long seatId;
    String seatRow;
    Integer seatNumber;

    @ManyToOne
    @JoinColumn(name = "room_id")
    Rooms rooms;

    @Enumerated(EnumType.STRING)
    SeatType  seatType;
    @Enumerated(EnumType.STRING)
    SeatStatus seatStatus;
}
