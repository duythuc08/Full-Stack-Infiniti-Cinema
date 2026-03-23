package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.ShowTimeStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "show_time")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ShowTimes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long showTimeId;

    LocalDateTime startTime;
    LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    Movies movies;

    @ManyToOne
    @JoinColumn(name = "room_id")
    Rooms rooms;

    @OneToMany(mappedBy = "showtimes", cascade = CascadeType.ALL)
    Set<ShowTimePrice> prices;

    @Enumerated(EnumType.STRING)
    ShowTimeStatus showTimeStatus;
}
