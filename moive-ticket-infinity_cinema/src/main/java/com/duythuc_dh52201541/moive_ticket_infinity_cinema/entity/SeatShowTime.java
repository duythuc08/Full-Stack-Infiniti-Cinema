package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatShowTimeStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SeatShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long seatShowTimeId;
    LocalDateTime lockedUntil;

    @ManyToOne
    @JoinColumn(name = "user_id")
    Users users;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    Seats seats;

    @ManyToOne
    @JoinColumn(name = "show_time_id")
    ShowTimes showTimes;

    @OneToMany(mappedBy = "seatShowTime", fetch = FetchType.LAZY)
    @JsonIgnore // Thêm cái này để tránh vòng lặp vô tận khi gọi API
    private List<OrderTickets> orderTickets;

    @Enumerated(EnumType.STRING)
    SeatShowTimeStatus seatShowTimeStatus;
}
